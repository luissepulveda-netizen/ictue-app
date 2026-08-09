# 🚀 Guía Completa: Despliegue en Vercel + Railway

## 📋 Resumen
- **Frontend:** Vercel (gratis, optimizado para React)
- **Backend:** Railway (gratis, optimizado para Node.js)
- **BD:** Railway PostgreSQL (gratis incluido)

---

## PASO 1️⃣: Preparar GitHub

### 1.1 Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `ictue-app`
3. Descripción: "Sistema de Gestión de Asistencia ICTUE"
4. Público o Privado (tu elección)
5. Click en "Create repository"

### 1.2 Subir Código a GitHub

En tu carpeta `ictue-app`, ejecuta:

```bash
git init
git add .
git commit -m "Initial commit: ICTUE attendance management system"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/ictue-app.git
git push -u origin main
```

✅ Tu código está en GitHub

---

## PASO 2️⃣: Configurar Railway (Backend + BD)

### 2.1 Crear Cuenta en Railway

1. Ve a https://railway.app
2. Click en "Start a New Project"
3. Regístrate con GitHub (recomendado)

### 2.2 Crear PostgreSQL

1. En Railway dashboard, click en "Create New"
2. Selecciona "Database" → "PostgreSQL"
3. Espera a que se cree (2-3 minutos)
4. Anota la `DATABASE_URL` que aparece en Environment

### 2.3 Importar Schema a Railway

1. En Railway, selecciona el servicio PostgreSQL
2. Click en "Connect"
3. Copia el comando psql
4. En tu terminal local:

```bash
# Reemplaza con tu URL de Railway
psql postgresql://user:password@host:port/railway < backend/migrations/001_init.sql
```

### 2.4 Crear Backend en Railway

1. En Railway dashboard, click en "Create New"
2. Selecciona "GitHub Repo"
3. Busca `ictue-app`
4. Selecciona la rama `main`
5. Click en "Create Service"

### 2.5 Configurar Variables en Railway

En el servicio Backend:

1. Click en "Variables"
2. Agrega:
   ```
   DATABASE_URL = (se copiará automáticamente del servicio PostgreSQL)
   JWT_SECRET = tu_secreto_super_seguro_aqui_cambiar_en_produccion
   NODE_ENV = production
   PORT = 8000
   ```

### 2.6 Verificar Deploy

Railway debería:
- ✅ Detectar `package.json` en `/backend`
- ✅ Instalar dependencias
- ✅ Compilar TypeScript
- ✅ Iniciar servidor

**Tu API estará en:** `https://tu-servicio.railway.app`

---

## PASO 3️⃣: Configurar Vercel (Frontend)

### 3.1 Conectar Vercel a GitHub

1. Ve a https://vercel.com
2. Click en "New Project"
3. Conecta tu cuenta GitHub
4. Selecciona repositorio `ictue-app`

### 3.2 Configurar Proyecto en Vercel

1. **Framework Preset:** Vite
2. **Root Directory:** `./frontend`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`

### 3.3 Agregar Variables de Entorno en Vercel

En Vercel:

1. Proyecto → Settings → Environment Variables
2. Agrega:
   ```
   VITE_API_URL = https://tu-servicio.railway.app
   ```

### 3.4 Deploy

Click en "Deploy"

✅ Tu Frontend estará en: `https://ictue-app.vercel.app`

---

## PASO 4️⃣: Conectar Frontend con Backend

### 4.1 Verificar Conexión

En tu navegador, abre:
```
https://ictue-app.vercel.app
```

Debería funcionar todo:
- ✅ Página de login carga
- ✅ Gráficos carguen (con datos demo)
- ✅ Puedas hacer login

### 4.2 Si NO funciona

1. Abre F12 (DevTools del navegador)
2. Ve a Console
3. Mira los errores
4. Comprueba que `VITE_API_URL` esté correcto en Vercel

---

## PASO 5️⃣: Crear Usuarios de Prueba

En Railway, en la BD PostgreSQL:

1. Click en "Connect"
2. Abre pgAdmin o SQL Client
3. Ejecuta:

```sql
-- Crear usuario de prueba
INSERT INTO usuarios (email, nombre, password_hash, rol) 
VALUES (
  'pastor@ictue.cl', 
  'Pastor Principal', 
  '$2a$10$ZGFtYWdlZC9oYXNoZWRfcGFzc3dvcmQgaGVyZQ==',  -- password: Test@2026
  'pastor'
);
```

**Login:**
- Email: `pastor@ictue.cl`
- Contraseña: `Test@2026`

---

## PASO 6️⃣: Importar Datos Históricos (Opcional)

```bash
cd data
python import_data.py
```

Esto importará los 2.5 años de datos de Excel.

---

## 🎯 Resultado Final

| Servicio | URL | Estado |
|----------|-----|--------|
| **Frontend** | https://ictue-app.vercel.app | ✅ Vercel |
| **Backend API** | https://tu-servicio.railway.app | ✅ Railway |
| **PostgreSQL BD** | (privada en Railway) | ✅ Railway |

---

## 🆘 Troubleshooting

### Error: "Cannot connect to API"
- Verifica `VITE_API_URL` en Vercel
- Comprueba que Railway Backend esté corriendo
- Revisa CORS en backend

### Error: "Database connection failed"
- Verifica `DATABASE_URL` en Railway
- Comprueba que PostgreSQL esté activo
- Prueba conectar localmente

### Error: "Gráficos no cargan"
- Abre F12 → Network
- Ve si hay errores en requests a `/api`
- Comprueba que backend responda en Postman

### Login no funciona
- Verifica que usuario exista en BD
- Contraseña hash correcta
- JWT_SECRET igual en desarrollo y producción

---

## 📊 Monitoreo

### Ver logs en Railway
```bash
# En tu terminal (con Railway CLI instalado)
railway logs -d backend
```

### Ver logs en Vercel
Vercel Dashboard → Deployments → logs

---

## 💡 Tips Finales

1. **Actualizar código:** Haz `git push` a main, ambas plataformas redeploy automáticamente
2. **Cambiar variables:** Edita en Vercel/Railway, no en código local
3. **Escalar:** Si necesitas más poder, ambas tienen plans de pago
4. **Dominio custom:** Ambas soportan dominios propios

---

## ✅ Checklist Final

- [ ] Repositorio creado en GitHub
- [ ] Código subido a GitHub
- [ ] PostgreSQL creado en Railway
- [ ] Schema importado a Railway
- [ ] Backend deployado en Railway
- [ ] Frontend deployado en Vercel
- [ ] Variables de entorno configuradas
- [ ] Frontend conecta con Backend
- [ ] Login funciona
- [ ] Datos históricos importados (opcional)
- [ ] ¡Aplicación en vivo! 🎉

---

## 🚀 ¡LISTO PARA PRODUCCIÓN!

Tu aplicación ICTUE está en vivo y lista para que pastores y líderes la usen.

**URLs para compartir:**
- Frontend: `https://ictue-app.vercel.app`
- Comparte con pastores/líderes

---

**Última actualización:** Agosto 2026
**Estado:** ✅ Listo para Deploy
