import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs/promises'
import path from 'path'
import { buildMetaphorPrompt } from './prompts'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export async function generateMetaphor(concept: string, persona: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-preview',
    })

    const prompt = buildMetaphorPrompt(concept, persona)

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

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Generate a clear, educational diagram: ${prompt}`,
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
