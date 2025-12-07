import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { generateMetaphor, generateImage } from '@/app/lib/gemini'

const DEMO_PERSONAS = ['chef', 'starship captain', 'captain']

export async function POST(req: NextRequest) {
  try {
    const startTime = Date.now()
    const { concept, persona, lessonStepMode = "dynamic" } = await req.json()

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
      const response = JSON.parse(cached)

      return NextResponse.json({
        ...response,
        _meta: {
          cached: true,
          timestamp: Date.now(),
          responseTime: Date.now() - startTime
        }
      })
    }

    // LIVE MODE: Call Gemini API
    try {
      const metaphorResponse = await generateMetaphor(concept, persona, lessonStepMode)
      const metaphorData = JSON.parse(metaphorResponse)

      // Try to generate image
      let imageUrl = '/images/chef_attention.png' // fallback
      try {
        imageUrl = await generateImage(metaphorData.image_prompt)
      } catch (imgError) {
        console.error('Image generation failed, using fallback:', imgError)
        // Use the fallback image
      }

      return NextResponse.json({
        ...metaphorData,
        imageUrl,
        _meta: {
          cached: false,
          timestamp: Date.now(),
          model: 'gemini-3-pro-preview',
          responseTime: Date.now() - startTime
        }
      })
    } catch (apiError) {
      console.error('Gemini API error, falling back to cached response:', apiError)

      // Fallback to cached chef response
      const fallbackPath = path.join(process.cwd(), 'public/data/chef_response.json')
      const fallback = await fs.readFile(fallbackPath, 'utf-8')
      const response = JSON.parse(fallback)

      return NextResponse.json({
        ...response,
        _meta: {
          cached: true,
          fallback: true,
          timestamp: Date.now(),
          responseTime: Date.now() - startTime
        }
      })
    }
  } catch (error) {
    console.error('Error in generate API:', error)
    return NextResponse.json(
      { error: 'Failed to generate explanation' },
      { status: 500 }
    )
  }
}
