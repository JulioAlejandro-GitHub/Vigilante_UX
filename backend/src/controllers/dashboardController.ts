import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2/promise';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Cameras Stats
    const [cameraRows] = await pool.query<RowDataPacket[]>(`
      SELECT
        COUNT(*) as totalCameras,
        SUM(CASE WHEN estado = 'Activo' THEN 1 ELSE 0 END) as activeCameras,
        SUM(CASE WHEN estado = 'Inactivo' THEN 1 ELSE 0 END) as inactiveCameras
      FROM camara
    `);

    // Observed Identities Stats
    const [identityRows] = await pool.query<RowDataPacket[]>(`
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
    const [eventRows] = await pool.query<RowDataPacket[]>(`
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
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Error fetching stats' });
  }
};

export const getRecentEvents = async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

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

    const [rows] = await pool.query<RowDataPacket[]>(query, [limit]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching recent events:', error);
    res.status(500).json({ error: 'Error fetching recent events' });
  }
};

export const getActiveAlerts = async (req: Request, res: Response) => {
  try {
    // This endpoint is used by the Global Alerts system (polling).
    // It should return only the very recent critical events (e.g. last 5 minutes)
    // and ideally from the 'alerta_enviada' table or directly critical events from recognition_face.

    const [activeAlerts] = await pool.query<RowDataPacket[]>(`
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
  } catch (error) {
    console.error('Error fetching active alerts:', error);
    res.status(500).json({ error: 'Error fetching active alerts' });
  }
};

export const getCriticalAlerts = async (req: Request, res: Response) => {
  try {
    // We will build critical alerts based on:
    // 1. Inactive cameras
    // 2. Recent thieves detections (last 24 hours)

    const alerts: any[] = [];

    // Check inactive cameras
    const [inactiveCams] = await pool.query<RowDataPacket[]>(`
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
    const [highRiskEvents] = await pool.query<RowDataPacket[]>(`
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
  } catch (error) {
    console.error('Error fetching critical alerts:', error);
    res.status(500).json({ error: 'Error fetching critical alerts' });
  }
};
