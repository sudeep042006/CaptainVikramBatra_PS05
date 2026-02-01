import express from 'express';
import cors from 'cors';
import callRoutes from './routes/callRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
import { logger } from './utils/logger.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging Middleware
app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/calls', callRoutes);
app.use('/api/agent', agentRoutes);
// app.use('/api/auth', authRoutes); // Link authController if exposing webhook

app.get('/', (req, res) => res.json({ status: 'NeurCall Backend v3 Running' }));

export default app;
