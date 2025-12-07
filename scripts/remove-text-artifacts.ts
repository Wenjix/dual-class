import { config } from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs/promises'
import path from 'path'

// Load environment variables
config({ path: '.env.local' })

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

/**
 * Reads an image file and converts it to base64
 */
async function readImageAsBase64(filePath: string): Promise<string> {
  const imageBuffer = await fs.readFile(filePath)
  return imageBuffer.toString('base64')
}

/**
 * Edits an image to remove "Pink World" and "Cyan World" text artifacts
 */
async function removeTextArtifacts(imagePath: string): Promise<boolean> {
  const fileName = path.basename(imagePath)
  console.log(`\n🖼️  Processing: ${fileName}`)

  try {
    // Read the image as base64
    const imageBase64 = await readImageAsBase64(imagePath)
    
    // Get the MIME type (assuming PNG)
    const mimeType = 'image/png'

    // Create the model
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-image-preview',
    })

    // Create the editing prompt
    const editPrompt = `Please recreate this image but remove all text that says "Pink World", "CYAN WORLD", "PINK WORLD", "Cyan World", "PINK WORLD:", "CYAN WORLD:", or any variations of these phrases.

CRITICAL REQUIREMENTS:
1. Remove ALL instances of these text labels completely - they are unwanted artifacts
2. Fill in the areas where the text was removed with appropriate background colors, gradients, or patterns that seamlessly match the surrounding area
3. Maintain the EXACT same visual style, composition, colors, lighting, and all other elements
4. Keep all other visual elements, diagrams, arrows, icons, and design elements exactly as they are
5. The image should look clean and professional without any text labels mentioning "Pink World" or "Cyan World"

The output should be visually identical to the input image, just without those specific text labels.`

    console.log('📤 Sending to Gemini for text removal...')

    // Send image and prompt to Gemini
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType,
              },
            },
            {
              text: editPrompt,
            },
          ],
        },
      ],
    })

    const response = await result.response
    console.log('✓ Response received from Gemini')

    // Extract edited image from response
    const candidate = response.candidates?.[0]
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
          console.log(`✓ Edited image data found (${part.inlineData.mimeType})`)

          // Create backup of original
          const backupPath = imagePath.replace('.png', '_backup.png')
          await fs.copyFile(imagePath, backupPath)
          console.log(`✓ Backup created: ${path.basename(backupPath)}`)

          // Save edited image (overwrite original)
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64')
          await fs.writeFile(imagePath, imageBuffer)

          const originalSize = (await fs.stat(backupPath)).size
          const newSize = imageBuffer.length
          console.log(`✓ Saved edited image: ${path.basename(imagePath)}`)
          console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`)
          console.log(`  Edited: ${(newSize / 1024).toFixed(2)} KB`)
          return true
        }
      }
    }

    console.error('✗ No image data in response')
    return false
  } catch (error) {
    console.error(`✗ Error processing ${fileName}:`, error)
    if (error instanceof Error) {
      console.error(`  Error message: ${error.message}`)
    }
    return false
  }
}

/**
 * Main function to process all generated images
 */
async function main() {
  console.log('🚀 Starting Text Artifact Removal Script\n')
  console.log('This will remove "Pink World" and "Cyan World" text from all generated images')
  console.log('Note: Original images will be backed up with "_backup" suffix\n')

  const generatedDir = path.join(process.cwd(), 'public/images/generated')
  
  try {
    // Read all files in the generated directory
    const files = await fs.readdir(generatedDir)
    
    // Filter for PNG files (excluding backups)
    const pngFiles = files.filter(
      file => file.endsWith('.png') && !file.includes('_backup')
    )

    if (pngFiles.length === 0) {
      console.log('⚠️  No PNG files found in generated directory')
      return
    }

    console.log(`Found ${pngFiles.length} image(s) to process:\n`)
    pngFiles.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file}`)
    })

    console.log('\n' + '='.repeat(60))
    console.log('Starting processing...')
    console.log('='.repeat(60))

    // Process each image
    const results = await Promise.allSettled(
      pngFiles.map(file => {
        const filePath = path.join(generatedDir, file)
        return removeTextArtifacts(filePath)
      })
    )

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('Processing Summary:')
    console.log('='.repeat(60))

    let successCount = 0
    let failCount = 0

    results.forEach((result, index) => {
      const fileName = pngFiles[index]
      if (result.status === 'fulfilled' && result.value) {
        console.log(`✅ ${fileName} - Success`)
        successCount++
      } else {
        console.log(`❌ ${fileName} - Failed`)
        failCount++
        if (result.status === 'rejected') {
          console.log(`   Error: ${result.reason}`)
        }
      }
    })

    console.log('\n' + '='.repeat(60))
    console.log(`Total: ${pngFiles.length} | Success: ${successCount} | Failed: ${failCount}`)
    console.log('='.repeat(60))

    if (successCount > 0) {
      console.log('\n💡 Tip: Original images have been backed up with "_backup" suffix')
      console.log('   You can delete the backups once you verify the edited images look good.')
    }
  } catch (error) {
    console.error('✗ Fatal error:', error)
    process.exit(1)
  }
}

main().catch(console.error)

