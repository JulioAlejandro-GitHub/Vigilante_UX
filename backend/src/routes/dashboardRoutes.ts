import { Router } from 'express';
import { getDashboardStats, getRecentEvents, getCriticalAlerts, getActiveAlerts } from '../controllers/dashboardController';

const router = Router();

router.get('/stats', getDashboardStats);
router.get('/recent-events', getRecentEvents);
router.get('/critical-alerts', getCriticalAlerts);
router.get('/active-alerts', getActiveAlerts);

export default router;
