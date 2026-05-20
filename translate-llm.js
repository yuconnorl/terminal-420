/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * translate-llm.js
 *
 * MDX translator: zh-TW → English using the Anthropic Claude API.
 *
 * Strategy
 * --------
 * 1. Parse the MDX body into an AST (via remark + remark-mdx + remark-frontmatter).
 * 2. Walk the top-level children and group them into "sections":
 *    each section is a heading (h1/h2) plus all the nodes that follow until
 *    the next heading of the same or higher level.
 * 3. Re-serialise every section back to an MDX string and send it to Claude
 *    with a strict system prompt that instructs it to translate Chinese text
 *    while leaving ALL MDX / JSX / markdown syntax intact.
 * 4. Concatenate the translated sections and reassemble with the frontmatter.
 *
 * Why this beats the existing approaches
 * ---------------------------------------
 * - translate.js (regex placeholders): fragile on nested JSX, loses structure.
 * - translate-ast.js (node-by-node Google Translate): loses paragraph context,
 *   produces stilted output.
 * - This script: Claude sees full paragraphs/sections → better fluency and
 *   terminology consistency. The AST handles structure, not regexes.
 *
 * Requirements
 * ------------
 *   ANTHROPIC_API_KEY  env var (required)
 *   node_modules must contain: unified, remark-parse, remark-mdx,
 *                               remark-frontmatter, remark-stringify, js-yaml
 *   (same deps as translate-ast.js – no new installs needed)
 *
 * Usage
 * -----
 *   node translate-llm.js [options]
 *
 *   --source  <dir>   Source directory  (default: src/contents/zh-TW)
 *   --target  <dir>   Target directory  (default: src/contents/en)
 *   --from    <lang>  Source language   (default: zh-TW)
 *   --to      <lang>  Target language   (default: en)
 *   --file    <name>  Single filename to translate (relative to source dir)
 *   --overwrite       Re-translate files that already exist in the target dir
 *   --dry-run         Parse & chunk without writing output
 *   --model   <id>    Claude model to use (default: claude-sonnet-4-20250514)
 *   --concurrency <n> Max parallel section translations (default: 3)
 */

const fs = require('fs')
const fsp = fs.promises
const path = require('path')
const { pathToFileURL } = require('url')

// ─── Defaults ────────────────────────────────────────────────────────────────

const DEFAULT_SOURCE_DIR = 'src/contents/zh-TW'
const DEFAULT_TARGET_DIR = 'src/contents/en'
const DEFAULT_SOURCE_LANGUAGE = 'zh-TW'
const DEFAULT_TARGET_LANGUAGE = 'en'
const DEFAULT_MODEL = 'claude-sonnet-4-20250514'
const DEFAULT_CONCURRENCY = 3
const DEFAULT_MAX_RETRIES = 2
const DEFAULT_MAX_SECTION_CHARS = 3500

const FRONTMATTER_TRANSLATABLE_KEYS = new Set(['title', 'description'])
const JSX_TRANSLATABLE_ATTRIBUTES = new Set(['alt', 'caption', 'title', 'content', 'label'])
const GENERAL_GLOSSARY = {
  奇幻蘑菇: 'magic mushrooms',
  神聖蘑菇: 'sacred mushroom',
  裸蓋菇鹼: 'psilocybin',
  脫磷酸裸蓋菇鹼: 'psilocin',
  守夜儀式: 'vigil ceremony',
  致幻蘑菇: 'hallucinogenic mushrooms',
  精神活性物質: 'psychoactive substances',
  真菌: 'fungi',
}
const FILE_GLOSSARIES = {
  'magic-mushroom-taxonomy.mdx': {
    Teonanácatl: 'Teonanácatl',
    peyote: 'peyote',
    奇幻蘑菇: 'magic mushrooms',
    神的血肉: "God's Flesh",
    阿茲特克: 'Aztec',
    裸蓋菇屬: 'the genus Psilocybe',
  },
}
const PLACEHOLDER_PATTERN = /__PRESERVE_[A-Z0-9_]+__/
const PLACEHOLDER_SPLIT_PATTERN = /(__PRESERVE_[A-Z0-9_]+__)/
const PLACEHOLDER_EXTRACT_PATTERN = /__PRESERVE_[A-Z0-9_]+__/g
const PROTECTED_SEGMENT_PATTERNS = [
  { type: 'CODE_BLOCK', regex: /```[\s\S]*?```/g },
  { type: 'INLINE_CODE', regex: /`[^`\n]+`/g },
  { type: 'IMPORT_EXPORT', regex: /^(?:import|export)\s+.*$/gm },
  { type: 'HTML_PAIR', regex: /<([a-z][A-Za-z0-9.:-]*)(?:\s[^<>]*?)?>[\s\S]*?<\/\1>/g },
  { type: 'MDX_TAG', regex: /<\/?[A-Za-z][A-Za-z0-9.:-]*(?:\s[^<>]*?)?\/?>/g },
  { type: 'FOOTNOTE', regex: /\[\^[^\]]+\]/g },
  { type: 'MDX_EXPR', regex: /\{[^{}\n]+\}/g },
]

/** Headings matching these patterns are the "References" section – skip them. */
const REFERENCE_HEADING_REGEX = /^(references?|reference|參考資料|参考资料)$/i

/**
 * CustomAccordion with title="原文" / title="original" marks the preserved
 * source text block – we must NOT translate its contents.
 */
const ORIGINAL_ACCORDION_TITLE_REGEX = /^(原文|original)$/i
const FOOTNOTE_DEFINITION_REGEX = /^(\[\^[^\]]+\]:\s*)(.+)$/

// ─── Environment helpers ─────────────────────────────────────────────────────

function loadDotEnv(filePath = path.join(process.cwd(), '.env')) {
  if (!fs.existsSync(filePath)) {
    return
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/)

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      return
    }

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!match) {
      return
    }

    const key = match[1]
    let value = match[2].trim()

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
      process.env[key] = value
    }
  })
}

function redactKnownSecrets(text) {
  if (!text) {
    return text
  }

  let redacted = String(text)
  ;['ANTHROPIC_API_KEY', 'GOOGLE_CLOUD_API_KEY'].forEach((key) => {
    const value = process.env[key]
    if (value && value.length >= 8) {
      redacted = redacted.split(value).join(`[redacted ${key}]`)
    }
  })

  return redacted
    .replace(/sk-ant-[A-Za-z0-9_-]+/g, '[redacted anthropic key]')
    .replace(/AIza[0-9A-Za-z_-]+/g, '[redacted google key]')
}

function safeErrorMessage(error) {
  return redactKnownSecrets(error && error.message ? error.message : String(error))
}

// ─── CLI argument parsing ─────────────────────────────────────────────────────

function parseArgs(argv) {
  const options = {
    sourceDir: DEFAULT_SOURCE_DIR,
    targetDir: DEFAULT_TARGET_DIR,
    from: DEFAULT_SOURCE_LANGUAGE,
    to: DEFAULT_TARGET_LANGUAGE,
    file: null,
    overwrite: false,
    dryRun: false,
    model: DEFAULT_MODEL,
    concurrency: DEFAULT_CONCURRENCY,
    maxRetries: DEFAULT_MAX_RETRIES,
    maxSectionChars: DEFAULT_MAX_SECTION_CHARS,
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === '--overwrite') {
      options.overwrite = true
      continue
    }
    if (arg === '--dry-run') {
      options.dryRun = true
      continue
    }

    const next = argv[i + 1]
    if (!next) throw new Error(`Missing value for ${arg}`)

    switch (arg) {
      case '--source':
        options.sourceDir = next
        i++
        break
      case '--target':
        options.targetDir = next
        i++
        break
      case '--from':
        options.from = next
        i++
        break
      case '--to':
        options.to = next
        i++
        break
      case '--file':
        options.file = next
        i++
        break
      case '--model':
        options.model = next
        i++
        break
      case '--concurrency':
        options.concurrency = Number(next) || DEFAULT_CONCURRENCY
        i++
        break
      case '--max-retries':
        options.maxRetries = Number(next) || DEFAULT_MAX_RETRIES
        i++
        break
      case '--section-chars':
        options.maxSectionChars = Number(next) || DEFAULT_MAX_SECTION_CHARS
        i++
        break
      default:
        throw new Error(`Unknown argument: ${arg}`)
    }
  }

  return options
}

// ─── Package resolution (mirrors translate-ast.js) ───────────────────────────

function getPackageDir(packageName) {
  const direct = path.join(process.cwd(), 'node_modules', packageName)
  if (fs.existsSync(direct)) return direct

  const pnpmRoot = path.join(process.cwd(), 'node_modules', '.pnpm')
  if (!fs.existsSync(pnpmRoot)) throw new Error(`Cannot resolve "${packageName}"`)

  for (const entry of fs.readdirSync(pnpmRoot)) {
    const candidate = path.join(pnpmRoot, entry, 'node_modules', packageName)
    if (fs.existsSync(candidate)) return candidate
  }
  throw new Error(`Cannot resolve "${packageName}" from node_modules/.pnpm`)
}

async function importPackage(name) {
  const dir = getPackageDir(name)
  const pkg = JSON.parse(await fsp.readFile(path.join(dir, 'package.json'), 'utf8'))
  const entry = pkg.module || pkg.main || 'index.js'
  return import(pathToFileURL(path.join(dir, entry)).href)
}

function requirePackage(name) {
  return require(getPackageDir(name))
}

// ─── Lazy runtime loader ──────────────────────────────────────────────────────

let _runtimePromise

async function loadRuntime() {
  if (!_runtimePromise) {
    _runtimePromise = (async () => {
      const [
        { unified },
        { default: remarkParse },
        { default: remarkMdx },
        { default: remarkGfm },
        { default: remarkFrontmatter },
        { default: remarkStringify },
      ] = await Promise.all([
        importPackage('unified'),
        importPackage('remark-parse'),
        importPackage('remark-mdx'),
        importPackage('remark-gfm'),
        importPackage('remark-frontmatter'),
        importPackage('remark-stringify'),
      ])
      const yaml = requirePackage('js-yaml')
      return { unified, remarkParse, remarkMdx, remarkGfm, remarkFrontmatter, remarkStringify, yaml }
    })()
  }
  return _runtimePromise
}

// ─── Remark processor factory ─────────────────────────────────────────────────

function createProcessor(runtime) {
  return runtime
    .unified()
    .use(runtime.remarkParse)
    .use(runtime.remarkMdx)
    .use(runtime.remarkGfm)
    .use(runtime.remarkFrontmatter, ['yaml'])
    .use(runtime.remarkStringify, {
      fences: true,
      bullet: '-',
      listItemIndent: 'one',
      emphasis: '*',
      strong: '*',
      rule: '-',
    })
}

// ─── Frontmatter helpers ──────────────────────────────────────────────────────

function splitFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match) return { frontmatter: '', body: content }
  return { frontmatter: match[1], body: content.slice(match[0].length) }
}

function stringifyFrontmatter(data, yaml) {
  return yaml.dump(data, { lineWidth: 0, noRefs: true, quotingType: '"', forceQuotes: false }).trimEnd()
}

function parseFrontmatter(raw, yaml) {
  if (!raw.trim()) return null
  return yaml.load(raw) || {}
}

// ─── AST helpers ─────────────────────────────────────────────────────────────

function getHeadingText(node) {
  return node.children
    .filter((c) => c.type === 'text')
    .map((c) => c.value)
    .join('')
    .trim()
}

function serializeNodes(processor, nodes) {
  return String(processor.stringify({ type: 'root', children: nodes })).trimEnd()
}

function isOriginalAccordion(node) {
  if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') return false
  if (node.name !== 'CustomAccordion') return false
  return (
    Array.isArray(node.attributes) &&
    node.attributes.some(
      (a) =>
        a &&
        a.type === 'mdxJsxAttribute' &&
        a.name === 'title' &&
        typeof a.value === 'string' &&
        ORIGINAL_ACCORDION_TITLE_REGEX.test(a.value.trim()),
    )
  )
}

function containsHan(text) {
  return /[\u3400-\u9FFF\uF900-\uFAFF]/.test(text)
}

function buildGlossaryEntries(fileName) {
  const entries = { ...GENERAL_GLOSSARY, ...(FILE_GLOSSARIES[fileName] || {}) }
  return Object.entries(entries)
}

function buildGlossaryPrompt(fileName) {
  const entries = buildGlossaryEntries(fileName)
  if (entries.length === 0) return ''

  return `Preferred terminology:\n${entries.map(([source, target]) => `- ${source} -> ${target}`).join('\n')}`
}

function createPlaceholder(type, index) {
  return `__PRESERVE_${type}_${index}__`
}

function protectPattern(content, regex, type, protections) {
  return content.replace(regex, (match) => {
    const placeholder = createPlaceholder(type, protections.length)
    protections.push({ placeholder, original: match })
    return placeholder
  })
}

function protectMarkdownLinks(content, protections) {
  return content.replace(/(!?\[[^\]]*\]\()([^)]+)(\))/g, (_, prefix, url, suffix) => {
    const placeholder = createPlaceholder('URL', protections.length)
    protections.push({ placeholder, original: url })
    return `${prefix}${placeholder}${suffix}`
  })
}

function protectCriticalSyntax(content) {
  const protections = []
  let protectedText = content

  PROTECTED_SEGMENT_PATTERNS.forEach(({ type, regex }) => {
    protectedText = protectPattern(protectedText, regex, type, protections)
  })
  protectedText = protectMarkdownLinks(protectedText, protections)

  return { protectedText, protections }
}

function restoreProtectedSyntax(content, protections) {
  let restored = content
  let changed = true

  while (changed) {
    changed = false
    protections.forEach(({ placeholder, original }) => {
      if (restored.includes(placeholder)) {
        restored = restored.split(placeholder).join(original)
        changed = true
      }
    })
  }

  return restored
}

function ensurePlaceholdersPreserved(content, protections, expectedSource) {
  const expectedPlaceholders = new Set(expectedSource.match(PLACEHOLDER_EXTRACT_PATTERN) || [])
  const missing = protections.filter(
    ({ placeholder }) => expectedPlaceholders.has(placeholder) && !content.includes(placeholder),
  )
  if (missing.length > 0) {
    throw new Error(`Translation dropped ${missing.length} protected placeholder(s)`)
  }
}

async function translateProtectedText(protectedText, protections, options, context) {
  const parts = protectedText.split(PLACEHOLDER_SPLIT_PATTERN)
  const translatedParts = []

  for (const part of parts) {
    if (!part) {
      continue
    }

    if (PLACEHOLDER_PATTERN.test(part)) {
      translatedParts.push(part)
      continue
    }

    if (!containsHan(part)) {
      translatedParts.push(part)
      continue
    }

    const leadingWhitespace = part.match(/^\s*/)[0]
    const trailingWhitespace = part.match(/\s*$/)[0]
    const core = part.slice(leadingWhitespace.length, part.length - trailingWhitespace.length)

    if (!core) {
      translatedParts.push(part)
      continue
    }

    const translatedCore = await callAnthropicTranslate(core, options, {
      ...context,
      contentKind:
        'fragment between protected MDX tokens; translate only this fragment and do not complete surrounding syntax',
    })

    translatedParts.push(`${leadingWhitespace}${translatedCore.trim()}${trailingWhitespace}`)
  }

  const translated = translatedParts.join('')
  ensurePlaceholdersPreserved(translated, protections, protectedText)
  return restoreProtectedSyntax(translated, protections)
}

function comparePatternCount(source, translated, regex, label) {
  const sourceCount = (source.match(regex) || []).length
  const translatedCount = (translated.match(regex) || []).length
  if (sourceCount !== translatedCount) {
    throw new Error(`${label} count changed (${sourceCount} -> ${translatedCount})`)
  }
}

function validateTranslatedSection(source, translated, processor) {
  processor.parse(translated)
  comparePatternCount(source, translated, /```/g, 'code fence')
  comparePatternCount(source, translated, /\[\^[^\]]+\]/g, 'footnote marker')
  comparePatternCount(source, translated, /^import\s+.*$/gm, 'import statement')
  comparePatternCount(source, translated, /<\/?[A-Za-z][A-Za-z0-9.:-]*(?:\s[^<>]*?)?\/?>/g, 'MDX/HTML tag')
}

async function translatePlainTextValue(value, options, context = {}) {
  const { protectedText, protections } = protectCriticalSyntax(value)
  return (await translateProtectedText(protectedText, protections, options, context)).trim()
}

async function translateReferenceFootnoteLines(body, options) {
  const lines = body.split('\n')

  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(FOOTNOTE_DEFINITION_REGEX)
    if (!match || !containsHan(match[2])) {
      continue
    }

    lines[index] =
      match[1] +
      (await translatePlainTextValue(match[2], options, {
        fileName: options.currentFileName,
        sectionLabel: 'reference footnote',
        glossaryPrompt: buildGlossaryPrompt(options.currentFileName),
      }))
  }

  return lines.join('\n')
}

function normalizeMdxSpacing(content) {
  const blockComponent = String.raw`(?:Admonition|CustomAccordion|CustomImage|SpecialAdmonition|Callout)`
  const blockTag = String.raw`<\/?${blockComponent}(?:\s[^<>]*?)?\/?>`

  return content
    .replace(/<((?:Tooltip|sub|sup)\b[^>]*)>\s+/g, '<$1>')
    .replace(/\s+<\/(Tooltip|sub|sup)>/g, '</$1>')
    .replace(new RegExp(`([^\\n])(${blockTag})`, 'g'), '$1\n\n$2')
    .replace(new RegExp(`(${blockTag})([^\\n])`, 'g'), '$1\n\n$2')
    .replace(/([^\n])(\n?##\s)/g, '$1\n\n$2')
    .replace(/\n{3,}/g, '\n\n')
}

function normalizeInlineHtmlTags(content) {
  return content.replace(/<((?:Tooltip|sub|sup)\b[^>]*)>\s+/g, '<$1>').replace(/\s+<\/(Tooltip|sub|sup)>/g, '</$1>')
}

function assertNoDuplicateHeadings(content) {
  const counts = new Map()
  const duplicates = []

  for (const match of content.matchAll(/^#{2,6}\s+(.+)$/gm)) {
    const heading = match[1].trim()
    const count = (counts.get(heading) || 0) + 1
    counts.set(heading, count)
    if (count === 2) {
      duplicates.push(heading)
    }
  }

  if (duplicates.length > 0) {
    throw new Error(`Translated output contains duplicate heading(s): ${duplicates.join(', ')}`)
  }
}

function isOriginalAccordionOpening(line) {
  return /^<CustomAccordion\b(?=[^>]*\btitle=(["'])(?:原文|original)\1)/i.test(line.trim())
}

function collectUnexpectedHanLines(content) {
  let insideOriginalAccordion = false
  const badLines = []

  content.split('\n').forEach((line, index) => {
    const trimmed = line.trim()

    if (isOriginalAccordionOpening(line)) {
      insideOriginalAccordion = true
      return
    }

    if (insideOriginalAccordion) {
      if (trimmed === '</CustomAccordion>') {
        insideOriginalAccordion = false
      }
      return
    }

    if (containsHan(line)) {
      badLines.push({ line: index + 1, text: trimmed })
    }
  })

  return badLines
}

function assertNoUnexpectedHan(content) {
  const badLines = collectUnexpectedHanLines(content)

  if (badLines.length > 0) {
    const examples = badLines
      .slice(0, 5)
      .map(({ line, text }) => `${line}: ${text.slice(0, 160)}`)
      .join('\n')
    throw new Error(
      `Translated output still contains Chinese text outside preserved original blocks (${badLines.length} line(s)):\n${examples}`,
    )
  }
}

async function repairUnexpectedHanLines(body, options, processor) {
  if (options.dryRun) {
    return body
  }

  let currentBody = body

  for (let pass = 1; pass <= 2; pass++) {
    const badLines = collectUnexpectedHanLines(currentBody)
    if (badLines.length === 0) {
      return currentBody
    }

    console.log(`  Repairing untranslated Chinese line(s): ${badLines.length} (pass ${pass}/2)`)

    const badLineNumbers = new Set(badLines.map(({ line }) => line))

    const repairedLines = await mapWithConcurrency(
      currentBody.split('\n').map((line, index) => ({ line, lineNumber: index + 1 })),
      options.concurrency,
      async ({ line, lineNumber }) => {
        if (!badLineNumbers.has(lineNumber)) {
          return line
        }

        const { protectedText, protections } = protectCriticalSyntax(line)
        const repaired = await translateProtectedText(protectedText, protections, options, {
          fileName: options.currentFileName,
          sectionLabel: `leftover Chinese line ${lineNumber}`,
          glossaryPrompt: buildGlossaryPrompt(options.currentFileName),
          contentKind:
            'single already-translated MDX line that still contains Chinese; translate the remaining Chinese while preserving existing English and all syntax',
        })

        return repaired
      },
    )

    currentBody = normalizeMdxSpacing(repairedLines.join('\n'))
    processor.parse(currentBody)
  }

  return currentBody
}

function validateFinalBody(body, processor, options) {
  if (process.env.TRANSLATE_LLM_DEBUG_BODY) {
    fs.writeFileSync(process.env.TRANSLATE_LLM_DEBUG_BODY, body, 'utf8')
  }

  processor.parse(body)
  assertNoDuplicateHeadings(body)
  if (!options.dryRun) {
    assertNoUnexpectedHan(body)
  }
}

function collectTranslatableJsxAttributes(tree) {
  const entries = []

  function walk(node, insideOriginalAccordion = false) {
    if (!node || typeof node !== 'object') {
      return
    }

    const isOriginal = isOriginalAccordion(node)
    const skipChildren = insideOriginalAccordion || isOriginal

    if (
      !skipChildren &&
      (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
      Array.isArray(node.attributes)
    ) {
      node.attributes.forEach((attribute) => {
        if (
          attribute &&
          attribute.type === 'mdxJsxAttribute' &&
          JSX_TRANSLATABLE_ATTRIBUTES.has(attribute.name) &&
          typeof attribute.value === 'string' &&
          containsHan(attribute.value)
        ) {
          entries.push(attribute)
        }
      })
    }

    if (Array.isArray(node.children)) {
      node.children.forEach((child) => walk(child, skipChildren))
    }
  }

  walk(tree)
  return entries
}

/**
 * Returns true if this AST node (or any descendant) contains Chinese text
 * that we should translate.
 */
function sectionNeedsTranslation(nodes, processor) {
  const serialised = serializeNodes(processor, nodes)
  return containsHan(serialised)
}

// ─── Section chunking ─────────────────────────────────────────────────────────

/**
 * Groups top-level AST nodes into "sections" for translation.
 *
 * Rules:
 * - A new section starts at every h1 or h2 heading.
 * - Nodes before the first heading form section 0.
 * - Everything after (and including) the References heading is marked `skip`.
 * - Nodes inside an "original" CustomAccordion are marked `skip`.
 */
function buildSections(tree) {
  const sections = []
  let current = { nodes: [], skip: false }

  const referenceIndex = tree.children.findIndex(
    (n) => n.type === 'heading' && REFERENCE_HEADING_REGEX.test(getHeadingText(n)),
  )

  for (let idx = 0; idx < tree.children.length; idx++) {
    const node = tree.children[idx]

    // Stop collecting at the References heading
    if (referenceIndex !== -1 && idx >= referenceIndex) {
      if (current.nodes.length) sections.push(current)
      current = { nodes: [], skip: false }
      // Collect remainder as a single skipped section
      const rest = tree.children.slice(idx)
      sections.push({ nodes: rest, skip: true })
      break
    }

    // Start a new section at h1 / h2
    if (node.type === 'heading' && node.depth <= 2) {
      if (current.nodes.length) sections.push(current)
      current = { nodes: [node], skip: false }
      continue
    }

    // Mark entire section as skip if it's an "original" accordion
    if (isOriginalAccordion(node)) {
      if (current.nodes.length) {
        sections.push(current)
        current = { nodes: [], skip: false }
      }
      sections.push({ nodes: [node], skip: true })
      continue
    }

    current.nodes.push(node)
  }

  if (current.nodes.length) sections.push(current)

  return sections
}

function splitSectionNodes(section, processor, maxChars) {
  if (section.skip || section.nodes.length <= 1) {
    return [section.nodes]
  }

  const chunks = []
  let currentChunk = []

  for (const node of section.nodes) {
    const candidate = currentChunk.concat(node)
    const candidateText = serializeNodes(processor, candidate)

    if (currentChunk.length > 0 && candidateText.length > maxChars) {
      chunks.push(currentChunk)
      currentChunk = [node]
      continue
    }

    currentChunk = candidate
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }

  return chunks
}

// ─── Anthropic API call ───────────────────────────────────────────────────────

const TRANSLATE_SYSTEM_PROMPT = `\
You are a professional technical translator. Your task is to translate MDX documents from {FROM} to {TO}.

STRICT RULES – follow them exactly, no exceptions:
1. Translate ONLY Chinese ({FROM}) text. Leave English text as-is.
2. Preserve ALL MDX / JSX tags verbatim: opening tags, closing tags, self-closing tags, attribute names, and attribute values.
3. Preserve ALL markdown syntax: headings (#), bold (**), italic (*), strikethrough (~~), blockquotes (>), lists (- / 1.), horizontal rules (---), tables.
4. Preserve ALL code blocks (fenced with \`\`\`) and inline code (\`...\`) completely unchanged.
5. Preserve ALL URLs, import paths, variable names, and file names unchanged.
6. Preserve ALL import / export statements unchanged.
7. Preserve the exact line structure and blank lines. Do not add or remove blank lines.
8. Do NOT wrap the output in any code fence or add any commentary.
9. Return ONLY the translated MDX – nothing else.
10. NEVER alter placeholders that look like __PRESERVE_SOMETHING__. Copy them exactly.
`

function buildUserPrompt(content, context = {}) {
  const parts = []
  if (context.fileName) {
    parts.push(`File: ${context.fileName}`)
  }
  if (context.sectionLabel) {
    parts.push(`Section: ${context.sectionLabel}`)
  }
  if (context.glossaryPrompt) {
    parts.push(context.glossaryPrompt)
  }
  if (context.contentKind) {
    parts.push(`Content kind: ${context.contentKind}`)
  }
  parts.push('Translate the following MDX content according to the system rules. Return only the translated MDX.')
  parts.push(content)
  return parts.join('\n\n')
}

async function callAnthropicTranslate(mdxChunk, options, context = {}) {
  if (options.dryRun) {
    return mdxChunk
  }

  const systemPrompt = TRANSLATE_SYSTEM_PROMPT.replace('{FROM}', options.from).replace('{TO}', options.to)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: options.model,
      max_tokens: 8192,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(mdxChunk, context),
        },
      ],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Anthropic API error ${response.status}: ${redactKnownSecrets(body)}`)
  }

  const data = await response.json()

  if (data.error) {
    throw new Error(`Anthropic API returned error: ${redactKnownSecrets(JSON.stringify(data.error))}`)
  }

  const text = (data.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')

  return text
}

// ─── Concurrency helper ───────────────────────────────────────────────────────

async function mapWithConcurrency(items, concurrency, fn) {
  const results = new Array(items.length)
  let index = 0
  let firstError

  async function worker() {
    while (index < items.length && !firstError) {
      const i = index++
      try {
        results[i] = await fn(items[i], i)
      } catch (error) {
        firstError = error
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, worker)
  await Promise.all(workers)
  if (firstError) {
    throw firstError
  }
  return results
}

async function translateJsxAttributeValues(body, options, runtime) {
  body = normalizeInlineHtmlTags(body)

  if (process.env.TRANSLATE_LLM_DEBUG_BODY) {
    fs.writeFileSync(process.env.TRANSLATE_LLM_DEBUG_BODY, body, 'utf8')
  }

  const processor = createProcessor(runtime)
  const tree = processor.parse(body)
  const attributes = collectTranslatableJsxAttributes(tree)

  if (attributes.length === 0) {
    return body
  }

  console.log(`  JSX attribute value(s) requiring translation: ${attributes.length}`)

  await mapWithConcurrency(attributes, options.concurrency, async (attribute, idx) => {
    const { protectedText, protections } = protectCriticalSyntax(attribute.value)
    let translated
    let lastError

    for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
      try {
        const candidate = await callAnthropicTranslate(protectedText, options, {
          fileName: options.currentFileName,
          sectionLabel: `JSX attribute:${attribute.name}`,
          glossaryPrompt: buildGlossaryPrompt(options.currentFileName),
        })
        ensurePlaceholdersPreserved(candidate, protections, protectedText)
        translated = restoreProtectedSyntax(candidate, protections).trim()
        break
      } catch (error) {
        lastError = error
        console.warn(`  Warning: JSX attribute ${idx + 1} attempt ${attempt + 1} failed: ${safeErrorMessage(error)}`)
      }
    }

    if (translated === undefined) {
      throw new Error(
        `JSX attribute ${idx + 1} failed after ${options.maxRetries + 1} attempt(s): ${safeErrorMessage(lastError)}`,
      )
    }

    attribute.value = translated
  })

  return serializeNodes(processor, tree.children)
}

// ─── Body translation ─────────────────────────────────────────────────────────

async function translateMdxBody(body, options, runtime) {
  const processor = createProcessor(runtime)
  const tree = processor.parse(body)
  const sections = buildSections(tree)

  console.log(`  Chunked into ${sections.length} section(s)`)

  const jobs = []
  sections.forEach((section) => {
    section.originalText = serializeNodes(processor, section.nodes)
    section.translatedParts = []

    if (section.skip || !sectionNeedsTranslation(section.nodes, processor)) {
      return
    }

    const chunks = splitSectionNodes(section, processor, options.maxSectionChars)
    chunks.forEach((chunkNodes, chunkIndex) => {
      jobs.push({
        section,
        chunkNodes,
        chunkIndex,
        totalChunks: chunks.length,
      })
    })
  })

  console.log(`  Translation job(s): ${jobs.length}`)

  await mapWithConcurrency(jobs, options.concurrency, async ({ section, chunkNodes, chunkIndex, totalChunks }, idx) => {
    const mdxText = serializeNodes(processor, chunkNodes)
    const { protectedText, protections } = protectCriticalSyntax(mdxText)
    const headingNode = section.nodes.find((node) => node.type === 'heading')
    const sectionLabel = headingNode ? getHeadingText(headingNode) : 'Lead section'

    console.log(
      `  [job ${idx + 1}/${jobs.length}] translating ${mdxText.length} chars (${sectionLabel}, chunk ${chunkIndex + 1}/${totalChunks})...`,
    )

    let translated
    let lastError
    for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
      try {
        const restored = await translateProtectedText(protectedText, protections, options, {
          fileName: options.currentFileName,
          sectionLabel,
          glossaryPrompt: buildGlossaryPrompt(options.currentFileName),
        })
        validateTranslatedSection(mdxText, restored, processor)
        translated = restored
        break
      } catch (error) {
        lastError = error
        console.warn(`  Warning: job ${idx + 1} attempt ${attempt + 1} failed: ${safeErrorMessage(error)}`)
      }
    }

    if (translated === undefined) {
      throw new Error(`Job ${idx + 1} failed after ${options.maxRetries + 1} attempt(s): ${safeErrorMessage(lastError)}`)
    }
    section.translatedParts[chunkIndex] = translated
  })

  const parts = sections.map((section) => {
    if (section.skip) {
      return section.originalText
    }

    if (section.translatedParts.length > 0) {
      return section.translatedParts.filter(Boolean).join('\n\n')
    }

    return section.originalText
  })

  const translatedBody = normalizeMdxSpacing(parts.join('\n\n'))
  const withTranslatedAttributes = await translateJsxAttributeValues(translatedBody, options, runtime)
  const withTranslatedReferences = await translateReferenceFootnoteLines(withTranslatedAttributes, options)
  const finalBody = await repairUnexpectedHanLines(normalizeMdxSpacing(withTranslatedReferences), options, processor)

  validateFinalBody(finalBody, processor, options)
  return finalBody
}

// ─── Frontmatter translation ──────────────────────────────────────────────────

async function translateFrontmatter(frontmatter, options, runtime) {
  if (!frontmatter.trim()) return ''

  const data = parseFrontmatter(frontmatter, runtime.yaml)
  if (!data || typeof data !== 'object') return frontmatter

  for (const key of FRONTMATTER_TRANSLATABLE_KEYS) {
    if (typeof data[key] !== 'string' || !data[key].trim()) continue
    if (!containsHan(data[key])) continue

    try {
      data[key] = await callAnthropicTranslate(data[key], options, {
        fileName: options.currentFileName,
        sectionLabel: `frontmatter:${key}`,
        glossaryPrompt: buildGlossaryPrompt(options.currentFileName),
      })
    } catch (err) {
      console.warn(`  Warning: failed translating frontmatter key "${key}", keeping original: ${safeErrorMessage(err)}`)
    }
  }

  return stringifyFrontmatter(data, runtime.yaml)
}

// ─── File-level orchestration ─────────────────────────────────────────────────

async function translateMdxFile(sourceFile, targetFile, options, runtime) {
  try {
    console.log(`\nReading: ${sourceFile}`)
    const content = await fsp.readFile(sourceFile, 'utf8')
    const { frontmatter, body } = splitFrontmatter(content)

    if (!body.trim()) throw new Error('No body content')

    console.log(`Translating (${options.from} → ${options.to}) with model ${options.model}...`)

    const fileOptions = {
      ...options,
      currentFileName: path.basename(sourceFile),
    }

    const [translatedBody, translatedFrontmatter] = await Promise.all([
      translateMdxBody(body, fileOptions, runtime),
      translateFrontmatter(frontmatter, fileOptions, runtime),
    ])

    const finalContent = translatedFrontmatter
      ? `---\n${translatedFrontmatter}\n---\n${translatedBody}`
      : translatedBody

    if (options.dryRun) {
      console.log(`Dry run – skipping write to ${targetFile}`)
      return true
    }

    await fsp.mkdir(path.dirname(targetFile), { recursive: true })
    await fsp.writeFile(targetFile, finalContent, 'utf8')
    console.log(`Saved → ${targetFile}`)
    return true
  } catch (err) {
    console.error(`✗ Failed: ${sourceFile}: ${safeErrorMessage(err)}`)
    return false
  }
}

// ─── Directory helpers ────────────────────────────────────────────────────────

async function getMdxFiles(dir) {
  try {
    const files = await fsp.readdir(dir)
    return files.filter((f) => f.endsWith('.mdx')).sort()
  } catch (err) {
    console.error(`Error reading ${dir}: ${safeErrorMessage(err)}`)
    return []
  }
}

async function listExistingFiles(dir) {
  try {
    return new Set(await fsp.readdir(dir))
  } catch (err) {
    if (err.code === 'ENOENT') return new Set()
    throw err
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

function validateOptions(options) {
  if (!options.dryRun && !process.env.ANTHROPIC_API_KEY) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable')
  }
  if (!options.sourceDir || !options.targetDir) {
    throw new Error('Both --source and --target directories are required')
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

async function main(options) {
  try {
    loadDotEnv()
    validateOptions(options)
    const runtime = await loadRuntime()

    console.log('=== MDX LLM Translator ===')
    console.log(`Source : ${options.sourceDir}`)
    console.log(`Target : ${options.targetDir}`)
    console.log(`Pair   : ${options.from} → ${options.to}`)
    console.log(`Model  : ${options.model}`)
    console.log(`Concurrency: ${options.concurrency}`)
    console.log(`Overwrite  : ${options.overwrite}`)
    console.log(`Dry run    : ${options.dryRun}`)

    let filesToTranslate

    if (options.file) {
      filesToTranslate = [options.file]
    } else {
      const sourceFiles = await getMdxFiles(options.sourceDir)
      console.log(`\nFound ${sourceFiles.length} MDX file(s) in source dir`)
      const existing = await listExistingFiles(options.targetDir)
      filesToTranslate = sourceFiles.filter((f) => options.overwrite || !existing.has(f))
    }

    if (filesToTranslate.length === 0) {
      console.log('\nAll files already translated. Use --overwrite to re-translate.')
      return
    }

    console.log(`\nFiles to translate: ${filesToTranslate.length}`)
    filesToTranslate.forEach((f) => console.log(`  - ${f}`))

    let successCount = 0
    let failCount = 0

    for (const [i, file] of filesToTranslate.entries()) {
      const src = path.join(options.sourceDir, file)
      const tgt = path.join(options.targetDir, file)

      console.log(`\n[${i + 1}/${filesToTranslate.length}] ${file}`)
      const ok = await translateMdxFile(src, tgt, options, runtime)
      ok ? successCount++ : failCount++
    }

    console.log('\n' + '='.repeat(50))
    console.log('Summary')
    console.log(`  ✓ Success : ${successCount}`)
    console.log(`  ✗ Failed  : ${failCount}`)
    console.log('='.repeat(50))
  } catch (err) {
    console.error(`Fatal: ${safeErrorMessage(err)}`)
    process.exitCode = 1
  }
}

main(parseArgs(process.argv.slice(2)))
