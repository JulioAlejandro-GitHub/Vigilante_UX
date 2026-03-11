import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import cameraRoutes from './routes/cameraRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import personaRoutes from './routes/personaRoutes';
import eventRoutes from './routes/eventRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8085;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/cameras', cameraRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/personas', personaRoutes);
app.use('/api/events', eventRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ha ocurrido un error en el servidor.' });
});

app.listen(PORT, () => {
  console.log(`Backend de Vigilante ejecutándose en el puerto ${PORT}`);
});
