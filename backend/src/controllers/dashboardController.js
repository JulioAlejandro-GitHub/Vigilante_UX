"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardSummary = void 0;
const database_1 = __importDefault(require("../config/database"));
const getDashboardSummary = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        // We use a single transaction-like or at least concurrent approach for consistency
        // Although standard queries without transaction might have slight ms diffs,
        // running them together reduces the window significantly.
        const [cameraRows] = await database_1.default.query(`
      SELECT
        COUNT(*) as totalCameras,
        SUM(CASE WHEN estado = 'Activo' THEN 1 ELSE 0 END) as activeCameras,
        SUM(CASE WHEN estado = 'Inactivo' THEN 1 ELSE 0 END) as inactiveCameras
      FROM camara
    `);
        // Recognition Stats (last 24h for consistency)
        const [eventRows] = await database_1.default.query(`
      SELECT
        COUNT(*) as recognitions24h,
        SUM(CASE WHEN final_label = 'desconocido' THEN 1 ELSE 0 END) as unknowns24h,
        SUM(CASE WHEN final_label = 'ladron' THEN 1 ELSE 0 END) as thieves24h
      FROM recognition_face rf
      JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
      WHERE re.occurred_at >= NOW() - INTERVAL 24 HOUR
    `);
        // Recent Events
        const queryEvents = `
      SELECT
        re.recognition_event_id as id,
        re.occurred_at as timestamp,
        c.nombre as camera,
        rf.final_label as userType,
        rf.face_img as thumbnail,
        rf.best_similarity as confidence,
        p.nombre as name,
        p.tipo as persona_tipo
      FROM recognition_event re
      JOIN recognition_face rf ON re.recognition_event_id = rf.recognition_event_id
      JOIN camara c ON re.camara_id = c.camara_id
      LEFT JOIN persona p ON rf.assigned_persona_id = p.persona_id
      ORDER BY re.occurred_at DESC
      LIMIT ?
    `;
        const [recentEvents] = await database_1.default.query(queryEvents, [limit]);
        // Critical Alerts
        const alerts = [];
        const [inactiveCams] = await database_1.default.query(`
      SELECT nombre, updated_at as time
      FROM camara
      WHERE estado = 'Inactivo'
    `);
        inactiveCams.forEach(cam => {
            alerts.push({
                id: `cam-${cam.nombre}`,
                title: `Cámara ${cam.nombre} Inactiva`,
                time: cam.time,
                type: 'error'
            });
        });
        const [thieves] = await database_1.default.query(`
      SELECT c.nombre as camera_name, re.occurred_at as time
      FROM recognition_face rf
      JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
      JOIN camara c ON re.camara_id = c.camara_id
      WHERE rf.final_label = 'ladron' AND re.occurred_at >= NOW() - INTERVAL 24 HOUR
      ORDER BY re.occurred_at DESC
      LIMIT 10
    `);
        thieves.forEach((thief, index) => {
            alerts.push({
                id: `thief-${index}`,
                title: `Ladrón Detectado - ${thief.camera_name}`,
                time: thief.time,
                type: 'critical'
            });
        });
        alerts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        res.json({
            stats: {
                totalCameras: Number(cameraRows[0]?.totalCameras) || 0,
                activeCameras: Number(cameraRows[0]?.activeCameras) || 0,
                inactiveCameras: Number(cameraRows[0]?.inactiveCameras) || 0,
                recognitions24h: Number(eventRows[0]?.recognitions24h) || 0,
                unknowns24h: Number(eventRows[0]?.unknowns24h) || 0,
                thieves24h: Number(eventRows[0]?.thieves24h) || 0,
            },
            recentEvents,
            criticalAlerts: alerts.slice(0, 10)
        });
    }
    catch (error) {
        console.error('Error fetching dashboard summary:', error);
        res.status(500).json({ error: 'Error fetching summary' });
    }
};
exports.getDashboardSummary = getDashboardSummary;
//# sourceMappingURL=dashboardController.js.map