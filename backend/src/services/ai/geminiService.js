import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../../config/env.js';
import { PROMPTS } from '../../utils/promptTemplates.js';
import { logger } from '../../utils/logger.js';

const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const generateFallbackResponse = async (userText) => {
    try {
        const result = await model.generateContent(`${PROMPTS.FALLBACK_RESPONSE} "${userText}"`);
        return result.response.text();
    } catch (error) {
        logger.error('Gemini Fallback Generation Failed', error);
        return "I apologize, no agents are available. Please try again later.";
    }
};

export const generateInsights = async (transcriptText) => {
    try {
        const result = await model.generateContent(`${PROMPTS.INSIGHT_EXTRACTION} "${transcriptText}"`);
        const text = result.response.text();
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (error) {
        logger.error('Gemini Insights Failed', error);
        return [];
    }
};
