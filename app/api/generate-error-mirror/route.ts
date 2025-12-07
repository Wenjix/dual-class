import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import { generateErrorMirror } from '@/app/lib/gemini'
import { ErrorMirrorContext } from '@/app/lib/prompts'

export async function POST(req: NextRequest) {
  try {
    const context: ErrorMirrorContext = await req.json()

    // Validate required fields
    if (!context.persona || !context.concept || !context.quiz_question || !context.quiz_options) {
      return NextResponse.json(
        { error: 'Missing required context fields' },
        { status: 400 }
      )
    }

    console.log('Generating error mirror for:', context.persona, '-', context.concept)

    // Generate error mirror content with images
    const result = await generateErrorMirror(context)

    console.log('Error mirror generation complete')

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in generate-error-mirror API:', error)
    return NextResponse.json(
      { error: 'Failed to generate error mirror content' },
      { status: 500 }
    )
  }
}

