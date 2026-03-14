"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCriticalAlerts = exports.getActiveAlerts = exports.getRecentEvents = exports.getDashboardStats = void 0;
const database_1 = __importDefault(require("../config/database"));
const getDashboardStats = async (req, res) => {
    try {
        // Cameras Stats
        const [cameraRows] = await database_1.default.query(`
      SELECT
        COUNT(*) as totalCameras,
        SUM(CASE WHEN estado = 'Activo' THEN 1 ELSE 0 END) as activeCameras,
        SUM(CASE WHEN estado = 'Inactivo' THEN 1 ELSE 0 END) as inactiveCameras
      FROM camara
    `);
        // Observed Identities Stats
        const [identityRows] = await database_1.default.query(`
      SELECT
        COUNT(*) as totalObserved,
        SUM(CASE WHEN current_label = 'desconocido' OR current_label = 'unknown' THEN 1 ELSE 0 END) as unknownsActive,
        SUM(CASE WHEN current_label = 'ladron' THEN 1 ELSE 0 END) as thievesActive,
        SUM(CASE WHEN current_label = 'sospechoso' THEN 1 ELSE 0 END) as suspectsActive,
        SUM(CASE WHEN times_seen > 1 THEN 1 ELSE 0 END) as recurringIdentities
      FROM observed_identity
      WHERE status = 'active'
    `);
        // Recognition Stats (last 48h)
        const [eventRows] = await database_1.default.query(`
      SELECT
        COUNT(*) as recognitions48h
      FROM recognition_face rf
      JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
      WHERE re.occurred_at >= NOW() - INTERVAL 48 HOUR
    `);
        const stats = {
            totalCameras: Number(cameraRows[0]?.totalCameras) || 0,
            activeCameras: Number(cameraRows[0]?.activeCameras) || 0,
            inactiveCameras: Number(cameraRows[0]?.inactiveCameras) || 0,
            recognitions48h: Number(eventRows[0]?.recognitions48h) || 0,
            totalObserved: Number(identityRows[0]?.totalObserved) || 0,
            unknownsActive: Number(identityRows[0]?.unknownsActive) || 0,
            thievesActive: Number(identityRows[0]?.thievesActive) || 0,
            suspectsActive: Number(identityRows[0]?.suspectsActive) || 0,
            recurringIdentities: Number(identityRows[0]?.recurringIdentities) || 0,
        };
        res.json(stats);
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Error fetching stats' });
    }
};
exports.getDashboardStats = getDashboardStats;
const getRecentEvents = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const query = `
      SELECT
        re.recognition_event_id as id,
        re.occurred_at as timestamp,
        c.nombre as camera,
        rf.final_label as userType,
        COALESCE(rf.face_preview_url, rf.face_image_url) as thumbnailUrl,
        rf.face_preview_url as previewUrl,
        rf.face_image_url as cropUrl,
        rf.best_similarity as confidence,
        p.nombre as name,
        p.tipo as persona_tipo,
        oi.current_label as oi_label,
        oi.risk_level as risk_level,
        oi.times_seen as times_seen
      FROM recognition_event re
      JOIN recognition_face rf ON re.recognition_event_id = rf.recognition_event_id
      JOIN camara c ON re.camara_id = c.camara_id
      LEFT JOIN persona p ON rf.assigned_persona_id = p.persona_id
      LEFT JOIN observed_identity oi ON rf.observed_identity_id = oi.observed_identity_id
      ORDER BY re.occurred_at DESC
      LIMIT ?
    `;
        const [rows] = await database_1.default.query(query, [limit]);
        res.json(rows);
    }
    catch (error) {
        console.error('Error fetching recent events:', error);
        res.status(500).json({ error: 'Error fetching recent events' });
    }
};
exports.getRecentEvents = getRecentEvents;
const getActiveAlerts = async (req, res) => {
    try {
        // This endpoint is used by the Global Alerts system (polling).
        // It should return only the very recent critical events (e.g. last 5 minutes)
        // and ideally from the 'alerta_enviada' table or directly critical events from recognition_face.
        const [activeAlerts] = await database_1.default.query(`
      SELECT
        rf.recognition_face_id as eventId,
        c.nombre as cameraName,
        re.occurred_at as time,
        oi.current_label as identityLabel,
        oi.risk_level as priority,
        oi.times_seen as timesSeen,
        COALESCE(rf.face_preview_url, rf.face_image_url) as thumbnailUrl
      FROM recognition_face rf
      JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
      JOIN camara c ON re.camara_id = c.camara_id
      JOIN observed_identity oi ON rf.observed_identity_id = oi.observed_identity_id
      WHERE oi.risk_level IN ('high', 'critical')
        AND re.occurred_at >= NOW() - INTERVAL 5 MINUTE
      ORDER BY re.occurred_at DESC
      LIMIT 5
    `);
        res.json(activeAlerts);
    }
    catch (error) {
        console.error('Error fetching active alerts:', error);
        res.status(500).json({ error: 'Error fetching active alerts' });
    }
};
exports.getActiveAlerts = getActiveAlerts;
const getCriticalAlerts = async (req, res) => {
    try {
        // We will build critical alerts based on:
        // 1. Inactive cameras
        // 2. Recent thieves detections (last 24 hours)
        const alerts = [];
        // Check inactive cameras
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
        // Check recent high risk identities
        const [highRiskEvents] = await database_1.default.query(`
      SELECT
        c.nombre as camera_name,
        re.occurred_at as time,
        oi.current_label,
        oi.times_seen,
        COALESCE(rf.face_preview_url, rf.face_image_url) as thumbnailUrl,
        rf.recognition_face_id as event_id
      FROM recognition_face rf
      JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
      JOIN camara c ON re.camara_id = c.camara_id
      JOIN observed_identity oi ON rf.observed_identity_id = oi.observed_identity_id
      WHERE oi.risk_level IN ('high', 'critical') AND re.occurred_at >= NOW() - INTERVAL 24 HOUR
      ORDER BY re.occurred_at DESC
      LIMIT 10
    `);
        highRiskEvents.forEach((ev, index) => {
            alerts.push({
                id: `high-risk-${ev.event_id}`,
                title: `${ev.current_label.toUpperCase()} Detectado - ${ev.camera_name}`,
                time: ev.time,
                type: 'critical',
                thumbnailUrl: ev.thumbnailUrl,
                timesSeen: ev.times_seen,
                eventId: ev.event_id
            });
        });
        // Sort by time descending
        alerts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        res.json(alerts.slice(0, 10)); // return top 10 recent alerts
    }
    catch (error) {
        console.error('Error fetching critical alerts:', error);
        res.status(500).json({ error: 'Error fetching critical alerts' });
    }
};
exports.getCriticalAlerts = getCriticalAlerts;
//# sourceMappingURL=dashboardController.js.map