import express from 'express';
import CallLog from '../models/CallLog.js';

const router = express.Router();

// TwiML Endpoint for Voice Call
router.post('/voice', (req, res) => {
  const { SERVER_URL } = process.env;

  const twiml = `
    <Response>
      <Say>Connecting you to the AI Agent. Please speak now.</Say>
      <Connect>
        <Stream url="wss://${SERVER_URL}/media-stream" />
      </Connect>
      <Pause length="60" />
    </Response>
  `;

  res.type('text/xml');
  res.send(twiml);
});

// History Endpoint (New)
router.get('/history', async (req, res) => {
  try {
    const calls = await CallLog.find().sort({ startedAt: -1 }).limit(20);
    res.status(200).json(calls);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
