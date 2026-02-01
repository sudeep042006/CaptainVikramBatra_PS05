# Real-Time Setup Guide (Twilio + Ngrok)

To make calls from a real phone and see the dashboard update, your local backend must be accessible to the public internet so Twilio can send audio streams to it.

## 1. Install & Run Ngrok
You need **ngrok** to tunnel your `localhost:5000` to the internet.

1.  **Download ngrok**: [https://ngrok.com/download](https://ngrok.com/download)
2.  **Authenticate**: Run the command provided in your ngrok dashboard.
3.  **Start Tunnel**:
    ```bash
    ngrok http 5000
    ```
    *Copy the HTTPS URL (e.g., `https://a1b2-c3d4.ngrok-free.app`).*

## 2. Update Backend Config
Twilio needs to know where to connect via WebSocket (`wss://`).

1.  Open `NeurCall/backend/.env`.
2.  Add/Update `SERVER_URL`:
    ```env
    # No trailing slash!
    SERVER_URL=a1b2-c3d4.ngrok-free.app 
    ```

## 3. Configure Twilio
1.  Go to **Twilio Console** > Phone Numbers > Manage > Active Numbers.
2.  Click your phone number.
3.  Scroll to **Voice & Fax**.
4.  **A Call Comes In**: Select `Webhook`.
5.  **URL**: Paste your ngrok URL + `/voice`.
    *   Example: `https://a1b2-c3d4.ngrok-free.app/voice`
6.  **HTTP Method**: `POST`.
7.  **Save**.

## 4. Test the Real Call
1.  **Ensure Backend is Running**: `npm run dev` in `backend/`.
2.  **Ensure Frontend is Running**: `npm run dev` in `frontend/`.
3.  **Call your Twilio Number** from your mobile phone.
4.  **Check Terminal**: You should see "Twilio connected to stream".
5.  **Check Dashboard**:
    *   Status should change to **Active**.
    *   Transcripts should appear in real-time.
    *   AI Insights should trigger based on what you say.

## Trouble? 
*   **Twilio Error**: Check Ngrok terminal (requests 200 OK?).
*   **No Audio**: Twilio Media Streams send audio to your server. If `streamService.js` logs "Buffer received", it's working.
*   **Sarvam/Deepgram**: Ensure those API keys are valid in `.env`.
