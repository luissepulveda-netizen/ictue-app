-- Crear extensión UUID si es necesario
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios (Pastores y Líderes)
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  rol VARCHAR(50) DEFAULT 'lider',
  password_hash VARCHAR(255) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de reuniones planeadas
CREATE TABLE IF NOT EXISTS reuniones_planeadas (
  id SERIAL PRIMARY KEY,
  dia_semana VARCHAR(3) NOT NULL,
  hora TIME NOT NULL,
  tipo_reunion VARCHAR(50) NOT NULL,
  seccion INT DEFAULT 1,
  descripcion VARCHAR(255),
  activa BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de asistencia (el core del sistema)
CREATE TABLE IF NOT EXISTS asistencia (
  id SERIAL PRIMARY KEY,
  reunion_id INT REFERENCES reuniones_planeadas(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  num_asistentes INT NOT NULL,
  expositor VARCHAR(255),
  observaciones TEXT,
  registrado_por INT REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_asistencia_fecha ON asistencia(fecha);
CREATE INDEX IF NOT EXISTS idx_asistencia_reunion ON asistencia(reunion_id);
CREATE INDEX IF NOT EXISTS idx_asistencia_created ON asistencia(created_at);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_reuniones_dia ON reuniones_planeadas(dia_semana);

-- Insertar reuniones planeadas
INSERT INTO reuniones_planeadas (dia_semana, hora, tipo_reunion, seccion, descripcion)
VALUES
  ('MAR', '19:30:00', 'Culto', 1, 'Culto del Martes'),
  ('JUE', '19:30:00', 'Culto', 1, 'Culto del Jueves'),
  ('DOM', '11:00:00', 'Culto', 1, 'Culto Domingo Mañana - Sección 1'),
  ('DOM', '18:30:00', 'Culto', 2, 'Culto Domingo Tarde - Sección 2'),
  ('DOM', '11:00:00', 'UNT Kids', 1, 'UNT Kids Domingo Mañana'),
  ('DOM', '18:30:00', 'UNT Kids', 2, 'UNT Kids Domingo Tarde'),
  ('DOM', '11:00:00', 'UNT Teens', 1, 'UNT Teens Domingo Mañana'),
  ('DOM', '18:30:00', 'UNT Teens', 2, 'UNT Teens Domingo Tarde')
ON CONFLICT DO NOTHING;
