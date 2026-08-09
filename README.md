# 🏰 Sistema de Gestión de Asistencia ICTUE

**Iglesia Cristo Tu Única Esperanza** - Aplicación web para registrar y visualizar estadísticas de asistencia a reuniones.

---

## 📋 Características

✅ **Registro rápido de asistencia** - 2 clics para registrar  
✅ **Gráficos hermosos** - Estadísticas en tiempo real (semanal, mensual, anual)  
✅ **Diseño responsivo** - Funciona perfecto en mobile, tablet y computadora  
✅ **Acceso seguro** - Login para pastores y líderes  
✅ **Datos históricos** - Integración de 2.5 años de datos (agosto 2023 - junio 2026)  
✅ **Identidad visual** - Colores rojo y gris que representan a ICTUE  

---

## 🚀 Instalación y Setup

### Requisitos Previos
- **Node.js** (v16 o superior) - [Descargar](https://nodejs.org)
- **PostgreSQL** (v12 o superior) - [Descargar](https://www.postgresql.org/download/)

### Paso 1: Clonar o Descargar el Proyecto
```bash
cd "C:\Users\luiss\OneDrive\Documentos\Alaya\IA-Automatización\ICTUE\ictue-app"
```

### Paso 2: Configurar la Base de Datos

1. **Crear base de datos PostgreSQL:**
```bash
createdb ictue_db
```

2. **Ejecutar migraciones (schema):**
```bash
psql -U postgres -d ictue_db -f backend/migrations/001_init.sql
```

3. **Crear usuarios de prueba (opcional):**
```sql
INSERT INTO usuarios (email, nombre, password_hash, rol) VALUES
('pastor1@ictue.cl', 'Pastor 1', '$2a$10$...', 'pastor'),
('lider1@ictue.cl', 'Líder 1', '$2a$10$...', 'lider');
```

> **Nota:** Las contraseñas deben ser hasheadas con bcrypt. Usa herramientas como [bcrypt.online](https://bcrypt.online) para generar hashes.

### Paso 3: Instalar Backend

```bash
cd backend
npm install
cp .env.example .env
```

**Edita `.env` con tus credenciales:**
```
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/ictue_db
JWT_SECRET=tu_secreto_super_seguro_aqui
PORT=5000
NODE_ENV=development
```

### Paso 4: Instalar Frontend

```bash
cd frontend
npm install
```

### Paso 5: Iniciar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Debería mostrar: ✓ Servidor ICTUE corriendo en puerto 5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Debería mostrar: ✓ Local:   http://localhost:3000
```

### Paso 6: Acceder a la Aplicación

Abre en tu navegador: **http://localhost:3000**

Credenciales de prueba:
- **Email:** pastor1@ictue.cl
- **Contraseña:** (la que hayas creado en la BD)

---

## 📊 Importar Datos Históricos

Para integrar los 2.5 años de datos existentes:

1. **Preparar archivo CSV** (convertir Excel a CSV):
   - Abre `Conteo ICTUE 2026-01.xlsx`
   - Exporta como CSV

2. **Ejecutar script de importación:**
```bash
# Crear el script import_data.py en la carpeta data/
python data/import_data.py
```

---

## 🏗️ Estructura del Proyecto

```
ictue-app/
├── backend/                    # API Node.js + Express
│   ├── src/
│   │   ├── server.ts          # Servidor principal
│   │   ├── database.ts        # Conexión a PostgreSQL
│   │   ├── routes/            # Endpoints API
│   │   │   ├── auth.ts        # Login/Registro
│   │   │   ├── asistencia.ts  # Registro de asistencia
│   │   │   └── estadisticas.ts# Gráficos y datos
│   │   └── middleware/        # Autenticación JWT
│   ├── migrations/
│   │   └── 001_init.sql       # Schema de BD
│   └── package.json
│
├── frontend/                   # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── components/
│   │   │   ├── NavBar.tsx
│   │   │   ├── RegistroAsistencia.tsx
│   │   │   ├── GraficoSemanal.tsx
│   │   │   ├── GraficoMensual.tsx
│   │   │   └── GraficoAnual.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── data/
│   └── datos_historicos_ICTUE.csv
│
└── README.md
```

---

## 🔐 Seguridad

- **JWT Tokens:** Almacenados en localStorage (seguro para este contexto)
- **Contraseñas:** Hasheadas con bcrypt
- **CORS:** Configurado para desarrollo local
- **Variables de entorno:** Protegidas en `.env` (no subir a git)

---

## 🌐 Despliegue (Deploy)

### Frontend - Vercel (Gratuito)
```bash
npm install -g vercel
cd frontend
vercel
```

### Backend - Railway o Render (Gratuito)
1. Crear cuenta en [Railway.app](https://railway.app) o [Render.com](https://render.com)
2. Conectar repositorio GitHub
3. Configurar variables de entorno
4. Deploy automático

---

## 📱 Especificaciones de Color (ICTUE)

```
Rojo Principal:    #C41E3A
Rojo Oscuro:       #A01830
Rojo Claro:        #EF4444
Gris Oscuro:       #374151
Gris Claro:        #F3F4F6
Gris Medio:        #9CA3AF
```

---

## 🛠️ Tecnologías Usadas

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + TypeScript | 18.2 |
| Estilos | Tailwind CSS | 3.3 |
| Gráficos | Recharts | 2.10 |
| Backend | Node.js + Express | 18 / 4.18 |
| BD | PostgreSQL | 12+ |
| Autenticación | JWT + bcrypt | - |
| Build | Vite | 4.4 |

---

## 📞 Soporte y Contacto

Para preguntas o problemas:
- **Email:** lsepulveda@alaya.cl
- **Empresa:** Alaya Digital Solutions

---

## 📄 Licencia

MIT License - Desarrollo para Iglesia Cristo Tu Única Esperanza

---

**Última actualización:** Agosto 2026  
**Estado:** ✅ Listo para instalación local
