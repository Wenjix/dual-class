import { config } from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import fetch from 'node-fetch'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Load environment variables
config({ path: '.env.local' })

// Constants
const ASSETS_DIR = path.join(process.cwd(), 'public/assets')

// Prompts
const ASSETS = [
    {
        basename: 'gamer_hero',
        prompt: "Split screen comparison. LEFT: Top-down view of a League of Legends style MOBA game. A Healer character (green glowing) casts a beam on a 'Carry' character (gold glowing). RIGHT: A dark neural network diagram. A glowing green node connects to a gold node. CONNECTION: The green beam looks identical in both. TEXT: Label the beam 'HIGH WEIGHT' in neon green text. Label the Healer 'QUERY'."
    },
    {
        basename: 'gamer_fail',
        prompt: "A MOBA game screenshot. A Healer character is casting a massive green ultimate spell on a Tank character who already has a full green health bar. Next to them, a 'Carry' character is greyed out and defeated. TEXT: Big red game-over text overlay saying 'MANA WASTED'."
    },
    {
        basename: 'sports_hero',
        prompt: "Split screen comparison. LEFT: An American Football broadcast view from behind the Quarterback. A bright yellow 'route line' shows the path to a receiver. RIGHT: A clean blue data dashboard. A yellow data stream connects two nodes. TEXT: Label the yellow route 'ATTENTION: 99%'. Label the receiver 'TOKEN'."
    },
    {
        basename: 'sports_fail',
        prompt: "American Football TV shot. A Quarterback throwing a football directly into a crowd of 3 opposing defenders. The ball is being intercepted. TEXT: Large bold TV graphic text overlay saying 'INTERCEPTION'."
    }
]

async function ensureDirectory() {
    try {
        await fs.access(ASSETS_DIR)
    } catch {
        await fs.mkdir(ASSETS_DIR, { recursive: true })
    }
}

// --- Freepik Generation (Mystic) ---
async function generateFreepikImage(prompt: string, filename: string): Promise<boolean> {
    const apiKey = process.env.FREEPIK_API_KEY
    if (!apiKey) {
        console.log('⚠️  FREEPIK_API_KEY not found. Skipping Freepik.')
        return false
    }

    console.log(`\n🎨 [Freepik Mystic] Generating: ${filename}`)

    try {
        // Endpoint for Mystic Model
        const response = await fetch('https://api.freepik.com/v1/ai/mystic', {
            method: 'POST',
            headers: {
                'x-freepik-api-key': apiKey,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                resolution: '2k',
                aspect_ratio: 'square_1_1',
                model: 'realism',
                creative_detailing: 33,
                engine: 'automatic',
                fixed_generation: false,
                filter_nsfw: true,
                num_images: 1
                // Removed structure/style inputs as we don't have reference images
            })
        });

        if (!response.ok) {
            const err = await response.text();
            console.error(`✗ Freepik API Error: ${response.status} ${response.statusText}`, err)
            return false;
        }

        const data: any = await response.json();

        // Handle Polling (Most Freepik AI endpoints are async)
        if (data.data && data.data.task_id) {
            const taskId = data.data.task_id;
            console.log(`✓ [Freepik] Task started: ${taskId}. Polling...`);

            const maxAttempts = 30; // 60 seconds
            for (let i = 0; i < maxAttempts; i++) {
                await new Promise(r => setTimeout(r, 2000));

                const statusRes = await fetch(`https://api.freepik.com/v1/ai/mystic/${taskId}`, {
                    headers: { 'x-freepik-api-key': apiKey, 'Accept': 'application/json' }
                });

                if (!statusRes.ok) {
                    console.log(`Polling error: ${statusRes.status}`);
                    continue;
                }

                const statusData: any = await statusRes.json();
                if (statusData.data && statusData.data.status === 'COMPLETED') {
                    if (statusData.data.generated && statusData.data.generated.length > 0) {
                        const item = statusData.data.generated[0];
                        let imageBuffer;

                        if (typeof item === 'string' && item.startsWith('http')) {
                            console.log(`✓ [Freepik] Downloading from URL...`);
                            const imgRes = await fetch(item);
                            imageBuffer = Buffer.from(await imgRes.arrayBuffer());
                        } else if (item.base64) {
                            imageBuffer = Buffer.from(item.base64, 'base64');
                        } else if (item.url) {
                            const imgRes = await fetch(item.url);
                            imageBuffer = Buffer.from(await imgRes.arrayBuffer());
                        } else {
                            console.error('✗ Freepik result format unrecognized:', item);
                            return false;
                        }

                        const filePath = path.join(ASSETS_DIR, filename);
                        await fs.writeFile(filePath, imageBuffer);
                        console.log(`✓ [Freepik] Saved to: ${filePath}`);
                        return true;
                    }
                } else if (statusData.data?.status === 'FAILED') {
                    console.error('✗ Freepik Task Failed');
                    return false;
                }
            }
            console.error('✗ Freepik Polling Timed Out');
            return false;
        }

        console.error('✗ Freepik initial response format unexpected', data);
        return false;

    } catch (error) {
        console.error(`✗ Error generating with Freepik:`, error)
        return false
    }
}

// --- Gemini Generation ---
async function generateGeminiImage(prompt: string, filename: string): Promise<boolean> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY
    if (!apiKey) {
        console.log('⚠️  GOOGLE_GEMINI_API_KEY not found. Skipping Gemini.')
        return false
    }

    console.log(`\n🎨 [Gemini] Generating: ${filename}`)

    try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-3-pro-image-preview' })

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
        })

        const response = await result.response
        const candidate = response.candidates?.[0]

        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData && part.inlineData.mimeType?.startsWith('image/')) {
                    const filePath = path.join(ASSETS_DIR, filename)
                    const imageBuffer = Buffer.from(part.inlineData.data, 'base64')
                    await fs.writeFile(filePath, imageBuffer)
                    console.log(`✓ [Gemini] Saved to: ${filePath}`)
                    return true
                }
            }
        }
        return false
    } catch (error) {
        console.error(`✗ Error generating with Gemini:`, error)
        return false
    }
}

// --- Main ---
async function main() {
    console.log('🚀 Starting Asset Generation (Mystic vs Gemini)\n')
    await ensureDirectory()

    for (const asset of ASSETS) {
        // Parallel generation for speed? No, sequential to avoid rate limits / easy logging.

        // 1. Generate Freepik Version
        await generateFreepikImage(asset.prompt, `${asset.basename}_freepik.png`)

        // 2. Generate Gemini Version
        await generateGeminiImage(asset.prompt, `${asset.basename}_gemini.png`)
    }

    console.log('\n✨ Asset Generation Complete')
}

main().catch(console.error)
