import { config } from 'dotenv'
import fetch from 'node-fetch'

config({ path: '.env.local' })

async function probe() {
    const apiKey = process.env.FREEPIK_API_KEY
    // Use a task_id that was just generated or generate a new one
    // Let's generate a new one to be sure
    console.log('Generating new task...')
    const initRes = await fetch('https://api.freepik.com/v1/ai/text-to-image/seedream-v4', {
        method: 'POST',
        headers: {
            'x-freepik-api-key': apiKey!,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            prompt: "test image",
            aspect_ratio: 'square_1_1',
            guidance_scale: 2.5,
            num_images: 1
        })
    });
    const initData: any = await initRes.json();
    console.log('Init Response:', initData);

    if (initData.data && initData.data.task_id) {
        const taskId = initData.data.task_id;
        console.log(`Polling for Task ID: ${taskId}`);

        // Try Pattern 1: GET .../seedream-v4/{task_id}
        const url1 = `https://api.freepik.com/v1/ai/text-to-image/seedream-v4/${taskId}`;
        console.log(`Trying GET ${url1}`);
        const res1 = await fetch(url1, {
            headers: { 'x-freepik-api-key': apiKey!, 'Accept': 'application/json' }
        });
        if (res1.ok) {
            console.log('Pattern 1 Success:', await res1.json());
            return;
        } else {
            console.log('Pattern 1 Failed:', res1.status);
        }

        // Try Pattern 2: GET /v1/ai/tasks/{task_id} (Generic)
        // Actually typically generic tasks endpoint is often at distinct root
        // But let's assume Pattern 1 is most likely for this specific endpoint family
    }
}

probe();
