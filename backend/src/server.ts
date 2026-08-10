import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import { queryAsync, runAsync } from './database';
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

// Endpoint temporal para crear usuario de prueba
app.post('/api/setup/create-user', async (req, res) => {
  try {
    const email = 'pastor@ictue.cl';
    const passwordHash = bcryptjs.hashSync('Test@2026', 10);

    const existing = await queryAsync('SELECT id FROM usuarios WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.json({ message: 'Usuario ya existe' });
    }

    await runAsync(
      'INSERT INTO usuarios (email, nombre, rol, password_hash) VALUES (?, ?, ?, ?)',
      [email, 'Pastor Luis', 'pastor', passwordHash]
    );

    res.json({ message: 'Usuario creado exitosamente', email });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✓ Servidor ICTUE corriendo en puerto ${PORT}`);
});
