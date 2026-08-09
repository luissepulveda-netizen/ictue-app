# 🚀 PASOS RÁPIDOS PARA DESPLEGAR EN VERCEL + RAILWAY

**Tiempo total: ~20 minutos**

---

## ✅ CHECKLIST PRE-DESPLIEGUE

Antes de empezar, verifica:
- [ ] Tienes Node.js instalado (`node --version`)
- [ ] Tienes Git instalado (`git --version`)
- [ ] Tienes PostgreSQL instalado (local)
- [ ] Tienes cuenta en GitHub
- [ ] Tienes cuenta en Vercel (conectar con GitHub)
- [ ] Tienes cuenta en Railway (conectar con GitHub)

---

## PASO 1: Subir Código a GitHub

### En tu terminal (PowerShell o CMD):

```bash
cd "C:\Users\luiss\OneDrive\Documentos\Alaya\IA-Automatización\ICTUE\ictue-app"

# Inicializar Git (si aún no lo has hecho)
git init
git add .
git commit -m "Initial ICTUE deployment"
git branch -M main

# Agregar remote (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/ictue-app.git
git push -u origin main
```

✅ **Resultado:** Tu código está en GitHub

---

## PASO 2: Configurar PostgreSQL Localmente

```bash
# Crear base de datos
createdb ictue_db

# Importar schema
psql -U postgres -d ictue_db -f backend/migrations/001_init.sql

# Crear usuario de prueba
cd data
python create_user.py
# Selecciona:
# - Email: pastor@ictue.cl
# - Nombre: Pastor Principal
# - Contraseña: Test@2026
# - Rol: 1 (Pastor)
```

✅ **Resultado:** BD lista con datos de prueba

---

## PASO 3: Railway - Crear Servidor

### 3.1 Ir a https://railway.app

### 3.2 Crear PostgreSQL
```
1. New Project
2. Database → PostgreSQL
3. Espera a que se cree
```

### 3.3 Importar Schema a Railway
```bash
# En tu terminal (con la URL de Railway):
psql postgresql://user:password@host:port/railway < backend/migrations/001_init.sql
```

### 3.4 Crear Backend
```
1. New Project
2. GitHub Repo
3. Busca y selecciona ictue-app
4. Create Service
```

### 3.5 Agregar Variables en Railway
En el servicio Backend, agrega:
```
DATABASE_URL = (se copia del servicio PostgreSQL)
JWT_SECRET = super_secreto_aqui_123456
NODE_ENV = production
```

✅ **Resultado:** Backend corriendo en Railway en `https://ictue-XXXX.railway.app`

---

## PASO 4: Vercel - Crear Frontend

### 4.1 Ir a https://vercel.com

### 4.2 Crear Proyecto
```
1. New Project
2. Import Git Repository
3. Busca ictue-app
4. Selecciona
```

### 4.3 Configurar Proyecto
```
Framework Preset: Vite
Root Directory: ./frontend
Build Command: npm run build
Output Directory: dist
```

### 4.4 Agregar Variable de Entorno
```
VITE_API_URL = https://ictue-XXXX.railway.app
```
(Reemplaza XXXX con tu URL de Railway)

### 4.5 Deploy
```
Click en "Deploy"
```

✅ **Resultado:** Frontend en Vercel en `https://ictue-app.vercel.app`

---

## PASO 5: Verificar Funcionamiento

### 5.1 Abre tu aplicación
```
https://ictue-app.vercel.app
```

### 5.2 Intenta login
```
Email: pastor@ictue.cl
Contraseña: Test@2026
```

### 5.3 Si funciona:
- ✅ Dashboard carga
- ✅ Gráficos se muestran
- ✅ Puedes registrar asistencia
- ✅ Estadísticas funcionan

---

## PASO 6: Importar Datos Históricos (Opcional)

```bash
# Conectarse a Railway BD
psql postgresql://user:pass@host:port/railway

# O usar script Python (después de configurar .env):
cd data
python import_data.py
```

---

## 🎯 URLS FINALES

| Componente | URL |
|-----------|-----|
| **Aplicación** | https://ictue-app.vercel.app |
| **API Backend** | https://ictue-XXXX.railway.app |
| **BD PostgreSQL** | (privada en Railway) |

---

## 🆘 TROUBLESHOOTING

### "Cannot connect to API"
```
Solución:
1. Copia URL correcta de Railway
2. Actualiza VITE_API_URL en Vercel
3. Espera 5 minutos a que Vercel rebuilde
```

### "Login no funciona"
```
Solución:
1. Verifica usuario existe en BD
2. Abre DevTools (F12)
3. Ve a Network y revisa request
```

### "Gráficos en blanco"
```
Solución:
1. Abre Console (F12)
2. Busca errores de API
3. Verifica que backend responda en Postman
```

### "Error 500 en Backend"
```
Solución:
1. Ver logs en Railway
2. Verificar DATABASE_URL
3. Verificar JWT_SECRET
```

---

## 📊 MONITOREO

### Ver logs de Railway
```bash
# Si tienes Railway CLI
railway logs -d backend
```

### Ver logs de Vercel
```
Vercel Dashboard → Deployments → Logs
```

---

## 🔄 Actualizar Código

Después de cualquier cambio:
```bash
git add .
git commit -m "Cambio descripción"
git push origin main
```

Ambas plataformas redeploy automáticamente.

---

## 💡 TIPS

1. **Guardar URLs:** Anota tus URLs de Railway y Vercel en un lugar seguro
2. **Secretos:** Nunca guardes JWT_SECRET o contraseñas en código
3. **Monitoreo:** Revisa logs regularmente para errores
4. **Backups:** Railway hace backups automáticos de la BD

---

## ✅ CHECKLIST FINAL

- [ ] GitHub repo creado y código subido
- [ ] PostgreSQL creado en Railway
- [ ] Backend deployado en Railway
- [ ] Frontend deployado en Vercel
- [ ] VITE_API_URL actualizado en Vercel
- [ ] Login funciona
- [ ] Gráficos se muestran
- [ ] Datos históricos importados (si quieres)
- [ ] URLs compartidas con pastores/líderes

---

## 🎉 ¡LISTO!

Tu aplicación ICTUE está **EN VIVO** y lista para que pastores y líderes registren asistencia.

**Comparte la URL:**
```
https://ictue-app.vercel.app
```

---

**Necesitas ayuda?** Lee `DEPLOYMENT_VERCEL_RAILWAY.md` para más detalles.
