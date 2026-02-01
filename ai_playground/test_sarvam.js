import WebSocket from 'ws';
import dotenv from 'dotenv';
dotenv.config({ path: '../backend/.env' });

const SARVAM_URL = process.env.SARVAM_WS_URL || 'wss://api.sarvam.ai/speech-to-text-websocket';

console.log(`Connecting to Sarvam at ${SARVAM_URL}...`);

try {
    const ws = new WebSocket(SARVAM_URL);

    ws.on('open', () => {
        console.log("Connected! Sending test data...");
        // In a real test, you'd send a small wav buffer here
        // ws.send(someAudioBuffer);
    });

    ws.on('message', (data) => {
        console.log("Received data:", data.toString());
    });

    ws.on('error', (err) => {
        console.error("Socket Error:", err.message);
    });

    ws.on('close', () => {
        console.log("Disconnected.");
    });

} catch (e) {
    console.error("Setup Error:", e);
}
