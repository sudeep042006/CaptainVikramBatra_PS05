import express from 'express';
import { getDashboardStats, getCallHistory } from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/calls', getCallHistory);

export default router;
