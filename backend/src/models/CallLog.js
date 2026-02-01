import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema({
    transcript: String,
    intent: String,
    urgency: String,
    duration: Number, // in seconds
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    startedAt: { type: Date, default: Date.now },
    endedAt: Date
}, { timestamps: true });

const CallLog = mongoose.model('CallLog', callLogSchema);
export default CallLog;
