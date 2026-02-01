import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config({ path: '../backend/.env' });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testIntent() {
    console.log("Testing Groq Intent Classification...");
    try {
        const text = "I want to cancel my subscription immediately, it's too expensive.";
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'Output JSON: { intent, urgency }' },
                { role: 'user', content: text }
            ],
            model: 'llama3-8b-8192',
            response_format: { type: 'json_object' }
        });

        console.log("Input:", text);
        console.log("Result:", completion.choices[0]?.message?.content);
    } catch (error) {
        console.error("Error:", error);
    }
}

testIntent();
