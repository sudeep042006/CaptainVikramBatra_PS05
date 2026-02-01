import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true, unique: true },
    name: String,
    sentimentScore: { type: Number, default: 0 }, // Average sentiment
    lastContacted: Date,
    notes: String,
    tags: [String] // e.g. "VIP", "Angry", "Sales Lead"
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema);
