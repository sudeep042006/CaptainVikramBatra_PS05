import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { WebSocketServer } from 'ws'; // Import WebSocket
import connectDB from './src/config/db.js';
import callRoutes from './src/routes/callRoutes.js';
import { handleMediaStream } from './src/services/streamService.js';

import dashboardRoutes from './src/routes/dashboardRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
// Parse form-data (Twilio sends form data)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 1. Mount the Route
app.use('/', callRoutes);
app.use('/api/agent/dashboard', dashboardRoutes);

const PORT = process.env.PORT || 5000;

// 2. Start HTTP Server
const server = app.listen(PORT, () => {
    console.log(`\n🔊 NeurCall Server running on port ${PORT}`);
    console.log(`👉 http://localhost:${PORT}`);
});

// 3. Attach WebSocket Server to the same HTTP Port
const wss = new WebSocketServer({ server });

// 4. Initialize Socket.IO
import { initSocket } from './src/services/socketService.js';
initSocket(server);

wss.on('connection', (ws, req) => {
    console.log('🔌 New Client Connected');

    // Check if this connection is for the Media Stream
    // Twilio connects to "wss://.../media-stream"
    if (req.url === '/media-stream') {
        handleMediaStream(wss, ws, req);
    }
});

export default app;
