import express, { Request, Response } from 'express';
import { query } from '../database';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/semanal', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tipo = req.query.tipo || 'Culto';

    const result = await query(
      `SELECT
        rp.dia_semana,
        rp.hora,
        COUNT(*) as cantidad_registros,
        ROUND(AVG(a.num_asistentes)) as promedio,
        MAX(a.num_asistentes) as maximo,
        MIN(a.num_asistentes) as minimo
      FROM asistencia a
      JOIN reuniones_planeadas rp ON a.reunion_id = rp.id
      WHERE rp.tipo_reunion = $1
        AND a.fecha >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY rp.dia_semana, rp.hora, rp.id
      ORDER BY rp.id`,
      [tipo]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error en estadísticas semanales:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/mensual', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tipo = req.query.tipo || 'Culto';
    const month = req.query.month || new Date().toISOString().substring(0, 7);

    const result = await query(
      `SELECT
        DATE_TRUNC('day', a.fecha) as fecha,
        rp.tipo_reunion,
        ROUND(AVG(a.num_asistentes)) as promedio,
        SUM(a.num_asistentes) as total
      FROM asistencia a
      JOIN reuniones_planeadas rp ON a.reunion_id = rp.id
      WHERE rp.tipo_reunion = $1
        AND TO_CHAR(a.fecha, 'YYYY-MM') = $2
      GROUP BY DATE_TRUNC('day', a.fecha), rp.tipo_reunion
      ORDER BY a.fecha`,
      [tipo, month]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error en estadísticas mensuales:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.get('/anual', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tipo = req.query.tipo || 'Culto';

    const result = await query(
      `SELECT
        EXTRACT(YEAR FROM a.fecha) as año,
        EXTRACT(MONTH FROM a.fecha) as mes,
        ROUND(AVG(a.num_asistentes)) as promedio,
        COUNT(*) as cantidad_registros
      FROM asistencia a
      JOIN reuniones_planeadas rp ON a.reunion_id = rp.id
      WHERE rp.tipo_reunion = $1
      GROUP BY EXTRACT(YEAR FROM a.fecha), EXTRACT(MONTH FROM a.fecha)
      ORDER BY año, mes`,
      [tipo]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error en estadísticas anuales:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
