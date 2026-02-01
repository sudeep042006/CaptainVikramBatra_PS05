# NeurCall Implementation Tasks

- [x] **Refactor Sarvam Service**
    - [x] Replace manual WebSocket with `sarvamai` SDK
    - [x] Fix 403 Forbidden Error
    - [x] Implement async connection handling

- [x] **Fix Backend Crashes**
    - [x] Fix `CallLog` import error
    - [x] Fix `alawmulaw` ESM import error

- [/] **Real-Time Streaming**
    - [x] Implement Twilio Media Stream Handler
    - [x] Add Mulaw-to-PCM Transcoding
    - [ ] Debug Sarvam Audio Processing (Connection closes early)
    - [ ] **CURRENT**: Implement **Demo/Simulation Mode** for fallback

- [ ] **Dashboard Integration**
    - [ ] Verify Frontend receives simulated events
    - [ ] Ensure Insights appear on the UI

- [ ] **Final Polish**
    - [ ] Clean up simulation code (optional toggle)
    - [ ] Optimize real-time latency
