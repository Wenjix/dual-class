import { config } from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs/promises'
import path from 'path'

// Load environment variables
config({ path: '.env.local' })

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

// Image prompts for all 5 images
const IMAGE_PROMPTS = {
  why_image: `Starship bridge tactical holographic display - CLOSE-UP view focused on the SPACE STATION.

MAIN SUBJECT:
- Large 3D holographic projection of the SPACE STATION in center
- Station glowing with BRIGHT INTENSE AURA (emphasis on priority)
- Clear bold '70%' label/badge floating near station (large, prominent)
- Thick pulsing energy beam/connection arrow from bottom (your ship) to station

BACKGROUND CONTEXT (faint, de-emphasized):
- Cargo ships visible in distance with dim '20%' labels
- Defense satellites barely visible with '10%' labels
- Distant nebula in far background, no label

TACTICAL HUD ELEMENTS:
- Scanning grid lines in space
- Holographic interface elements
- Distance/velocity readouts near station
- Mission objective indicator: "DOCKING SEQUENCE"

STYLE:
- Dark space background (#0f1015 to #1a1b23)
- Sci-fi tactical display aesthetic, holographic HUD style
- High contrast, dramatic lighting on the space station
- Professional starship bridge interface design

VISUAL HIERARCHY:
The space station should be the CLEAR FOCAL POINT with 70% dominance in the composition.`,

  correct_connection: `Starship bridge tactical holographic display - WIDE VIEW showing all detected objects.

OBJECTS WITH PRIORITY HIERARCHY:
1. SPACE STATION (center, largest, brightest glow):
   - Massive 3D hologram, bright white/blue glow
   - Bold '70%' label in large font
   - Thick pulsing connection line from ship

2. CARGO SHIPS (left side, moderate size):
   - 3-4 cargo vessel holograms
   - Moderate cyan glow
   - '20%' labels, medium connection lines

3. DEFENSE SATELLITES (right side, smaller):
   - 2-3 satellite holograms
   - Faint glow
   - '10%' labels, thin connection lines

4. DISTANT NEBULA (far background):
   - Faint purple nebula
   - No connection line
   - '0%' label or no label

TACTICAL HUD:
- Radar/scanner grid overlay
- Your ship indicator at bottom center
- Range circles radiating outward
- Mission status: "STATION DOCKING - PRIMARY OBJECTIVE"

STYLE:
- Dark space background (#0f1015 to #1a1b23)
- Professional tactical screen aesthetic
- Clear visual priority: Station >> Cargo >> Satellites >> Nebula

The space station's 70% should be UNMISTAKABLY the highest priority.`,

  nebula_error: `Starship bridge tactical display - ERROR VIEW showing NEBULA as incorrect selection.

MAIN FOCUS (but shown as WRONG):
- DISTANT NEBULA highlighted/selected with pulsing RED ERROR border
- Large '0%' label in RED next to nebula
- NO CONNECTION LINE to ship (disconnected, irrelevant)
- Nebula is beautiful but clearly distant and mission-irrelevant

CORRECT TARGET (visible but not selected):
- SPACE STATION in middle distance, still glowing
- '70%' label visible in correct green/blue color
- Thick connection line showing it SHOULD be the target
- Visual contrast showing "This was the right choice"

OTHER OBJECTS:
- Cargo ships faintly visible with '20%'
- Satellites with '10%'

HUD INDICATORS:
- ERROR message: "INCORRECT TARGET - LOW RELEVANCE"
- Mission objective still showing: "DOCKING REQUIRED"
- Distance indicator showing nebula is light-years away

STYLE:
- Dark space background (#0f1015 to #1a1b23)
- Error state visual language: red highlights, warning indicators
- Tactical display with clear error feedback

Visual message: "You selected beauty over relevance - the nebula is 0% priority."`,

  satellites_error: `Starship bridge tactical display - ERROR VIEW showing DEFENSE SATELLITES as incorrect selection.

SELECTED TARGET (but SECONDARY):
- DEFENSE SATELLITES highlighted with YELLOW/ORANGE warning border
- '10%' label prominently shown
- Thin connection line to satellites
- Visual indication: "This is secondary, not primary"

CORRECT PRIMARY TARGET (shown for comparison):
- SPACE STATION glowing brightly in center
- '70%' label in bold green
- MUCH thicker connection line
- Visual contrast: 70% vs 10% shown clearly

OTHER OBJECTS:
- Cargo ships visible with '20%'
- Distant nebula with '0%'

HUD INDICATORS:
- WARNING message: "SECONDARY TARGET - STATION IS PRIMARY"
- Comparison readout: "Satellites: 10% | Station: 70%"
- Mission priority indicator showing station as critical

STYLE:
- Dark space background (#0f1015 to #1a1b23)
- Warning state (not full error): yellow/orange UI elements
- Clear visual comparison showing priority difference

Visual message: "Satellites matter (10%), but the station is mission-critical (70%)."`,

  cargo_error: `Starship bridge tactical display - ERROR VIEW showing CARGO SHIPS as incorrect selection.

SELECTED TARGET (but MODERATE PRIORITY):
- CARGO SHIPS highlighted with ORANGE warning border
- '20%' label prominently displayed
- Medium-thickness connection lines
- Visual: "Moderate importance, but not primary"

CORRECT PRIMARY TARGET (shown for comparison):
- SPACE STATION glowing intensely in background
- '70%' label in bright green/blue
- MUCH thicker, brighter connection line
- Clear visual dominance over cargo ships

OTHER OBJECTS:
- Defense satellites with '10%'
- Distant nebula with '0%'

HUD INDICATORS:
- WARNING message: "MODERATE PRIORITY - STATION IS CRITICAL"
- Priority comparison: "Cargo: 20% | Station: 70%"
- Threat assessment: "COLLISION RISK vs MISSION OBJECTIVE"

STYLE:
- Dark space background (#0f1015 to #1a1b23)
- Warning state with orange UI elements
- Clear visual hierarchy: 70% >> 20%

Visual message: "Cargo ships have moderate priority for collision avoidance (20%), but docking is critical (70%)."`
}

/**
 * Delay helper to avoid rate limits
 */
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate a single image using Gemini API with dual lighting
 */
async function generateAndSaveImage(
  promptKey: string,
  basePrompt: string
): Promise<string> {
  console.log(`\n🎨 Generating image: ${promptKey}`)

  const model = genAI.getGenerativeModel({
    model: 'gemini-3-pro-image-preview',
  })

  // Add dual lighting wrapper (matching gemini.ts pattern)
  const dualLightingPrompt = `
Create a clear, educational diagram with CINEMATIC DUAL LIGHTING:

LIGHTING REQUIREMENTS (CRITICAL):
- Left side: Illuminated with WARM PINK/MAGENTA light (#F55DA8, hot pink glow)
- Right side: Illuminated with COOL CYAN/TEAL light (#1DE3D4, electric cyan glow)
- Background: Deep dark blue-black gradient (#0f1015 to #1a1b23)
- Style: High contrast, cinematic split-tone color grading like a movie poster

SUBJECT: ${basePrompt}

This image will be displayed in a split-screen interface where left=pink world, right=cyan world.
The dual lighting MUST be dramatic and unmistakable.
`.trim()

  try {
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: dualLightingPrompt,
            },
          ],
        },
      ],
    })

    const response = await result.response
    const candidate = response.candidates?.[0]

    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
          const fileName = `generated_${Date.now()}.png`
          const filePath = path.join(process.cwd(), 'public/images/generated', fileName)
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64')
          await fs.writeFile(filePath, imageBuffer)

          console.log(`✓ Saved: ${fileName} (${(imageBuffer.length / 1024).toFixed(2)} KB)`)
          return `/images/generated/${fileName}`
        }
      }
    }

    throw new Error('No image data in response')
  } catch (error) {
    console.error(`✗ Failed to generate ${promptKey}:`, error)
    throw error
  }
}

/**
 * Update captain_response.json with new image URLs
 */
async function updateCaptainResponse(imageUrls: Record<string, string>): Promise<void> {
  const jsonPath = path.join(process.cwd(), 'public/data/captain_response.json')

  try {
    const data = JSON.parse(await fs.readFile(jsonPath, 'utf-8'))

    // Update why_imageUrl
    data.why_imageUrl = imageUrls.why_image

    // Update error_states - all 3 use the same correct_connection image
    data.error_states[0].wrong_connection_visual = imageUrls.nebula_error
    data.error_states[0].correct_connection_visual = imageUrls.correct_connection

    data.error_states[1].wrong_connection_visual = imageUrls.satellites_error
    data.error_states[1].correct_connection_visual = imageUrls.correct_connection

    data.error_states[2].wrong_connection_visual = imageUrls.cargo_error
    data.error_states[2].correct_connection_visual = imageUrls.correct_connection

    // Update fallback_error
    data.fallback_error.correct_connection_visual = imageUrls.correct_connection

    await fs.writeFile(jsonPath, JSON.stringify(data, null, 2))
    console.log('\n✓ Updated captain_response.json')
  } catch (error) {
    console.error('\n✗ Failed to update captain_response.json:', error)
    throw error
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Captain Image Generation\n')
  console.log('This will generate 5 images for the Starship Captain metaphor:')
  console.log('  1. Why image (Space Station at 70%)')
  console.log('  2. Correct connection image (all objects with priority)')
  console.log('  3. Nebula error image (0% - wrong choice)')
  console.log('  4. Satellites error image (10% - wrong choice)')
  console.log('  5. Cargo ships error image (20% - wrong choice)')
  console.log('\n' + '='.repeat(60))

  const imageUrls: Record<string, string> = {}

  try {
    // Generate images sequentially with delays to avoid rate limits
    for (const [key, prompt] of Object.entries(IMAGE_PROMPTS)) {
      imageUrls[key] = await generateAndSaveImage(key, prompt)

      // Add delay between generations (except after the last one)
      const keys = Object.keys(IMAGE_PROMPTS)
      if (key !== keys[keys.length - 1]) {
        console.log('⏳ Waiting 4 seconds before next generation...')
        await delay(4000)
      }
    }

    // Update JSON file with new URLs
    console.log('\n' + '='.repeat(60))
    console.log('Updating captain_response.json with new image URLs...')
    await updateCaptainResponse(imageUrls)

    console.log('\n' + '='.repeat(60))
    console.log('✅ All images generated and JSON updated successfully!')
    console.log('='.repeat(60))
    console.log('\nGenerated URLs:')
    Object.entries(imageUrls).forEach(([key, url]) => {
      console.log(`  ${key}: ${url}`)
    })

    console.log('\n💡 Next steps:')
    console.log('  1. Run "pnpm dev" to start the development server')
    console.log('  2. Navigate to the Captain metaphor demo')
    console.log('  3. Verify images load correctly with dual lighting')
    console.log('  4. Test quiz error states to see all error mirror images')

  } catch (error) {
    console.error('\n❌ Error:', error)
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`)
    }
    process.exit(1)
  }
}

main().catch(console.error)
