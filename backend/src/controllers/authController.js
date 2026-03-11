"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const dictionaries_1 = require("../constants/dictionaries");
const login = async (req, res) => {
    console.error('loginloginloginloginlogin');
    const { user, password } = req.body;
    if (!user || !password) {
        res.status(400).json({ error: 'Debe proveer correo electrónico y contraseña.' });
        return;
    }
    try {
        const [rows] = await database_1.default.query(`SELECT operador_id, nombre, email, rol, estado, password_bcryptjs
       FROM operador
       WHERE email = ? AND deleted_at IS NULL LIMIT 1`, [user]);
        if (!rows || rows.length === 0) {
            res.status(401).json({ error: 'Credenciales inválidas. Por favor, intenta de nuevo.' });
            return;
        }
        const operador = rows[0];
        if (operador.estado !== dictionaries_1.OperadorEstado.ACTIVO) {
            res.status(403).json({ error: 'Su cuenta se encuentra inactiva. Contacte al administrador.' });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, operador.password_bcryptjs);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Credenciales inválidas. Por favor, intenta de nuevo.' });
            return;
        }
        const secretKey = process.env.SECRETORPRIVATEKEY || '';
        const token = jsonwebtoken_1.default.sign({ id: operador.operador_id, email: operador.email, rol: operador.rol }, secretKey, { expiresIn: '12h' });
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
        const userAgent = req.headers['user-agent'] || null;
        try {
            await database_1.default.query(`INSERT INTO operador_login (operador_id, ip_origen, user_agent) VALUES (?, ?, ?)`, [operador.operador_id, ip, userAgent]);
        }
        catch (e) {
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
    }
    catch (error) {
        console.error('Error durante el proceso de login:', error);
        res.status(500).json({ error: 'Ha ocurrido un error en el servidor. Por favor, intente más tarde.' });
    }
};
exports.login = login;
//# sourceMappingURL=authController.js.map