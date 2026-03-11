"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEventSubject = exports.getEvents = void 0;
const database_1 = __importDefault(require("../config/database"));
const getEvents = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const search = req.query.search;
        const type = req.query.type;
        let whereClauses = [];
        let queryParams = [];
        if (search) {
            whereClauses.push('(p.nombre LIKE ? OR c.nombre LIKE ?)');
            queryParams.push(`%${search}%`, `%${search}%`);
        }
        if (type && type !== 'all') {
            whereClauses.push('rf.final_label = ?');
            queryParams.push(type);
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
        const [countRows] = await database_1.default.query(countQuery, queryParams);
        const total = countRows[0]?.total || 0;
        const dataQuery = `
      SELECT
        rf.recognition_face_id as id,
        re.occurred_at as timestamp,
        c.nombre as camera,
        rf.final_label as userType,
        rf.best_similarity as confidence,
        rf.face_img as thumbnail,
        re.frame_img as fullImage,
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
        const [rows] = await database_1.default.query(dataQuery, queryParams);
        res.json({
            data: rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Error fetching events' });
    }
};
exports.getEvents = getEvents;
const updateEventSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const { assigned_persona_id, final_label } = req.body;
        if (!assigned_persona_id) {
            return res.status(400).json({ error: 'assigned_persona_id is required' });
        }
        const [result] = await database_1.default.query('UPDATE recognition_face SET assigned_persona_id = ?, final_label = ?, assigned_status = ? WHERE recognition_face_id = ?', [assigned_persona_id, final_label || 'identificado', 'manual_asignado', id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error updating event subject:', error);
        res.status(500).json({ error: 'Error updating event subject' });
    }
};
exports.updateEventSubject = updateEventSubject;
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await database_1.default.query('DELETE FROM recognition_face WHERE recognition_face_id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Evento no encontrado' });
        }
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Error deleting event' });
    }
};
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=eventController.js.map