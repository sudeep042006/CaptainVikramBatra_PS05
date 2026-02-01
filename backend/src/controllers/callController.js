export const handleVoiceWebhook = (req, res) => {
    // TwiML response to connect to the functionality
    // We assume the server is running on a publicly accessible URL (ngrok for dev)
    // The stream url should be wss://<your-domain>/streams

    // In production, you'd replace 'your-domain' dynamically
    const xml = `
    <Response>
        <Connect>
            <Stream url="wss://${req.headers.host}/streams" />
        </Connect>
    </Response>
    `;

    res.type('text/xml');
    res.send(xml.trim());
};
