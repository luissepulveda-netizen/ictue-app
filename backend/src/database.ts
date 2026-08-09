import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Error inesperado en pool de conexiones:', err);
});

export async function initializeDatabase(): Promise<void> {
  try {
    const client = await pool.connect();
    console.log('✓ Conectado a la base de datos');
    client.release();
  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
    throw error;
  }
}

export function getPool() {
  return pool;
}

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}
