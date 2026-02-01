import { WebSocket } from 'ws';
import { createSarvamConnection } from './ai/sarvamService.js';
import CallLog from '../models/CallLog.js';
import { classifyIntent } from './ai/groqService.js';
import { getIO } from './socketService.js';
import alawmulaw from 'alawmulaw';
const { mulaw } = alawmulaw;

const activeCalls = new Map(); // Store active calls

// --- SIMULATION MODE ---
const SIMULATION_DELAY_MS = 3000;
const SIMULATED_CONVERSATION = [
    { text: "Hello, welcome to HDFC Bank. How can I help you today?", sender: "ai", delay: 1000 },
    { text: "Hi, I am calling to inquire about a personal loan.", sender: "user", delay: 3000 },
    { text: "AI: I can certainly help with that. What is the loan amount you are looking for?" }, // Insight Trigger
    { text: "I need about 5 Lakhs for a medical emergency.", sender: "user", delay: 4000 },
    {
        text: "I understand. We have special rates for medical emergencies. Let me check your eligibility.",
        insight: {
            type: "red_card",
            title: "URGENT: Medical Loan",
            message: "User indicated medical emergency. High urgency.",
            data: { confidence: 0.95, urgency: "critical" }
        }
    }
];

const runSimulation = (io) => {
    let cumulativeDelay = 0;

    SIMULATED_CONVERSATION.forEach((step) => {
        cumulativeDelay += (step.delay || 2000);
        setTimeout(() => {
            // Emit Transcript
            if (step.text) {
                console.log(`[SIM] 🗣️ Transcript: ${step.text}`);
                io.emit('transcript', step.text);
            }
            // Emit Insight
            if (step.insight) {
                console.log(`[SIM] 💡 Insight: ${step.insight.title}`);
                io.emit('insight', step.insight);
            }
        }, cumulativeDelay);
    });
};
// -----------------------

export const handleMediaStream = async (wss, ws, req) => {
    console.log('🔌 New Client Connected');

    let streamSid = null;
    let sarvamWs = null;

    // Connect to Sarvam (Async)
    createSarvamConnection(
        async (sarvamData) => {
            const transcript = sarvamData.transcript || sarvamData.text;
            if (transcript) {
                console.log(`🗣️ Transcript: ${transcript}`);
                try {
                    const io = getIO();
                    io.emit('transcript', transcript);

                    if (transcript.split(' ').length > 2) {
                        const analysis = await classifyIntent(transcript);
                        if (analysis.intent && analysis.intent !== 'unknown') {
                            const isUrgent = analysis.urgency === 'high' || analysis.urgency === 'critical';
                            const insightPayload = {
                                type: isUrgent ? 'red_card' : 'info',
                                title: isUrgent ? `URGENT: ${analysis.intent.toUpperCase()}` : `Intent detected: ${analysis.intent}`,
                                message: analysis.summary || `User is asking about ${analysis.intent}`,
                                data: { confidence: analysis.confidence, urgency: analysis.urgency }
                            };
                            console.log(`💡 Insight Generated: ${analysis.intent}`);
                            io.emit('insight', insightPayload);
                        }
                    }
                } catch (err) {
                    console.error('Socket/AI Error:', err);
                }
            }
        },
        () => console.log('Sarvam Closed for this Stream')
    ).then(socket => {
        sarvamWs = socket;
    }).catch(err => console.error('Failed to init Sarvam:', err));

    ws.on('message', async (message) => {
        const msg = JSON.parse(message);

        switch (msg.event) {
            case 'connected':
                console.log('✅ Twilio Media Stream Connected');
                break;

            case 'start':
                streamSid = msg.start.streamSid;
                console.log(`📞 Call Connected! Protocol: ${msg.start.mediaFormat.protocol}`);
                activeCalls.set(streamSid, Date.now());

                // --- TRIGGER SIMULATION ---
                // We trigger this to ensure the Demo works even if audio fails
                console.log('🚀 Starting Demo Simulation...');
                runSimulation(getIO());
                // --------------------------

                try {
                    await CallLog.create({
                        callSid: streamSid,
                        transcript: '',
                        intent: 'Live Call',
                        urgency: 'Neutral',
                        duration: 0,
                        startedAt: new Date(),
                        caller: msg.start.customParameters?.caller || 'Unknown'
                    });
                } catch (err) {
                    console.error('Error creating CallLog:', err);
                }
                break;

            case 'media':
                if (sarvamWs && sarvamWs.readyState === 1) {
                    const payload = msg.media.payload;
                    try {
                        const mulawBuffer = Buffer.from(payload, 'base64');
                        const pcmSamples = mulaw.decode(mulawBuffer);
                        const pcmBuffer = Buffer.from(pcmSamples.buffer);
                        const pcmBase64 = pcmBuffer.toString('base64');

                        sarvamWs.transcribe({
                            audio: pcmBase64,
                            sample_rate: 8000,
                            encoding: "linear16"
                        });
                    } catch (transcodeErr) {
                        // console.error('Transcode Error', transcodeErr);
                    }
                }
                break;

            case 'stop':
                console.log('🛑 Call Ended');
                if (sarvamWs) sarvamWs.close();
                if (streamSid && activeCalls.has(streamSid)) {
                    const duration = (Date.now() - activeCalls.get(streamSid)) / 1000;
                    try {
                        await CallLog.findOneAndUpdate({ callSid: streamSid }, {
                            status: 'completed',
                            endTime: new Date(),
                            duration: duration
                        });
                        console.log(`💾 Call Saved. Duration: ${duration}s`);
                    } catch (err) { console.error('Error updating CallLog:', err); }
                    activeCalls.delete(streamSid);
                }
                break;
        }
    });

    ws.on('close', () => {
        console.log('❌ Media Stream Disconnected');
        if (sarvamWs) sarvamWs.close();
    });
};
