import express, { Request, Response } from 'express';
import { queryAsync } from '../database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/semanal', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tipo = req.query.tipo || 'Culto';

    const result = await queryAsync(
      `SELECT
        rp.dia_semana,
        rp.hora,
        COUNT(*) as cantidad_registros,
        ROUND(AVG(a.num_asistentes)) as promedio,
        MAX(a.num_asistentes) as maximo,
        MIN(a.num_asistentes) as minimo
      FROM asistencia a
      JOIN reuniones_planeadas rp ON a.reunion_id = rp.id
      WHERE rp.tipo_reunion = ?
        AND a.fecha >= date('now', '-7 days')
      GROUP BY rp.dia_semana, rp.hora, rp.id
      ORDER BY rp.id`,
      [tipo]
    );

    res.json(result);
  } catch (error) {
    console.error('Error en estadísticas semanales:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/mensual', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tipo = req.query.tipo || 'Culto';
    const month = req.query.month || new Date().toISOString().substring(0, 7);

    const result = await queryAsync(
      `SELECT
        a.fecha,
        rp.tipo_reunion,
        ROUND(AVG(a.num_asistentes)) as promedio,
        SUM(a.num_asistentes) as total
      FROM asistencia a
      JOIN reuniones_planeadas rp ON a.reunion_id = rp.id
      WHERE rp.tipo_reunion = ?
        AND strftime('%Y-%m', a.fecha) = ?
      GROUP BY a.fecha, rp.tipo_reunion
      ORDER BY a.fecha`,
      [tipo, month]
    );

    res.json(result);
  } catch (error) {
    console.error('Error en estadísticas mensuales:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/anual', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tipo = req.query.tipo || 'Culto';

    const result = await queryAsync(
      `SELECT
        strftime('%Y', a.fecha) as año,
        strftime('%m', a.fecha) as mes,
        ROUND(AVG(a.num_asistentes)) as promedio,
        COUNT(*) as cantidad_registros
      FROM asistencia a
      JOIN reuniones_planeadas rp ON a.reunion_id = rp.id
      WHERE rp.tipo_reunion = ?
      GROUP BY strftime('%Y', a.fecha), strftime('%m', a.fecha)
      ORDER BY año, mes`,
      [tipo]
    );

    res.json(result);
  } catch (error) {
    console.error('Error en estadísticas anuales:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
