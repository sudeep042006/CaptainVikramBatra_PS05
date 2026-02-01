import { SarvamAIClient } from 'sarvamai';
import { ENV } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export const createSarvamConnection = async (onMessage, onClose) => {
    try {
        const client = new SarvamAIClient({
            apiSubscriptionKey: ENV.SARVAM_API
        });

        console.log('🔌 Connecting to Sarvam SDK with key:', ENV.SARVAM_API ? `${ENV.SARVAM_API.slice(0, 5)}...` : 'MISSING');

        // Connect using the Streaming Client
        const socket = await client.speechToTextStreaming.connect({
            "language-code": "en-IN",
            model: "saarika:v2.5",
            sample_rate: 8000,
            input_audio_codec: "pcm"
        });

        socket.on('open', () => {
            console.log('✅ Sarvam SDK Connected');
        });

        socket.on('message', (data) => {
            // SDK passes parsed object
            onMessage(data);
        });

        socket.on('error', (err) => {
            console.error('❌ Sarvam SDK Error:', err);
        });

        socket.on('close', () => {
            console.log('Sarvam SDK Connection Closed');
            if (onClose) onClose();
        });

        return socket;

    } catch (error) {
        console.error('❌ Failed to create Sarvam SDK connection:', error);
        return null; // Return null so streamService knows it failed
    }
};
