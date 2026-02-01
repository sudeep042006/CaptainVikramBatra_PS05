import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        logger.info(`Frontend Connected: ${socket.id}`);

        socket.on('disconnect', () => {
            logger.info(`Frontend Disconnected: ${socket.id}`);
        });

        // Handle Agent Presence
        socket.on('agent_status', (status) => {
            logger.info(`Agent ${socket.id} is now ${status}`);
            socket.broadcast.emit('agent_update', { id: socket.id, status });
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) throw new Error('Socket.io NOT initialized');
    return io;
};
