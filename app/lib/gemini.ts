import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs/promises'
import path from 'path'
import { buildMetaphorPrompt, buildErrorMirrorPrompt, ErrorMirrorContext } from './prompts'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export async function generateMetaphor(concept: string, persona: string, lessonStepMode: "fixed" | "dynamic" = "dynamic"): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-preview',
    })

    const prompt = buildMetaphorPrompt(concept, persona, lessonStepMode)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/)
    if (jsonMatch) {
      return jsonMatch[1].trim()
    }

    return text
  } catch (error) {
    console.error('Error generating metaphor:', error)
    throw error
  }
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-image-preview',
    })

    // Enhanced dual lighting prompt for cinematic effect
    const dualLightingPrompt = `
Create a clear, educational diagram with CINEMATIC DUAL LIGHTING:

LIGHTING REQUIREMENTS (CRITICAL):
- Left side: Illuminated with WARM PINK/MAGENTA light (#F55DA8, hot pink glow)
- Right side: Illuminated with COOL CYAN/TEAL light (#1DE3D4, electric cyan glow)
- Background: Deep dark blue-black gradient (#0f1015 to #1a1b23)
- Style: High contrast, cinematic split-tone color grading like a movie poster

SUBJECT: ${prompt}

This image will be displayed in a split-screen interface where left=pink world, right=cyan world.
The dual lighting MUST be dramatic and unmistakable.
`.trim()

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

    // Extract image data from response
    // Note: The actual implementation depends on the Gemini Image API response format
    // For now, we'll save it as a placeholder
    const candidate = response.candidates?.[0]
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
          // Save image to public/images/generated/
          const fileName = `generated_${Date.now()}.png`
          const filePath = path.join(process.cwd(), 'public/images/generated', fileName)

          // Convert base64 to buffer and save
          const imageBuffer = Buffer.from(part.inlineData.data, 'base64')
          await fs.writeFile(filePath, imageBuffer)

          return `/images/generated/${fileName}`
        }
      }
    }

    throw new Error('No image data in response')
  } catch (error) {
    console.error('Error generating image:', error)
    throw error
  }
}

export interface ErrorMirrorResult {
  error_states: Array<{
    wrong_option_id: string
    misconception_title: string
    wrong_connection_visual: string
    correct_connection_visual: string
    explanation_text: string
    wrong_label: string
    correct_label: string
  }>
  fallback_error: {
    wrong_option_id: string
    misconception_title: string
    wrong_connection_visual: string
    correct_connection_visual: string
    explanation_text: string
    wrong_label: string
    correct_label: string
  }
  why_text: string
  why_imageUrl: string
}

export async function generateErrorMirror(context: ErrorMirrorContext): Promise<ErrorMirrorResult> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-preview',
    })

    const prompt = buildErrorMirrorPrompt(context)

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/)
    const jsonText = jsonMatch ? jsonMatch[1].trim() : text
    
    const data = JSON.parse(jsonText)

    // Now generate images for each error state
    console.log('Generating error mirror images...')

    // Generate correct connection image
    let correctConnectionUrl = '/images/chef_attention.png' // fallback
    try {
      correctConnectionUrl = await generateImage(data.image_prompts.correct_connection)
      console.log('Generated correct connection image:', correctConnectionUrl)
    } catch (err) {
      console.error('Failed to generate correct connection image:', err)
    }

    // Generate why image
    let whyImageUrl = correctConnectionUrl // fallback to correct connection
    try {
      whyImageUrl = await generateImage(data.image_prompts.why_image_prompt)
      console.log('Generated why image:', whyImageUrl)
    } catch (err) {
      console.error('Failed to generate why image:', err)
    }

    // Generate wrong connection images
    const wrongImageUrls: Record<string, string> = {}
    for (const wrongPrompt of data.image_prompts.wrong_connections) {
      try {
        wrongImageUrls[wrongPrompt.option_id] = await generateImage(wrongPrompt.prompt)
        console.log(`Generated wrong connection image for ${wrongPrompt.option_id}:`, wrongImageUrls[wrongPrompt.option_id])
      } catch (err) {
        console.error(`Failed to generate wrong connection image for ${wrongPrompt.option_id}:`, err)
        wrongImageUrls[wrongPrompt.option_id] = '/images/chef_attention.png' // fallback
      }
    }

    // Build the final result with image URLs
    const errorStates = data.error_states.map((state: {
      wrong_option_id: string
      misconception_title: string
      explanation_text: string
      wrong_label: string
      correct_label: string
    }) => ({
      ...state,
      wrong_connection_visual: wrongImageUrls[state.wrong_option_id] || '/images/chef_attention.png',
      correct_connection_visual: correctConnectionUrl,
    }))

    const fallbackError = {
      ...data.fallback_error,
      wrong_connection_visual: '/images/chef_attention.png',
      correct_connection_visual: correctConnectionUrl,
    }

    return {
      error_states: errorStates,
      fallback_error: fallbackError,
      why_text: data.why_text,
      why_imageUrl: whyImageUrl,
    }
  } catch (error) {
    console.error('Error generating error mirror:', error)
    throw error
  }
}
