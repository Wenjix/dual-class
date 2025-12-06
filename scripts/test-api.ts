import { config } from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Load environment variables from .env.local
config({ path: '.env.local' })

const apiKey = process.env.GOOGLE_GEMINI_API_KEY

console.log('Environment check:')
console.log('API Key loaded:', apiKey ? `Yes (${apiKey.substring(0, 10)}...)` : 'No')
console.log('')

if (!apiKey) {
  console.error('❌ GOOGLE_GEMINI_API_KEY not found in environment!')
  console.log('Please ensure .env.local contains: GOOGLE_GEMINI_API_KEY=your_key_here')
  process.exit(1)
}

const genAI = new GoogleGenerativeAI(apiKey)

async function testAPI() {
  console.log('Testing Gemini API...\n')

  // Try gemini-1.5-pro first (more common model name)
  console.log('1️⃣ Testing with gemini-1.5-pro...')
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })
    const result = await model.generateContent('Say hello in one word')
    const response = await result.response
    console.log('✅ Success! Response:', response.text())
  } catch (error: any) {
    console.log('❌ Failed:', error.message)
  }

  // Try gemini-3-pro-preview
  console.log('\n2️⃣ Testing with gemini-3-pro-preview...')
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-preview' })
    const result = await model.generateContent('Say hello in one word')
    const response = await result.response
    console.log('✅ Success! Response:', response.text())
  } catch (error: any) {
    console.log('❌ Failed:', error.message)
  }

  // Try imagen (image generation)
  console.log('\n3️⃣ Testing image generation with imagen-3.0-generate-001...')
  try {
    const model = genAI.getGenerativeModel({ model: 'imagen-3.0-generate-001' })
    const result = await model.generateContent('A simple red circle')
    console.log('✅ Image generation succeeded!')
  } catch (error: any) {
    console.log('❌ Failed:', error.message)
  }
}

testAPI().catch(console.error)
