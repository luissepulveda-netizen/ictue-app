import express, { Request, Response } from 'express';
import { query } from '../database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { reunion_id, fecha, num_asistentes, expositor, observaciones } = req.body;
    const usuario_id = (req as any).user.id;

    if (!reunion_id || !fecha || typeof num_asistentes !== 'number') {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const result = await query(
      `INSERT INTO asistencia (reunion_id, fecha, num_asistentes, expositor, observaciones, registrado_por)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [reunion_id, fecha, num_asistentes, expositor || null, observaciones || null, usuario_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registrando asistencia:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/reuniones', authenticateToken, async (req: Request, res: Response) => {
  try {
    const result = await query(
      `SELECT * FROM reuniones_planeadas ORDER BY
       CASE WHEN dia_semana = 'MAR' THEN 1
            WHEN dia_semana = 'JUE' THEN 2
            WHEN dia_semana = 'DOM' THEN 3 END, hora`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo reuniones:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
