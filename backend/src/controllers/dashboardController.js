import CallLog from '../models/CallLog.js';
import Agent from '../models/Agent.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalCalls = await CallLog.countDocuments();

        // Aggregation for Intents
        const intentBreakdown = await CallLog.aggregate([
            { $group: { _id: "$intent", count: { $sum: 1 } } }
        ]);

        const agentsOnline = await Agent.countDocuments({ status: { $in: ['Available', 'Busy'] } });

        res.json({
            totalCalls,
            intentBreakdown,
            agentsOnline
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRecentCalls = async (req, res) => {
    try {
        const calls = await CallLog.find().sort({ createdAt: -1 }).limit(10);
        res.json(calls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
