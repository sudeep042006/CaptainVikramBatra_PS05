# 🚀 NeurCall Real-Time Verification

You are ready for the live test. The system is fully integrated:
**Twilio -> Ngrok -> Backend -> Sarvam (STT) -> Groq (Insights) -> Frontend Socket**

## 1. Pre-Flight Check
Ensure you have the following running:
1.  **Terminals**:
    *   Result of `npm run dev` in `/frontend` (Vite)
    *   Result of `npm run dev` in `/backend` (Express)
2.  **Ngrok**:
    *   Must be running: `ngrok http 5000`
    *   URL `https://....ngrok-free.dev` must match `SERVER_URL` in `.env`.
3.  **Twilio**:
    *   Voice Webhook set to `https://<YOUR_NGROK>/voice`.

## 2. The Live Test
1.  **Open Dashboard**: Go to `http://localhost:5173`.
2.  **Login**: Use demo credentials (just click "Sign In").
3.  **Call**: Dial your Twilio Phone Number from your cell phone.

## 3. What to Watch For
As you speak on the phone, verify these real-time events on the dashboard:

| Feature | Expected Behavior |
| :--- | :--- |
| **System Status** | Changes from "Idle" to **"Live Call"** automatically. |
| **Transcript** | Your words should appear in the "Live Transcript" box within ~1s. |
| **AI Insights** | Say "I am angry about my bill". An **Insight Card** should pop up. |
| **History** | Hang up. Go to "History" tab. Your call should be listed with duration. |

## 4. Troubleshooting
*   **No Transcript?** Check Backend terminal. Do you see `🗣️ Transcript: ...`?
    *   *If Yes*: Socket issue. Check browser console logs.
    *   *If No*: Sarvam/Twilio issue. Check `Twilio Media Stream Connected` log.
*   **No Audio?** Check Twilio logs for "Stream connection established".

**Enjoy your Real-Time AI Agent!**
