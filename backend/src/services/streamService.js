import WebSocket from 'ws';
import { createSarvamConnection } from './ai/sarvamService.js';
import { classifyIntent } from './ai/groqService.js';
import { getIO } from './socketService.js';
import { logger } from '../utils/logger.js';

export const handleMediaStream = (ws, req) => {
    logger.info('Twilio Media Stream Connection Initiated');

    // Connect to Sarvam for this specific call
    const sarvamWs = createSarvamConnection(
        async (sarvamData) => {
            // Handle Transcript from Sarvam
            const transcript = sarvamData.transcript || sarvamData.text;
            if (transcript) {
                logger.debug(`Transcript: ${transcript}`);

                const io = getIO();

                // 1. Emit Text
                io.emit('transcript', transcript);

                // 2. Real-time Intent Check
                const analysis = await classifyIntent(transcript);

                if (analysis.intent && analysis.intent !== 'unknown') {
                    const isUrgent = analysis.urgency === 'high' || analysis.urgency === 'critical';

                    const insightPayload = {
                        type: isUrgent ? 'red_card' : 'info',
                        title: isUrgent ? `URGENT: ${analysis.intent.toUpperCase()}` : `Intent: ${analysis.intent}`,
                        message: analysis.summary || `Detected intent: ${analysis.intent}`,
                        data: { confidence: analysis.confidence, urgency: analysis.urgency }
                    };

                    io.emit('insight', insightPayload);
                }
            }
        },
        () => logger.info('Sarvam Closed for this Stream')
    );

    ws.on('message', (message) => {
        try {
            const msg = JSON.parse(message);

            switch (msg.event) {
                case 'start':
                    logger.info(`Stream Started: ${msg.streamSid}`);
                    // Optionally send config to Sarvam here
                    break;
                case 'media':
                    if (sarvamWs && sarvamWs.readyState === WebSocket.OPEN) {
                        const payload = msg.media.payload;
                        const audioBuffer = Buffer.from(payload, 'base64');
                        sarvamWs.send(audioBuffer);
                    }
                    break;
                case 'stop':
                    logger.info('Stream Stopped');
                    if (sarvamWs) sarvamWs.close();
                    break;
            }
        } catch (error) {
            logger.error('Twilio Message Error', error);
        }
    });

    ws.on('close', () => {
        logger.info('Twilio Stream Disconnected');
        if (sarvamWs) sarvamWs.close();
    });
};
