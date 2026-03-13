import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2/promise';

export const getPersonas = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT
        persona_id as id,
        nombre as name,
        tipo as userType,
        img_referencia as thumbnailUrl
      FROM persona
      WHERE estado = 'activo'
      ORDER BY nombre ASC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching personas:', error);
    res.status(500).json({ error: 'Error fetching personas' });
  }
};
