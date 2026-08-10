"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryAsync = queryAsync;
exports.runAsync = runAsync;
const sqlite3_1 = __importDefault(require("sqlite3"));
const pg_1 = require("pg");
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const USE_POSTGRES = process.env.DATABASE_URL ? true : false;
let db;
let pgPool;
if (USE_POSTGRES) {
    pgPool = new pg_1.Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    pgPool.on('error', (err) => {
        console.error('PostgreSQL error:', err);
    });
    console.log('✓ Usando PostgreSQL');
    initializePostgres();
}
else {
    const dbPath = path_1.default.join(__dirname, '../../ictue.db');
    db = new sqlite3_1.default.Database(dbPath, (err) => {
        if (err) {
            console.error('Error abriendo BD:', err);
        }
        else {
            console.log('✓ Conectado a SQLite');
            initializeSqlite();
        }
    });
}
function initializeSqlite() {
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
async function initializePostgres() {
    try {
        await pgPool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        rol VARCHAR(50) DEFAULT 'lider',
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
        await pgPool.query(`
      CREATE TABLE IF NOT EXISTS reuniones_planeadas (
        id SERIAL PRIMARY KEY,
        dia_semana VARCHAR(3) NOT NULL,
        hora VARCHAR(5) NOT NULL,
        tipo_reunion VARCHAR(50) NOT NULL,
        seccion INTEGER DEFAULT 1,
        descripcion VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
        await pgPool.query(`
      CREATE TABLE IF NOT EXISTS asistencia (
        id SERIAL PRIMARY KEY,
        reunion_id INTEGER REFERENCES reuniones_planeadas(id),
        fecha DATE NOT NULL,
        num_asistentes INTEGER NOT NULL,
        expositor VARCHAR(255),
        observaciones TEXT,
        registrado_por INTEGER REFERENCES usuarios(id),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
        // Seed reuniones
        const existingReuniones = await pgPool.query('SELECT COUNT(*) FROM reuniones_planeadas');
        if (existingReuniones.rows[0].count === '0') {
            const reuniones = [
                ['MAR', '19:30', 'Culto', 'Culto del Martes'],
                ['JUE', '19:30', 'Culto', 'Culto del Jueves'],
                ['DOM', '11:00', 'Culto', 'Culto Domingo Mañana'],
                ['DOM', '18:30', 'Culto', 'Culto Domingo Tarde'],
                ['DOM', '11:00', 'UNT Kids', 'UNT Kids Domingo Mañana'],
                ['DOM', '18:30', 'UNT Kids', 'UNT Kids Domingo Tarde'],
                ['DOM', '11:00', 'UNT Teens', 'UNT Teens Domingo Mañana'],
                ['DOM', '18:30', 'UNT Teens', 'UNT Teens Domingo Tarde']
            ];
            for (const [dia, hora, tipo, desc] of reuniones) {
                await pgPool.query('INSERT INTO reuniones_planeadas (dia_semana, hora, tipo_reunion, descripcion) VALUES ($1, $2, $3, $4)', [dia, hora, tipo, desc]);
            }
        }
        // Seed usuario de prueba
        const existingUsers = await pgPool.query('SELECT COUNT(*) FROM usuarios');
        if (existingUsers.rows[0].count === '0') {
            const passwordHash = bcryptjs_1.default.hashSync('Test@2026', 10);
            await pgPool.query('INSERT INTO usuarios (email, nombre, rol, password_hash) VALUES ($1, $2, $3, $4)', ['pastor@ictue.cl', 'Pastor Luis', 'pastor', passwordHash]);
            console.log('✓ Usuario de prueba creado: pastor@ictue.cl / Test@2026');
        }
    }
    catch (err) {
        console.error('Error inicializando PostgreSQL:', err);
    }
}
function queryAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        if (USE_POSTGRES) {
            // Convertir ? a $1, $2, etc para PostgreSQL
            let pgSql = sql;
            let paramIndex = 1;
            pgSql = pgSql.replace(/\?/g, () => `$${paramIndex++}`);
            pgPool.query(pgSql, params, (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result.rows);
            });
        }
        else {
            db.all(sql, params, (err, rows) => {
                if (err)
                    reject(err);
                else
                    resolve(rows || []);
            });
        }
    });
}
function runAsync(sql, params = []) {
    return new Promise((resolve, reject) => {
        if (USE_POSTGRES) {
            // Convertir ? a $1, $2, etc para PostgreSQL
            let pgSql = sql;
            let paramIndex = 1;
            pgSql = pgSql.replace(/\?/g, () => `$${paramIndex++}`);
            // Agregar RETURNING id para obtener el ID insertado
            if (pgSql.trim().toUpperCase().startsWith('INSERT')) {
                pgSql += ' RETURNING id';
            }
            pgPool.query(pgSql, params, (err, result) => {
                if (err)
                    reject(err);
                else {
                    const id = result.rows[0]?.id || result.rows[0]?.lastval;
                    resolve({ id, changes: result.rowCount });
                }
            });
        }
        else {
            db.run(sql, params, function (err) {
                if (err)
                    reject(err);
                else
                    resolve({ id: this.lastID, changes: this.changes });
            });
        }
    });
}
//# sourceMappingURL=database.js.map