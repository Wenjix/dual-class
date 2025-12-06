import { config } from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

config({ path: '.env.local' })

const apiKey = process.env.GOOGLE_GEMINI_API_KEY!
const genAI = new GoogleGenerativeAI(apiKey)

async function testImageGeneration() {
  console.log('Testing gemini-3-pro-image-preview with different approaches...\n')

  // Approach 1: Basic generateContent
  console.log('Approach 1: Basic generateContent')
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' })
    const result = await model.generateContent('A red circle')
    console.log('✅ Success with basic approach')
    console.log('Response:', JSON.stringify(result.response, null, 2))
  } catch (error: any) {
    console.log('❌ Failed:', error.message)
  }

  // Approach 2: With generation config
  console.log('\nApproach 2: With responseModalities config')
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-pro-image-preview',
      generationConfig: {
        // @ts-ignore
        responseModalities: ['image']
      }
    })
    const result = await model.generateContent('A red circle')
    console.log('✅ Success with responseModalities')
    console.log('Response:', JSON.stringify(result.response, null, 2))
  } catch (error: any) {
    console.log('❌ Failed:', error.message)
  }

  // Approach 3: With specific content format
  console.log('\nApproach 3: With structured content request')
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' })
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: 'Generate an image of a red circle'
        }]
      }],
      // @ts-ignore
      generationConfig: {
        responseModalities: ['image', 'text']
      }
    })
    console.log('✅ Success with structured content')
    console.log('Response:', JSON.stringify(result.response, null, 2))
  } catch (error: any) {
    console.log('❌ Failed:', error.message)
  }

  // Approach 4: Check API endpoint directly
  console.log('\nApproach 4: Direct API call check')
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'A red circle'
          }]
        }]
      })
    })
    const data = await response.json()
    console.log('Status:', response.status, response.statusText)
    console.log('Response:', JSON.stringify(data, null, 2))
  } catch (error: any) {
    console.log('❌ Failed:', error.message)
  }
}

testImageGeneration().catch(console.error)
