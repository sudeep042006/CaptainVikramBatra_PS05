import express from 'express';
import { handleVoiceWebhook } from '../controllers/callController.js';

const router = express.Router();

router.post('/voice', handleVoiceWebhook);

export default router;
