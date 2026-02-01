import express from 'express';
import { getDashboardStats, getRecentCalls } from '../controllers/dashboardController.js';
// Add Middleware to verify Supabase Token here in production
// import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/calls', getRecentCalls);

export default router;
