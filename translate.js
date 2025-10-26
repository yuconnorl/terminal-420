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
 * Protect only import statements from translation
 */
function protectImports(content) {
  const imports = []
  let counter = 0

  // Protect import statements
  const protectedContent = content.replace(/^import\s+.*?$/gm, (match) => {
    const placeholder = `___IMPORT_${counter}___`
    imports.push({ placeholder, original: match })
    counter++
    return placeholder
  })

  return { protectedContent, imports }
}

/**
 * Restore import statements from placeholders
 */
function restoreImports(content, imports) {
  let restored = content
  imports.forEach(({ placeholder, original }) => {
    restored = restored.replace(placeholder, original)
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
 * Translate a single MDX file with JSX protection
 */
async function translateMdxFile(sourceFile, targetFile) {
  try {
    console.log(`\nReading file: ${sourceFile}`)
    const content = await fs.readFile(sourceFile, 'utf8')

    // Split frontmatter and body
    const { frontmatter, body } = splitFrontmatter(content)

    // Only protect import statements
    const { protectedContent, imports } = protectImports(body)

    console.log(`Translating (zh -> ${targetLanguage})...`)
    console.log(`Protected ${imports.length} import statements`)

    // Debug: Check if we have content to translate
    const trimmedContent = protectedContent.trim()
    if (!trimmedContent) {
      throw new Error('No content to translate')
    }

    console.log(`Content length: ${trimmedContent.length} characters`)

    // Translate the content (Google Translate will handle JSX)
    const [translations] = await translate.translate(trimmedContent, {
      from: 'zh',
      to: targetLanguage,
      format: 'text', // Treat as plain text, not HTML
    })

    const translatedText = Array.isArray(translations) ? translations[0] : translations

    // Restore import statements
    const restoredBody = restoreImports(translatedText, imports)

    // Translate frontmatter separately (line by line to preserve structure)
    const frontmatterLines = frontmatter.split('\n')
    const translatedFrontmatterLines = []

    for (const line of frontmatterLines) {
      if (line.startsWith('title:') || line.startsWith('description:')) {
        const [key, ...valueParts] = line.split(':')
        const value = valueParts.join(':').trim()
        if (value) {
          const [translated] = await translate.translate(value, {
            from: 'zh',
            to: targetLanguage,
          })
          translatedFrontmatterLines.push(`${key}: ${translated}`)
        } else {
          translatedFrontmatterLines.push(line)
        }
      } else {
        translatedFrontmatterLines.push(line)
      }
    }

    // Reconstruct the file
    const finalContent = `---\n${translatedFrontmatterLines.join('\n')}\n---\n${restoredBody}`

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
