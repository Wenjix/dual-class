import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { generateMetaphor, generateImage } from '@/app/lib/gemini'

const DEMO_PERSONAS = ['chef', 'starship captain', 'captain']

export async function POST(req: NextRequest) {
  try {
    const { concept, persona } = await req.json()

    if (!concept || !persona) {
      return NextResponse.json(
        { error: 'Concept and persona are required' },
        { status: 400 }
      )
    }

    // DEMO MODE: Return cached response for reliability
    const personaLower = persona.toLowerCase()
    if (DEMO_PERSONAS.some(p => personaLower.includes(p))) {
      const fileName = personaLower.includes('chef')
        ? 'chef_response.json'
        : 'captain_response.json'

      const cachedPath = path.join(process.cwd(), 'public/data', fileName)
      const cached = await fs.readFile(cachedPath, 'utf-8')
      return NextResponse.json(JSON.parse(cached))
    }

    // LIVE MODE: Call Gemini API
    try {
      const metaphorResponse = await generateMetaphor(concept, persona)
      const metaphorData = JSON.parse(metaphorResponse)

      // Try to generate image
      let imageUrl = '/images/chef_attention.svg' // fallback
      try {
        imageUrl = await generateImage(metaphorData.image_prompt)
      } catch (imgError) {
        console.error('Image generation failed, using fallback:', imgError)
        // Use the fallback image
      }

      return NextResponse.json({ ...metaphorData, imageUrl })
    } catch (apiError) {
      console.error('Gemini API error, falling back to cached response:', apiError)

      // Fallback to cached chef response
      const fallbackPath = path.join(process.cwd(), 'public/data/chef_response.json')
      const fallback = await fs.readFile(fallbackPath, 'utf-8')
      return NextResponse.json(JSON.parse(fallback))
    }
  } catch (error) {
    console.error('Error in generate API:', error)
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    )
  }
}
