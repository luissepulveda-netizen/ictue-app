import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './database';
import authRoutes from './routes/auth';
import asistenciaRoutes from './routes/asistencia';
import estadisticasRoutes from './routes/estadisticas';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor ICTUE corriendo en puerto ${PORT}`);
});
