/* eslint-disable @typescript-eslint/no-require-imports */
const { Translate } = require('@google-cloud/translate').v2
const fs = require('fs').promises

const translate = new Translate({
  key: process.env.GOOGLE_CLOUD_API_KEY || '',
})

const path = require('path')

const sourceDirTw = 'src/contents/zh-TW'
const sourceDirEn = 'src/contents/en'
const targetLanguage = 'en'

/**
 * Protect formatting elements from translation
 */
function protectFormatting(content) {
  const protections = []
  let counter = 0

  // Protect double line breaks (paragraph separators)
  content = content.replace(/\n\n+/g, (match) => {
    const placeholder = `___DOUBLE_BREAK_${counter}___`
    protections.push({ placeholder, original: match })
    counter++
    return placeholder
  })

  // Protect JSX line breaks
  content = content.replace(/>\s*\n\s*</g, (match) => {
    const placeholder = `___JSX_BREAK_${counter}___`
    protections.push({ placeholder, original: match })
    counter++
    return placeholder
  })

  // Protect single line breaks at end of lines
  content = content.replace(/\n(?=\S)/g, (match) => {
    const placeholder = `___LINE_BREAK_${counter}___`
    protections.push({ placeholder, original: match })
    counter++
    return placeholder
  })

  return { content, protections }
}

/**
 * Restore formatting elements after translation
 */
function restoreFormatting(content, protections) {
  let restored = content
  protections.forEach(({ placeholder, original }) => {
    restored = restored.replace(new RegExp(placeholder, 'g'), original)
  })
  return restored
}

/**
 * Protect JSX components and imports from translation
 */
function protectJSXAndImports(content) {
  const protections = []
  let counter = 0

  // Protect import statements
  content = content.replace(/^import\s+.*?$/gm, (match) => {
    const placeholder = `___IMPORT_${counter}___`
    protections.push({ placeholder, original: match })
    counter++
    return placeholder
  })

  // Protect multi-line JSX components (like <Admonition>...</Admonition>)
  content = content.replace(/<([A-Z][a-zA-Z0-9]*)[^>]*>[\s\S]*?<\/\1>/g, (match) => {
    const placeholder = `___JSX_COMPONENT_${counter}___`
    protections.push({ placeholder, original: match })
    counter++
    return placeholder
  })

  // Protect self-closing JSX components with props
  content = content.replace(/<[A-Z][a-zA-Z0-9]*[^>]*\/>/g, (match) => {
    const placeholder = `___JSX_SELF_CLOSING_${counter}___`
    protections.push({ placeholder, original: match })
    counter++
    return placeholder
  })

  // Protect JSX attributes with complex values
  content = content.replace(/(\w+)=\{[^}]+\}/g, (match) => {
    const placeholder = `___JSX_ATTR_${counter}___`
    protections.push({ placeholder, original: match })
    counter++
    return placeholder
  })

  // Protect markdown links
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match) => {
    const placeholder = `___LINK_${counter}___`
    protections.push({ placeholder, original: match })
    counter++
    return placeholder
  })

  // Protect code blocks
  content = content.replace(/```[\s\S]*?```/g, (match) => {
    const placeholder = `___CODE_BLOCK_${counter}___`
    protections.push({ placeholder, original: match })
    counter++
    return placeholder
  })

  // Protect inline code
  content = content.replace(/`[^`]+`/g, (match) => {
    const placeholder = `___INLINE_CODE_${counter}___`
    protections.push({ placeholder, original: match })
    counter++
    return placeholder
  })

  return { content, protections }
}

/**
 * Restore JSX components and imports after translation
 */
function restoreJSXAndImports(content, protections) {
  let restored = content
  protections.forEach(({ placeholder, original }) => {
    restored = restored.replace(new RegExp(placeholder, 'g'), original)
  })
  return restored
}

/**
 * Split content into frontmatter and body
 */
function splitFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (match) {
    return {
      frontmatter: match[1],
      body: match[2],
    }
  }

  return { frontmatter: '', body: content }
}

/**
 * Translate a single MDX file with enhanced formatting protection
 */
async function translateMdxFile(sourceFile, targetFile) {
  try {
    console.log(`\nReading file: ${sourceFile}`)
    const content = await fs.readFile(sourceFile, 'utf8')

    // Split frontmatter and body
    const { frontmatter, body } = splitFrontmatter(content)

    // Protect formatting first
    const { content: formattingProtected, protections: formatProtections } = protectFormatting(body)

    // Then protect JSX and imports
    const { content: fullyProtected, protections: jsxProtections } = protectJSXAndImports(formattingProtected)

    console.log(`Translating (zh -> ${targetLanguage})...`)
    console.log(`Protected ${jsxProtections.length} JSX/import elements`)
    console.log(`Protected ${formatProtections.length} formatting elements`)

    // Debug: Check if we have content to translate
    const trimmedContent = fullyProtected.trim()
    if (!trimmedContent) {
      throw new Error('No content to translate')
    }

    console.log(`Content length: ${trimmedContent.length} characters`)

    // Translate the content in smaller chunks to preserve formatting
    const chunks = trimmedContent.split(/(?<=\.)\s+(?=[A-Z])|(?<=。)\s*/).filter((chunk) => chunk.trim())
    const translatedChunks = []

    for (const chunk of chunks) {
      if (chunk.trim()) {
        try {
          const [translation] = await translate.translate(chunk.trim(), {
            from: 'zh',
            to: targetLanguage,
            format: 'text',
          })
          translatedChunks.push(Array.isArray(translation) ? translation[0] : translation)
        } catch (error) {
          console.warn(`Warning: Failed to translate chunk, keeping original: ${error.message}`)
          translatedChunks.push(chunk)
        }
      }
    }

    const translatedText = translatedChunks.join(' ')

    // Restore JSX and imports first
    const jsxRestored = restoreJSXAndImports(translatedText, jsxProtections)

    // Then restore formatting
    const fullyRestored = restoreFormatting(jsxRestored, formatProtections)

    // Translate frontmatter separately (line by line to preserve structure)
    const frontmatterLines = frontmatter.split('\n')
    const translatedFrontmatterLines = []

    for (const line of frontmatterLines) {
      if (line.startsWith('title:') || line.startsWith('description:')) {
        const [key, ...valueParts] = line.split(':')
        const value = valueParts.join(':').trim()
        if (value) {
          try {
            const [translated] = await translate.translate(value, {
              from: 'zh',
              to: targetLanguage,
            })
            translatedFrontmatterLines.push(`${key}: ${translated}`)
          } catch (error) {
            console.warn(`Warning: Failed to translate frontmatter line, keeping original: ${error.message}`)
            translatedFrontmatterLines.push(line)
          }
        } else {
          translatedFrontmatterLines.push(line)
        }
      } else {
        translatedFrontmatterLines.push(line)
      }
    }

    // Reconstruct the file with proper spacing
    const finalContent = `---\n${translatedFrontmatterLines.join('\n')}\n---\n${fullyRestored}`

    console.log('Translation complete.')

    // Write translated content
    await fs.writeFile(targetFile, finalContent, 'utf8')

    console.log(`✓ Translated file saved to: ${targetFile}`)
    return true
  } catch (error) {
    console.error(`✗ Error translating ${sourceFile}:`, error.message)
    return false
  }
}

/**
 * Get all MDX files from a directory
 */
async function getMdxFiles(dir) {
  try {
    const files = await fs.readdir(dir)
    return files.filter((file) => file.endsWith('.mdx'))
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message)
    return []
  }
}

/**
 * Check if a file exists
 */
async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

/**
 * Main function to compare and translate missing files
 */
async function translateMissingFiles() {
  try {
    console.log('Scanning for files to translate...')
    console.log(`Source folder: ${sourceDirTw}`)
    console.log(`Target folder: ${sourceDirEn}`)

    // Get all MDX files from tw folder
    const twFiles = await getMdxFiles(sourceDirTw)
    console.log(`\nFound ${twFiles.length} files in ${sourceDirTw}`)

    // Check which files don't exist in en folder
    const filesToTranslate = []
    for (const file of twFiles) {
      const targetPath = path.join(sourceDirEn, file)
      const exists = await fileExists(targetPath)
      if (!exists) {
        filesToTranslate.push(file)
      }
    }

    if (filesToTranslate.length === 0) {
      console.log('\n✓ All files are already translated!')
      return
    }

    console.log(`\nFiles to translate: ${filesToTranslate.length}`)
    filesToTranslate.forEach((file) => console.log(`  - ${file}`))

    // Translate each missing file
    let successCount = 0
    let failCount = 0

    for (const file of filesToTranslate) {
      const sourcePath = path.join(sourceDirTw, file)
      const targetPath = path.join(sourceDirEn, file)

      console.log(`\n[${filesToTranslate.indexOf(file) + 1}/${filesToTranslate.length}] Processing: ${file}`)
      const success = await translateMdxFile(sourcePath, targetPath)

      if (success) {
        successCount++
      } else {
        failCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('Translation Summary:')
    console.log(`  ✓ Success: ${successCount}`)
    console.log(`  ✗ Failed: ${failCount}`)
    console.log('='.repeat(50))
  } catch (error) {
    console.error('Error during translation process:', error.message)
    console.error(error)
  }
}

translateMissingFiles()
