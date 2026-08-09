import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../database';

const router = express.Router();

interface LoginBody {
  email: string;
  password: string;
}

router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const result = await query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = result.rows[0];
    const passwordValid = await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );

    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, nombre, password, rol } = req.body;

    if (!email || !nombre || !password) {
      return res.status(400).json({ error: 'Datos incompletos' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      'INSERT INTO usuarios (email, nombre, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, email, nombre',
      [email, nombre, passwordHash, rol || 'lider']
    );

    res.status(201).json({ usuario: result.rows[0] });
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
