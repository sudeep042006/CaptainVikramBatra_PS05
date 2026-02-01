import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_ANON_KEY, // Or Service Key for backend admin
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    SARVAM_API_KEY: process.env.SARVAM_API_KEY,
    SARVAM_WS_URL: process.env.SARVAM_WS_URL || 'wss://api.sarvam.ai/speech-to-text-websocket',
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN
};
