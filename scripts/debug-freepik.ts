import { config } from 'dotenv'
import fetch from 'node-fetch'

config({ path: '.env.local' })

async function debug() {
    const apiKey = process.env.FREEPIK_API_KEY
    console.log('Starting debug task...')

    // 1. Start Task
    const initRes = await fetch('https://api.freepik.com/v1/ai/text-to-image/seedream-v4', {
        method: 'POST',
        headers: {
            'x-freepik-api-key': apiKey!,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            prompt: "simple red box",
            aspect_ratio: 'square_1_1',
            guidance_scale: 2.5,
            num_images: 1
        })
    });

    const initData: any = await initRes.json();
    if (!initData.data || !initData.data.task_id) {
        console.error('Init failed', initData);
        return;
    }

    const taskId = initData.data.task_id;
    console.log(`Task ID: ${taskId}`);

    // 2. Poll
    for (let i = 0; i < 20; i++) {
        await new Promise(r => setTimeout(r, 2000));

        const statusRes = await fetch(`https://api.freepik.com/v1/ai/text-to-image/seedream-v4/${taskId}`, {
            headers: { 'x-freepik-api-key': apiKey!, 'Accept': 'application/json' }
        });
        const statusData: any = await statusRes.json();

        console.log(`Poll ${i}: Status ${statusData.data?.status}`);

        if (statusData.data?.status === 'COMPLETED') {
            console.log('COMPLETED! Result Data:');
            console.log(JSON.stringify(statusData, null, 2));
            return;
        }
    }
}

debug();
