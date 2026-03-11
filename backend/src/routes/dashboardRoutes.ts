import { Router } from 'express';
import { getDashboardStats, getRecentEvents, getCriticalAlerts } from '../controllers/dashboardController';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/recent-events', getRecentEvents);
router.get('/critical-alerts', getCriticalAlerts);

export default router;
