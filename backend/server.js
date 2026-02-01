import http from 'http';
import { WebSocketServer } from 'ws';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { initSocket } from './src/services/socketService.js';
import { handleMediaStream } from './src/services/streamService.js';

connectDB();

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Initialize WebSocket Server for Twilio
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

    // Upgrade Logic: Check logic for Twilio
    if (pathname === '/streams/twilio') {
        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
        });
    }
    // Socket.io handles its own upgrades automatically internally when attached to server
});

wss.on('connection', (ws, req) => {
    handleMediaStream(ws, req);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
