import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CallLog from './src/models/CallLog.js';
import connectDB from './src/config/db.js';

dotenv.config();

const seedData = [
    {
        transcript: "Caller: I'm feeling very anxious and don't know who to talk to. AI: I'm here for you. Can you tell me more about what's making you feel this way?",
        intent: "Mental Health Support",
        urgency: "High",
        duration: 345,
        startedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        endedAt: new Date(Date.now() - 1000 * 60 * 60 * 1.9),
        caller: "+919876543210"
    },
    {
        transcript: "Caller: There's a fire in my building! Help! AI: Staying calm is important. I am alerting the fire department immediately. Please evacuate if possible.",
        intent: "Fire Emergency",
        urgency: "Critical",
        duration: 120,
        startedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        endedAt: new Date(Date.now() - 1000 * 60 * 60 * 4.9),
        caller: "+919988776655"
    },
    {
        transcript: "Caller: I need information about the women's helpline numbers in my area. AI: I can help with that. Are you in immediate danger?",
        intent: "General Inquiry",
        urgency: "Medium",
        duration: 180,
        startedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        endedAt: new Date(Date.now() - 1000 * 60 * 60 * 23.9),
        caller: "+919123456789"
    },
    {
        transcript: "Caller: My child swallowed something poisonous. AI: Please tell me what they swallowed immediately. I am connecting you to poison control.",
        intent: "Medical Emergency",
        urgency: "Critical",
        duration: 400,
        startedAt: new Date(Date.now() - 1000 * 60 * 60 * 26), // 1 day ago
        endedAt: new Date(Date.now() - 1000 * 60 * 60 * 25.8),
        caller: "+918877665544"
    },
    {
        transcript: "Caller: I just want to report a broken street light. AI: Okay, I can log that ticket for the municipal corporation. Which street?",
        intent: "Civic Issue",
        urgency: "Low",
        duration: 90,
        startedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        endedAt: new Date(Date.now() - 1000 * 60 * 60 * 47.9),
        caller: "+917766554433"
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        console.log('🧹 Clearing existing history...');
        await CallLog.deleteMany({});

        console.log('🌱 Seeding new history...');
        await CallLog.insertMany(seedData);

        console.log('✅ History seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedDB();
