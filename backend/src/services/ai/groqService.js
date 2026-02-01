import Groq from 'groq-sdk';
import { ENV } from '../../config/env.js';
import { PROMPTS } from '../../utils/promptTemplates.js';
import { logger } from '../../utils/logger.js';

const groq = new Groq({ apiKey: ENV.GROQ_API_KEY });

export const classifyIntent = async (text) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: PROMPTS.INTENT_CLASSIFICATION },
                { role: 'user', content: text }
            ],
            model: 'llama3-8b-8192',
            response_format: { type: 'json_object' }
        });

        const result = completion.choices[0]?.message?.content;
        return JSON.parse(result || '{}');
    } catch (error) {
        logger.error('Groq Intent Classification Failed', error);
        return { intent: "unknown", confidence: 0, urgency: "low" };
    }
};
