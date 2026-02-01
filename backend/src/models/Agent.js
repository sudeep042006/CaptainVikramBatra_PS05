import mongoose from 'mongoose';

const agentSchema = new mongoose.Schema({
    supabase_id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: { type: String, default: 'agent' }, // e.g., admin, agent
    status: {
        type: String,
        enum: ['Available', 'Busy', 'Offline'],
        default: 'Offline'
    }
}, { timestamps: true });

const Agent = mongoose.model('Agent', agentSchema);
export default Agent;
