# Call Drop & Transcoding Fix

## Diagnosis
- **Call Drop**: Twilio drops calls if the TwiML doesn't keep them open. We need a `<Connect><Stream>` followed by `<Pause length="3600"/>` or similar loop.
- **No Transcript**: We are sending Mulaw 8k (Twilio default) to Sarvam (expecting PCM/WAV). This generates silence or noise.

## Plan

### 1. Fix Call Drop (`callRoutes.js`)
- Ensure TwiML returns:
  ```xml
  <Response>
    <Connect>
      <Stream url="wss://${host}/media-stream" />
    </Connect>
    <!-- Keep call open if stream ends or fails temporarily -->
    <Pause length="40" />
  </Response>
  ```

### 2. Implement Audio Transcoding (`streamService.js`)
- **Problem**: Incompatible codecs.
- **Solution**: Convert Mulaw -> PCM (Linear16).
- **Tools**: `wavefile` or custom lookup table.
- **Fastest Path**: Use a simple `ulaw2pcm` function inline. I will inject a small helper function `muLawToPcm` to convert the buffer before sending to Sarvam.

### 3. Verify
- User calls -> Call stays connected (TwiML fix).
- User speaks -> PCM Audio sent -> Sarvam transcribes -> Text appears.
