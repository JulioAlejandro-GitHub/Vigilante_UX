"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const router = (0, express_1.Router)();
router.get('/stats', dashboardController_1.getDashboardStats);
router.get('/recent-events', dashboardController_1.getRecentEvents);
router.get('/critical-alerts', dashboardController_1.getCriticalAlerts);
router.get('/active-alerts', dashboardController_1.getActiveAlerts);
exports.default = router;
//# sourceMappingURL=dashboardRoutes.js.map