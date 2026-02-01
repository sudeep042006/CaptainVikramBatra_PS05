import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeIntent = async (text) => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a call classifier. Output JSON: { intent, urgency, sentiment }.'
                },
                {
                    role: 'user',
                    content: text
                }
            ],
            model: 'llama3-8b-8192',
            response_format: { type: 'json_object' }
        });

        const content = chatCompletion.choices[0]?.message?.content;
        return JSON.parse(content || '{}');
    } catch (error) {
        console.error("Groq Analysis Error:", error);
        return { intent: "unknown", urgency: "low", sentiment: "neutral" };
    }
};

export const generateFallback = async (text) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`Agent is unavailable. Generate a 1-sentence polite apology/solution for: "${text}"`);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Fallback Error:", error);
        return "I apologize, but all agents are currently busy. Please leave a message.";
    }
};
