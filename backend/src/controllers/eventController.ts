import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export const getEvents = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = (page - 1) * limit;

    const search = req.query.search as string;
    const type = req.query.type as string;
    const personaId = req.query.personaId as string;

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
        p.nombre as name
      FROM recognition_face rf
      JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
      JOIN camara c ON re.camara_id = c.camara_id
      LEFT JOIN persona p ON rf.assigned_persona_id = p.persona_id
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
    const { assigned_persona_id, final_label } = req.body;

    if (!assigned_persona_id) {
       return res.status(400).json({ error: 'assigned_persona_id is required' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE recognition_face SET assigned_persona_id = ?, final_label = ?, assigned_status = ? WHERE recognition_face_id = ?',
      [assigned_persona_id, final_label || 'identificado', 'manual_asignado', id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
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
