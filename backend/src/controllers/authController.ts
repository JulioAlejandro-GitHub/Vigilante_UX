import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database';

interface OperadorRow {
  operador_id: number;
  nombre: string;
  email: string;
  rol: string;
  estado: string;
  password_bcryptjs: string;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { user, password } = req.body;

  if (!user || !password) {
    res.status(400).json({ error: 'Debe proveer correo electrónico y contraseña.' });
    return;
  }

  try {
    const [rows]: any = await db.query(
      `SELECT operador_id, nombre, email, rol, estado, password_bcryptjs
       FROM operador
       WHERE email = ? AND deleted_at IS NULL LIMIT 1`,
      [user]
    );

    if (!rows || rows.length === 0) {
      res.status(401).json({ error: 'Credenciales inválidas. Por favor, intenta de nuevo.' });
      return;
    }

    const operador = rows[0] as OperadorRow;

    if (operador.estado !== 'activo') {
      res.status(403).json({ error: 'Su cuenta se encuentra inactiva. Contacte al administrador.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, operador.password_bcryptjs);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Credenciales inválidas. Por favor, intenta de nuevo.' });
      return;
    }

    const secretKey = process.env.SECRETORPRIVATEKEY || '4e1b54cf-a56e-46a1-8d26-86cdc873ce69';
    const token = jwt.sign(
      { id: operador.operador_id, email: operador.email, rol: operador.rol },
      secretKey,
      { expiresIn: '12h' }
    );

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
    const userAgent = req.headers['user-agent'] || null;

    try {
      await db.query(
        `INSERT INTO operador_login (operador_id, ip_origen, user_agent) VALUES (?, ?, ?)`,
        [operador.operador_id, ip, userAgent]
      );
    } catch (e) {
      console.error('Error recording login attempt:', e);
    }

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: operador.operador_id.toString(),
        name: operador.nombre,
        email: operador.email,
        role: operador.rol
      }
    });

  } catch (error) {
    console.error('Error durante el proceso de login:', error);
    res.status(500).json({ error: 'Ha ocurrido un error en el servidor. Por favor, intente más tarde.' });
  }
};
