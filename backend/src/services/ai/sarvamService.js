import WebSocket from 'ws';
import { ENV } from '../../config/env.js';
import { logger } from '../../utils/logger.js';

export const createSarvamConnection = (onMessage, onClose) => {
    try {
        const sarvamWs = new WebSocket(ENV.SARVAM_WS_URL);

        sarvamWs.on('open', () => {
            logger.info('Connected to Sarvam AI STT Service');
        });

        sarvamWs.on('message', (data) => {
            try {
                const parsed = JSON.parse(data);
                // Adjust property based on real Sarvam API spec (usually 'transcript' or 'channel_0')
                // Assuming { transcript: "Hello", is_final: true/false }
                onMessage(parsed);
            } catch (err) {
                // logger.error('Error parsing Sarvam msg', err);
            }
        });

        sarvamWs.on('error', (err) => {
            logger.error('Sarvam WS Error', err);
        });

        sarvamWs.on('close', () => {
            logger.info('Sarvam Connection Closed');
            if (onClose) onClose();
        });

        return sarvamWs;
    } catch (error) {
        logger.error('Failed to create Sarvam connection', error);
        return null;
    }
};
