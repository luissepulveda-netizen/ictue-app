import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../ictue.db');

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error abriendo BD:', err);
  } else {
    console.log('✓ Conectado a SQLite');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        nombre TEXT NOT NULL,
        rol TEXT DEFAULT 'lider',
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS reuniones_planeadas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        dia_semana TEXT NOT NULL,
        hora TEXT NOT NULL,
        tipo_reunion TEXT NOT NULL,
        seccion INTEGER DEFAULT 1,
        descripcion TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS asistencia (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reunion_id INTEGER,
        fecha DATE NOT NULL,
        num_asistentes INTEGER NOT NULL,
        expositor TEXT,
        observaciones TEXT,
        registrado_por INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(reunion_id) REFERENCES reuniones_planeadas(id)
      )
    `);

    db.run(`
      INSERT OR IGNORE INTO reuniones_planeadas (dia_semana, hora, tipo_reunion, descripcion)
      VALUES
        ('MAR', '19:30', 'Culto', 'Culto del Martes'),
        ('JUE', '19:30', 'Culto', 'Culto del Jueves'),
        ('DOM', '11:00', 'Culto', 'Culto Domingo Mañana'),
        ('DOM', '18:30', 'Culto', 'Culto Domingo Tarde'),
        ('DOM', '11:00', 'UNT Kids', 'UNT Kids Domingo Mañana'),
        ('DOM', '18:30', 'UNT Kids', 'UNT Kids Domingo Tarde'),
        ('DOM', '11:00', 'UNT Teens', 'UNT Teens Domingo Mañana'),
        ('DOM', '18:30', 'UNT Teens', 'UNT Teens Domingo Tarde')
    `);
  });
}

export function queryAsync(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

export function runAsync(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}
