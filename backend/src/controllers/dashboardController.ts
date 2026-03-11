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

    // Recognition Stats (last 48h)
    const [eventRows] = await pool.query<RowDataPacket[]>(`
      SELECT
        COUNT(*) as recognitions48h,
        SUM(CASE WHEN final_label = 'desconocido' THEN 1 ELSE 0 END) as unknowns48h,
        SUM(CASE WHEN final_label = 'ladron' THEN 1 ELSE 0 END) as thieves48h
      FROM recognition_face rf
      JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
      WHERE re.occurred_at >= NOW() - INTERVAL 48 HOUR
    `);

    const stats = {
      totalCameras: Number(cameraRows[0]?.totalCameras) || 0,
      activeCameras: Number(cameraRows[0]?.activeCameras) || 0,
      inactiveCameras: Number(cameraRows[0]?.inactiveCameras) || 0,
      recognitions48h: Number(eventRows[0]?.recognitions48h) || 0,
      unknowns48h: Number(eventRows[0]?.unknowns48h) || 0,
      thieves48h: Number(eventRows[0]?.thieves48h) || 0,
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

    const [rows] = await pool.query<RowDataPacket[]>(query, [limit]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching recent events:', error);
    res.status(500).json({ error: 'Error fetching recent events' });
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

    // Check recent thieves
    const [thieves] = await pool.query<RowDataPacket[]>(`
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

    // Sort by time descending
    alerts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    res.json(alerts.slice(0, 10)); // return top 10 recent alerts
  } catch (error) {
    console.error('Error fetching critical alerts:', error);
    res.status(500).json({ error: 'Error fetching critical alerts' });
  }
};
