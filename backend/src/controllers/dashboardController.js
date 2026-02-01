import CallLog from '../models/CallLog.js';

// @desc    Get dashboard statistics
// @route   GET /api/agent/dashboard/stats
export const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const totalCallsToday = await CallLog.countDocuments({
            startedAt: { $gte: today }
        });

        const activeAgents = 1; // Placeholder for now

        // Calculate average duration
        const calls = await CallLog.find({ duration: { $exists: true } });
        const totalDuration = calls.reduce((acc, call) => acc + (call.duration || 0), 0);
        const avgDurationSeconds = calls.length > 0 ? totalDuration / calls.length : 0;

        // Format MM m SS s
        const minutes = Math.floor(avgDurationSeconds / 60);
        const seconds = Math.floor(avgDurationSeconds % 60);
        const avgDuration = `${minutes}m ${seconds}s`;

        res.json({
            totalCalls: totalCallsToday,
            agentsOnline: activeAgents,
            avgDuration: avgDuration,
            sentiment: 'Neutral' // Placeholder until sentiment analysis is active
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get call history
// @route   GET /api/agent/dashboard/calls
export const getCallHistory = async (req, res) => {
    try {
        const calls = await CallLog.find().sort({ startedAt: -1 }).limit(50);

        const formattedCalls = calls.map(call => ({
            id: call._id,
            caller: call.caller || 'Unknown',
            intent: call.intent || 'General',
            status: call.endedAt ? 'Completed' : 'Active',
            duration: call.duration ? `${Math.floor(call.duration / 60)}m ${Math.floor(call.duration % 60)}s` : 'Ongoing',
            date: new Date(call.startedAt).toLocaleString(),
            sentiment: call.urgency || 'Neutral'
        }));

        res.json(formattedCalls);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
