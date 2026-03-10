import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

// Helper for filtering
const buildWhereClause = (reqQuery: any) => {
  const { search, empresa_id, local_id, estado, protocolo } = reqQuery;
  const conditions: string[] = [];
  const params: any[] = [];

  if (search) {
    conditions.push(`(c.nombre LIKE ? OR c.camara_hostname LIKE ? OR c.camara_user LIKE ?)`);
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam);
  }

  if (empresa_id) {
    conditions.push(`s.empresa_id = ?`);
    params.push(empresa_id);
  }

  if (local_id) {
    conditions.push(`c.local_id = ?`);
    params.push(local_id);
  }

  if (estado) {
    conditions.push(`c.estado = ?`);
    params.push(estado);
  }

  if (protocolo) {
    conditions.push(`c.protocolo = ?`);
    params.push(protocolo);
  }

  return {
    whereStr: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
  };
};

export const getCameras = async (req: Request, res: Response) => {
  try {
    const { whereStr, params } = buildWhereClause(req.query);

    const query = `
      SELECT
        c.camara_id, c.local_id, c.nombre, c.ubicacion, c.estado, c.orden,
        c.protocolo, c.camara_hostname, c.camara_port, c.camara_user, c.camara_pass,
        c.camara_params, c.stream_url, c.created_at, c.updated_at,
        s.nombre as sucursal_nombre,
        s.empresa_id,
        e.nombre as empresa_nombre
      FROM camara c
      JOIN sucursal s ON c.local_id = s.local_id
      JOIN empresa e ON s.empresa_id = e.empresa_id
      ${whereStr}
      ORDER BY c.orden ASC, c.nombre ASC
    `;

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching cameras:', error);
    res.status(500).json({ error: 'Error al obtener las cámaras.' });
  }
};

export const getCameraById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT
        c.*,
        s.nombre as sucursal_nombre,
        s.empresa_id,
        e.nombre as empresa_nombre
      FROM camara c
      JOIN sucursal s ON c.local_id = s.local_id
      JOIN empresa e ON s.empresa_id = e.empresa_id
      WHERE c.camara_id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Cámara no encontrada.' });
    }

    res.json(rows[0]);
  } catch (error: any) {
    console.error('Error fetching camera:', error);
    res.status(500).json({ error: 'Error al obtener la cámara.' });
  }
};

export const createCamera = async (req: Request, res: Response) => {
  try {
    const {
      local_id, nombre, ubicacion, estado, orden, protocolo,
      camara_hostname, camara_port, camara_user, camara_pass,
      camara_params, stream_url
    } = req.body;

    // Validate required fields
    if (!local_id || !nombre) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (local_id, nombre).' });
    }

    const query = `
      INSERT INTO camara (
        local_id, nombre, ubicacion, estado, orden, protocolo,
        camara_hostname, camara_port, camara_user, camara_pass, camara_params, stream_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      local_id, nombre, ubicacion || 'Estadia', estado || 'Activo', orden || null, protocolo || 'onvif',
      camara_hostname || null, camara_port || null, camara_user || null, camara_pass || null, camara_params || null, stream_url || null
    ];

    const [result] = await pool.query<ResultSetHeader>(query, values);

    // Fetch the newly created camera
    const [newCamera] = await pool.query<RowDataPacket[]>(`
      SELECT
        c.*,
        s.nombre as sucursal_nombre,
        s.empresa_id,
        e.nombre as empresa_nombre
      FROM camara c
      JOIN sucursal s ON c.local_id = s.local_id
      JOIN empresa e ON s.empresa_id = e.empresa_id
      WHERE c.camara_id = ?
    `, [result.insertId]);

    res.status(201).json(newCamera[0]);
  } catch (error: any) {
    console.error('Error creating camera:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ya existe una cámara con ese nombre en esta sucursal.' });
    }
    res.status(500).json({ error: 'Error al crear la cámara.' });
  }
};

export const updateCamera = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      local_id, nombre, ubicacion, estado, orden, protocolo,
      camara_hostname, camara_port, camara_user, camara_pass,
      camara_params, stream_url
    } = req.body;

    // Validate if exists
    const [existing] = await pool.query<RowDataPacket[]>('SELECT camara_id FROM camara WHERE camara_id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Cámara no encontrada.' });
    }

    const query = `
      UPDATE camara SET
        local_id = ?, nombre = ?, ubicacion = ?, estado = ?, orden = ?, protocolo = ?,
        camara_hostname = ?, camara_port = ?, camara_user = ?, camara_pass = ?, camara_params = ?, stream_url = ?
      WHERE camara_id = ?
    `;

    const values = [
      local_id, nombre, ubicacion, estado, orden, protocolo,
      camara_hostname, camara_port, camara_user, camara_pass, camara_params, stream_url,
      id
    ];

    await pool.query(query, values);

    // Fetch the updated camera
    const [updatedCamera] = await pool.query<RowDataPacket[]>(`
      SELECT
        c.*,
        s.nombre as sucursal_nombre,
        s.empresa_id,
        e.nombre as empresa_nombre
      FROM camara c
      JOIN sucursal s ON c.local_id = s.local_id
      JOIN empresa e ON s.empresa_id = e.empresa_id
      WHERE c.camara_id = ?
    `, [id]);

    res.json(updatedCamera[0]);
  } catch (error: any) {
    console.error('Error updating camera:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Ya existe una cámara con ese nombre en esta sucursal.' });
    }
    res.status(500).json({ error: 'Error al actualizar la cámara.' });
  }
};

export const deleteCamera = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Physical deletion (if constrained, it will throw an error, which we catch)
    // We will attempt logical deletion first as requested for safety: "eliminar o desactivar"
    // Actually, let's just do physical delete. The DB has RESTRICT on ON DELETE for recognition_event -> camara.
    // If it fails with ER_ROW_IS_REFERENCED_2, we fallback to logical delete or return an error suggesting logical disable.
    // Let's implement physical delete, and if it fails, catch it and return a specific error.

    // Validate if exists
    const [existing] = await pool.query<RowDataPacket[]>('SELECT camara_id FROM camara WHERE camara_id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Cámara no encontrada.' });
    }

    try {
      await pool.query('DELETE FROM camara WHERE camara_id = ?', [id]);
      res.json({ message: 'Cámara eliminada físicamente con éxito.' });
    } catch (deleteError: any) {
      if (deleteError.code === 'ER_ROW_IS_REFERENCED_2') {
         // Logical disable fallback
         await pool.query('UPDATE camara SET estado = "Inactivo" WHERE camara_id = ?', [id]);
         return res.json({ message: 'La cámara tenía dependencias (eventos). Fue desactivada (baja lógica) en su lugar.' });
      } else {
        throw deleteError;
      }
    }

  } catch (error: any) {
    console.error('Error deleting camera:', error);
    res.status(500).json({ error: 'Error al eliminar la cámara.' });
  }
};

// --- Helper endpoints for dropdowns ---

export const getEmpresas = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM empresa ORDER BY nombre ASC');
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching empresas:', error);
    res.status(500).json({ error: 'Error al obtener empresas.' });
  }
};

export const getSucursales = async (req: Request, res: Response) => {
  try {
    const { empresa_id } = req.query;
    let query = 'SELECT * FROM sucursal';
    const params: any[] = [];

    if (empresa_id) {
      query += ' WHERE empresa_id = ?';
      params.push(empresa_id);
    }
    query += ' ORDER BY nombre ASC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching sucursales:', error);
    res.status(500).json({ error: 'Error al obtener sucursales.' });
  }
};
