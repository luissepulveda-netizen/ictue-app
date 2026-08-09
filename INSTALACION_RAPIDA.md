# ⚡ Guía Rápida de Instalación

## Paso 1: Instalar Node.js
Descarga de https://nodejs.org (versión LTS)

## Paso 2: Instalar PostgreSQL
Descarga de https://www.postgresql.org/download/

## Paso 3: Crear Base de Datos
```bash
# Abre SQL Shell (psql) o pgAdmin

# Ejecuta:
CREATE DATABASE ictue_db;
```

## Paso 4: Crear Schema
```bash
# En la carpeta backend/migrations, ejecuta:
psql -U postgres -d ictue_db -f 001_init.sql
```

## Paso 5: Configurar Backend
```bash
cd backend
npm install
cp .env.example .env

# EDITA .env con tus valores:
# DATABASE_URL=postgresql://postgres:TuContraseña@localhost:5432/ictue_db
# JWT_SECRET=tu_secreto_aleatorio_aqui
```

## Paso 6: Configurar Frontend
```bash
cd frontend
npm install
```

## Paso 7: Iniciar Servidor Backend
```bash
# Abre Terminal 1 en la carpeta backend
npm run dev

# Deberías ver: ✓ Servidor ICTUE corriendo en puerto 5000
```

## Paso 8: Iniciar Servidor Frontend
```bash
# Abre Terminal 2 en la carpeta frontend
npm run dev

# Deberías ver: ✓ Local:   http://localhost:3000
```

## Paso 9: Acceder a la App
Abre http://localhost:3000 en tu navegador

---

## 🔑 Crear Usuario de Prueba

Ejecuta esto en PostgreSQL:

```sql
-- Crear usuario de prueba
-- Password: "Test@2026" (cambiar después)
-- Hash generado con bcrypt

INSERT INTO usuarios (email, nombre, password_hash, rol) 
VALUES ('pastor@ictue.cl', 'Pastor Principal', '$2a$10$ZGFtYWdlZC9oYXNoZXMuYmNyeXB0QCQyYSQxMCRhd2lyZWFsdw==', 'pastor');

-- Login:
-- Email: pastor@ictue.cl
-- Contraseña: Test@2026
```

---

## 🆘 Problemas Comunes

### "npm: comando no encontrado"
- Node.js no está instalado correctamente
- Reinicia tu terminal después de instalar

### "Error de conexión a BD"
- Verifica que PostgreSQL esté corriendo
- Revisa DATABASE_URL en .env
- Usuario/contraseña correctos?

### Gráficos no se muestran
- Verifica que el backend esté corriendo en puerto 5000
- Revisa la consola del navegador (F12) para errores

---

## 📊 Importar Datos Históricos (Opcional)

```bash
cd data
python import_data.py
```

---

## ✅ Checklist Final

- [ ] Node.js instalado
- [ ] PostgreSQL instalado y corriendo
- [ ] BD "ictue_db" creada
- [ ] Schema importado (001_init.sql)
- [ ] Backend npm install y .env configurado
- [ ] Frontend npm install
- [ ] Backend corriendo (terminal 1)
- [ ] Frontend corriendo (terminal 2)
- [ ] Puedo acceder a http://localhost:3000

¡Si todo está ✅ puedes empezar a usar la aplicación!
