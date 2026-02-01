import WebSocket from 'ws';
import { SarvamAIClient } from 'sarvamai'; // Just to check if it has streaming
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.SARVAM_API || process.env.SARVAM_API_KEY;
const WS_URL = process.env.SARVAM_WS_URL || 'wss://api.sarvam.ai/speech-to-text-websocket';

console.log('🧪 Testing Sarvam Connection...');
console.log('🔑 Key:', API_KEY ? `${API_KEY.slice(0, 5)}...` : 'MISSING');
console.log('TB Endpoint:', WS_URL);

const testSDK = async () => {
    console.log('\n[Test 2] Connecting via SDK...');
    try {
        const client = new SarvamAIClient({
            apiSubscriptionKey: API_KEY
        });

        // Connect to streaming service
        // We assume default buffer/sample rate for now just to test connection
        const socket = await client.speechToTextStreaming.connect({
            "language-code": "hi-IN", // Default to Hindi/India or en-IN
            model: "saarika:v2.5",
            sample_rate: 8000, // Twilio uses 8000
            input_audio_codec: "pcm" // Check if "mulaw" is supported later
        });

        console.log('✅ [Test 2] SDK Connection Open!');

        socket.on('open', () => console.log('✅ Socket Open Event'));
        socket.on('error', (err) => console.error('❌ Socket Error:', err));
        socket.on('close', () => console.log('Socket Closed'));

        // Keep it open for a second then close
        setTimeout(() => {
            console.log('Closing SDK Socket...');
            socket.close();
            process.exit(0);
        }, 2000);

    } catch (error) {
        console.error('❌ [Test 2] SDK FAILED:', error);
        process.exit(1);
    }
};

testSDK();
