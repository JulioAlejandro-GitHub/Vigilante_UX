import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2/promise';

export const getPersonas = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT
        p.persona_id as id,
        p.nombre as name,
        p.tipo as userType,
        COALESCE(
          (SELECT rf_img.face_preview_url
           FROM recognition_face rf_img
           WHERE rf_img.assigned_persona_id = p.persona_id
             AND rf_img.face_preview_url IS NOT NULL
           ORDER BY rf_img.recognition_face_id DESC LIMIT 1),
          (SELECT rf_img.face_image_url
           FROM recognition_face rf_img
           WHERE rf_img.assigned_persona_id = p.persona_id
             AND rf_img.face_image_url IS NOT NULL
           ORDER BY rf_img.recognition_face_id DESC LIMIT 1),
          p.img_referencia
        ) as thumbnailUrl,
        COUNT(rf.recognition_face_id) as eventCount,
        MAX(re.occurred_at) as lastSeen,
        (SELECT c_last.nombre
         FROM recognition_face rf_last
         JOIN recognition_event re_last ON rf_last.recognition_event_id = re_last.recognition_event_id
         JOIN camara c_last ON re_last.camara_id = c_last.camara_id
         WHERE rf_last.assigned_persona_id = p.persona_id
         ORDER BY re_last.occurred_at DESC LIMIT 1
        ) as lastCamera
      FROM persona p
      LEFT JOIN recognition_face rf ON p.persona_id = rf.assigned_persona_id
      LEFT JOIN recognition_event re ON rf.recognition_event_id = re.recognition_event_id
      WHERE p.estado = 'activo'
      GROUP BY p.persona_id
      ORDER BY lastSeen DESC, p.nombre ASC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching personas:', error);
    res.status(500).json({ error: 'Error fetching personas' });
  }
};
