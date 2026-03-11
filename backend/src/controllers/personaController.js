"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonas = void 0;
const database_1 = __importDefault(require("../config/database"));
const getPersonas = async (req, res) => {
    try {
        const query = `
      SELECT
        persona_id as id,
        nombre as name,
        tipo as userType,
        img_referencia as thumbnail
      FROM persona
      WHERE estado = 'activo'
      ORDER BY nombre ASC
    `;
        const [rows] = await database_1.default.query(query);
        res.json(rows);
    }
    catch (error) {
        console.error('Error fetching personas:', error);
        res.status(500).json({ error: 'Error fetching personas' });
    }
};
exports.getPersonas = getPersonas;
//# sourceMappingURL=personaController.js.map