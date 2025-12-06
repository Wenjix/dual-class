import { config } from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs/promises'
import path from 'path'

// Load environment variables
config({ path: '.env.local' })

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

async function generateAndSaveImage(prompt: string, filename: string) {
  console.log(`\n🎨 Generating image: ${filename}`)
  console.log(`Prompt: ${prompt}`)

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-image-preview',
    })

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    })

    const response = await result.response
    console.log('✓ Response received from Gemini')

    // Extract image data from response
    const candidate = response.candidates?.[0]
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
          console.log(`✓ Image data found (${part.inlineData.mimeType})`)

          // Save image to public/images/
          const filePath = path.join(process.cwd(), 'public/images', filename)
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64')
          await fs.writeFile(filePath, imageBuffer)

          console.log(`✓ Saved to: ${filePath}`)
          console.log(`✓ Size: ${(imageBuffer.length / 1024).toFixed(2)} KB`)
          return true
        }
      }
    }

    console.error('✗ No image data in response')
    console.log('Response structure:', JSON.stringify(response, null, 2))
    return false
  } catch (error) {
    console.error(`✗ Error generating ${filename}:`, error)
    return false
  }
}

async function main() {
  console.log('🚀 Starting AI Image Generation for Dual Class\n')
  console.log('Using Gemini 3 Pro Image Preview\n')

  // Chef Attention Diagram
  const chefPrompt = `Create a clear, educational molecular gastronomy diagram showing the "attention mechanism" concept through ingredient pairing.

Center: A large STEAK (main element)
Connected ingredients with labeled attention weights:
- Wine Reduction: thick bold arrow, labeled "80%" (strongest connection)
- Garlic Butter: medium arrow, labeled "15%"
- Rosemary: thin arrow, labeled "5%"
- Ketchup: no connection, labeled "0%" (faded/distant)

Style: Clean infographic style, professional culinary diagram with a white or light background. Show arrows/lines of varying thickness connecting ingredients to the steak based on their "attention weight". Include percentage labels. Make it look like a scientific pairing chart or attention map.

Title at top: "Chef's Attention Map - Ingredient Pairing Weights"`

  // Starship Captain Tactical Display
  const captainPrompt = `Create a futuristic starship bridge tactical display showing the "attention mechanism" concept through threat prioritization.

Center: YOUR SHIP (friendly, blue/green)
Surrounding contacts with labeled attention priorities:
- Enemy Cruiser (red, hostile): thick pulsing red line, labeled "85%" (highest priority)
- Friendly Convoy (green): medium green line, labeled "10%"
- Asteroids (gray): thin gray line, labeled "2%"
- Background Radiation (faded): no connection, labeled "0%"

Style: Dark space background (black/deep blue) with glowing HUD elements. Tactical radar/sonar display aesthetic. Show threat priority lines connecting to your ship, with thickness indicating attention weight. Include a radar grid. Make it look like a sci-fi tactical screen with percentage labels.

Title at top: "TACTICAL DISPLAY - Attention Priority Map"`

  // Generate both images
  const success1 = await generateAndSaveImage(chefPrompt, 'chef_attention.png')
  const success2 = await generateAndSaveImage(captainPrompt, 'captain_attention.png')

  console.log('\n' + '='.repeat(60))
  if (success1 && success2) {
    console.log('✅ All images generated successfully!')
  } else {
    console.log('⚠️  Some images failed to generate. Check errors above.')
  }
  console.log('='.repeat(60))
}

main().catch(console.error)
