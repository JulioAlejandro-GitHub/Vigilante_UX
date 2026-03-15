import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export const getEventsGrouped = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;

    const search = req.query.search as string;
    const type = req.query.type as string;

    let whereClauses = [];
    let queryParams: any[] = [];

    if (search) {
      whereClauses.push('(p.nombre LIKE ? OR c.nombre LIKE ? OR oi.display_label LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (type && type !== 'all') {
      whereClauses.push('rf.final_label = ?');
      queryParams.push(type);
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(DISTINCT
        CASE
          WHEN rf.assigned_persona_id IS NOT NULL THEN CONCAT('persona_', rf.assigned_persona_id)
          WHEN rf.observed_identity_id IS NOT NULL THEN CONCAT('oi_', rf.observed_identity_id)
          ELSE CONCAT('face_', rf.recognition_face_id)
        END
      ) as total
      FROM recognition_face rf
      JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
      JOIN camara c ON re.camara_id = c.camara_id
      LEFT JOIN persona p ON rf.assigned_persona_id = p.persona_id
      LEFT JOIN observed_identity oi ON rf.observed_identity_id = oi.observed_identity_id
      ${whereStr}
    `;

    const [countRows] = await pool.query<RowDataPacket[]>(countQuery, queryParams);
    const total = countRows[0]?.total || 0;

    const dataQuery = `
      WITH RankedFaces AS (
        SELECT
          rf.recognition_face_id as id,
          re.occurred_at as timestamp,
          c.nombre as camera,
          rf.final_label as userType,
          rf.best_similarity as confidence,
          COALESCE(rf.face_preview_url, rf.face_image_url) as thumbnailUrl,
          rf.face_preview_url as previewUrl,
          rf.face_image_url as cropUrl,
          p.nombre as persona_name,
          p.tipo as persona_tipo,
          oi.display_label as oi_label,
          oi.risk_level as risk_level,
          oi.times_seen as times_seen,
          rf.assigned_persona_id as persona_id,
          rf.observed_identity_id as oi_id,
          CASE
            WHEN rf.assigned_persona_id IS NOT NULL THEN CONCAT('persona_', rf.assigned_persona_id)
            WHEN rf.observed_identity_id IS NOT NULL THEN CONCAT('oi_', rf.observed_identity_id)
            ELSE CONCAT('face_', rf.recognition_face_id)
          END as subject_id,
          ROW_NUMBER() OVER(
            PARTITION BY CASE
              WHEN rf.assigned_persona_id IS NOT NULL THEN CONCAT('persona_', rf.assigned_persona_id)
              WHEN rf.observed_identity_id IS NOT NULL THEN CONCAT('oi_', rf.observed_identity_id)
              ELSE CONCAT('face_', rf.recognition_face_id)
            END
            ORDER BY re.occurred_at DESC
          ) as rn
        FROM recognition_face rf
        JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
        JOIN camara c ON re.camara_id = c.camara_id
        LEFT JOIN persona p ON rf.assigned_persona_id = p.persona_id
        LEFT JOIN observed_identity oi ON rf.observed_identity_id = oi.observed_identity_id
        ${whereStr}
      )
      SELECT
        counts.subject_id,
        counts.last_seen as timestamp,
        counts.event_count as eventCount,
        rf_latest.id,
        rf_latest.camera,
        rf_latest.userType,
        rf_latest.confidence,
        rf_latest.thumbnailUrl,
        rf_latest.previewUrl,
        rf_latest.cropUrl,
        rf_latest.persona_name as name,
        rf_latest.persona_tipo,
        rf_latest.oi_label,
        rf_latest.risk_level,
        rf_latest.times_seen,
        rf_latest.persona_id,
        rf_latest.oi_id
      FROM (
        SELECT
          subject_id,
          MAX(timestamp) as last_seen,
          COUNT(*) as event_count
        FROM RankedFaces
        GROUP BY subject_id
      ) as counts
      JOIN RankedFaces rf_latest ON counts.subject_id = rf_latest.subject_id AND rf_latest.rn = 1
      ORDER BY counts.last_seen DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(dataQuery, queryParams);

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching grouped events:', error);
    res.status(500).json({ error: 'Error fetching grouped events' });
  }
};

export const getEvents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;

    const search = req.query.search as string;
    const type = req.query.type as string;
    const personaId = req.query.personaId as string;
    const oiId = req.query.oiId as string;

    let whereClauses = [];
    let queryParams: any[] = [];

    if (search) {
      whereClauses.push('(p.nombre LIKE ? OR c.nombre LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    if (type && type !== 'all') {
      whereClauses.push('rf.final_label = ?');
      queryParams.push(type);
    }

    if (personaId) {
      whereClauses.push('rf.assigned_persona_id = ?');
      queryParams.push(personaId);
    } else if (oiId) {
      whereClauses.push('rf.observed_identity_id = ?');
      queryParams.push(oiId);
    }

    const whereStr = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*) as total
      FROM recognition_face rf
      JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
      JOIN camara c ON re.camara_id = c.camara_id
      LEFT JOIN persona p ON rf.assigned_persona_id = p.persona_id
      ${whereStr}
    `;

    const [countRows] = await pool.query<RowDataPacket[]>(countQuery, queryParams);
    const total = countRows[0]?.total || 0;

    const dataQuery = `
      SELECT
        rf.recognition_face_id as id,
        re.occurred_at as timestamp,
        c.nombre as camera,
        rf.final_label as userType,
        rf.best_similarity as confidence,
        COALESCE(rf.face_preview_url, rf.face_image_url) as thumbnailUrl,
        rf.face_preview_url as previewUrl,
        rf.face_image_url as cropUrl,
        p.nombre as name,
        oi.current_label as oi_label,
        oi.risk_level as risk_level,
        oi.times_seen as times_seen
      FROM recognition_face rf
      JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
      JOIN camara c ON re.camara_id = c.camara_id
      LEFT JOIN persona p ON rf.assigned_persona_id = p.persona_id
      LEFT JOIN observed_identity oi ON rf.observed_identity_id = oi.observed_identity_id
      ${whereStr}
      ORDER BY re.occurred_at DESC
      LIMIT ? OFFSET ?
    `;

    queryParams.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(dataQuery, queryParams);

    res.json({
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
};

export const updateEventSubject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { assigned_persona_id, final_label, subject_id } = req.body;

    if (!assigned_persona_id) {
       return res.status(400).json({ error: 'assigned_persona_id is required' });
    }

    let result: ResultSetHeader;

    if (subject_id) {
        // Group edit: The subject_id format is 'oi_123' or 'persona_456' or 'face_789'
        const isOi = subject_id.startsWith('oi_');
        const isPersona = subject_id.startsWith('persona_');
        const rawId = parseInt(subject_id.split('_')[1], 10);

        if (isOi) {
            [result] = await pool.query<ResultSetHeader>(
                'UPDATE recognition_face SET assigned_persona_id = ?, final_label = ?, assigned_status = ? WHERE observed_identity_id = ? AND assigned_persona_id IS NULL',
                [assigned_persona_id, final_label || 'identificado', 'manual_asignado', rawId]
            );
        } else if (isPersona) {
             [result] = await pool.query<ResultSetHeader>(
                'UPDATE recognition_face SET assigned_persona_id = ?, final_label = ?, assigned_status = ? WHERE assigned_persona_id = ?',
                [assigned_persona_id, final_label || 'identificado', 'manual_asignado', rawId]
            );
        } else {
             [result] = await pool.query<ResultSetHeader>(
                'UPDATE recognition_face SET assigned_persona_id = ?, final_label = ?, assigned_status = ? WHERE recognition_face_id = ?',
                [assigned_persona_id, final_label || 'identificado', 'manual_asignado', rawId]
            );
        }
    } else {
        // Single edit
        [result] = await pool.query<ResultSetHeader>(
          'UPDATE recognition_face SET assigned_persona_id = ?, final_label = ?, assigned_status = ? WHERE recognition_face_id = ?',
          [assigned_persona_id, final_label || 'identificado', 'manual_asignado', id]
        );
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Evento no encontrado o ya asignado' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating event subject:', error);
    res.status(500).json({ error: 'Error updating event subject' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM recognition_face WHERE recognition_face_id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Error deleting event' });
  }
};
