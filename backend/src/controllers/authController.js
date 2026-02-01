import Agent from '../models/Agent.js';
import { logger } from '../utils/logger.js';

export const syncSupabaseUser = async (req, res) => {
    try {
        const { id, email, raw_user_meta_data } = req.body; // Supabase Webhook payload structure varies

        // Upsert Agent in MongoDB
        const name = raw_user_meta_data?.name || email.split('@')[0];

        await Agent.findOneAndUpdate(
            { supabase_id: id },
            {
                email,
                name,
                role: 'agent', // Default
                status: 'Offline'
            },
            { upsert: true, new: true }
        );

        logger.info(`Synced Agent: ${email}`);
        res.status(200).send('Synced');
    } catch (error) {
        logger.error('Auth Sync Failed', error);
        res.status(500).send(error.message);
    }
};
