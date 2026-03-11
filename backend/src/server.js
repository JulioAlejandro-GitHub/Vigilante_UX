"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cameraRoutes_1 = __importDefault(require("./routes/cameraRoutes"));
const dashboardRoutes_1 = __importDefault(require("./routes/dashboardRoutes"));
const personaRoutes_1 = __importDefault(require("./routes/personaRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8085;
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/cameras', cameraRoutes_1.default);
app.use('/api/dashboard', dashboardRoutes_1.default);
app.use('/api/personas', personaRoutes_1.default);
app.use('/api/events', eventRoutes_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ha ocurrido un error en el servidor.' });
});
app.listen(PORT, () => {
    console.log(`Backend de Vigilante ejecutándose en el puerto ${PORT}`);
});
//# sourceMappingURL=server.js.map