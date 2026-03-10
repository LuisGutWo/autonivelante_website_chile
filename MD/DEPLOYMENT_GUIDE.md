# Guía de Despliegue - Autonivelante Chile

## ⚠️ CAMBIO CRÍTICO: No Más Exportación Estática

**Fecha del cambio**: 6 de Marzo 2026  
**Impacto**: ALTO - Requiere cambios en el método de despliegue

---

## 🔴 Cambio Importante

El proyecto **YA NO puede ser desplegado como sitio estático** (`output: "export"` está deshabilitado).

### Razón del Cambio

Las rutas de API de Stripe requieren rendering dinámico en el servidor:

- `/api/stripe/webhook` - Recibe eventos de Stripe (webhooks)
- `/api/stripe/verify-payment` - Verifica estado de pagos
- `/api/stripe/create-payment-intent` - Crea intenciones de pago

Estas rutas **NO pueden ser pre-renderizadas** como archivos estáticos, necesitan un servidor Node.js activo.

---

## 📋 Opciones de Despliegue en cPanel

### Opción 1: Node.js App (Recomendado)

**Requisitos:**

- cPanel con Node.js Selector
- Node.js v18 o superior
- Acceso SSH

**Pasos:**

1. **Preparar el proyecto localmente**

   ```bash
   npm run build
   npm prune --production
   ```

1. **Subir archivos vía FTP/SFTP:**
   - `.next/` - Build de producción
   - `node_modules/` - Dependencias
   - `public/` - Assets estáticos
   - `package.json`
   - `next.config.mjs`
   - `.env.local` (variables de entorno)

1. **Configurar Node.js App en cPanel:**
   - Application root: `/home/usuario/autonivelante`
   - Application URL: `https://autonivelante.cl`
   - Application startup file: `node_modules/next/dist/bin/next`
   - Arguments: `start -p 3000`
   - Node.js version: 18.x o superior

1. **Variables de entorno necesarias:**

    ```env
    NODE_ENV=production
    NEXT_STRIPE_SECRET_KEY=sk_live_xxx
    NEXT_STRIPE_WEBHOOK_SECRET=whsec_xxx
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
    (todas las demás del archivo .env.local)
    ```

1. **Reiniciar la aplicación** en cPanel Node.js Selector

---

### Opción 2: Despliegue con PM2 (Avanzado)

Si tienes acceso SSH y permisos para instalar PM2:

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar aplicación
pm2 start npm --name "autonivelante" -- start

# Guardar configuración
pm2 save

# Configurar inicio automático
pm2 startup
```

**ecosystem.config.js** (opcional):

```javascript
module.exports = {
  apps: [{
    name: 'autonivelante',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3000',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

---

### Opción 3: Revertir a Exportación Estática (No Recomendado)

Si **NO necesitas pagos con Stripe**, puedes revertir a exportación estática:

**⚠️ Advertencias:**

- ❌ Webhooks de Stripe NO funcionarán
- ❌ Verificación de pagos NO funcionará
- ❌ No podrás procesar pagos en línea

**Cambios necesarios:**

1. **Eliminar rutas API:**

   ```bash
   rm -rf app/api/stripe/
   ```

2. **Habilitar exportación en next.config.mjs:**

   ```javascript
   const nextConfig = {
     output: "export",  // Descomentar
     // ... resto de config
   }
   ```

3. **Remover código de pagos:**
   - Componentes de checkout
   - Integración con Stripe en frontend
   - Referencias a rutas API de Stripe

4. **Build estático:**

   ```bash
   npm run build
   # Subir carpeta 'out/' a public_html via FTP
   ```

---

## 🔧 Configuración de Servidor Web

### Apache (.htaccess)

Crear archivo `.htaccess` en el directorio raíz:

```apache
# Redirigir todo a la aplicación Node.js
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]

# Headers de seguridad
Header set X-Frame-Options "SAMEORIGIN"
Header set X-Content-Type-Options "nosniff"
Header set X-XSS-Protection "1; mode=block"

# SSL/HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Nginx (Si disponible)

```nginx
server {
    listen 80;
    server_name autonivelante.cl www.autonivelante.cl;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache para assets estáticos
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 📦 Variables de Entorno Requeridas

### Críticas (Obligatorias)

```env
# Stripe (Pagos)
NEXT_STRIPE_SECRET_KEY=sk_live_xxx
NEXT_STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx

# Firebase (Base de Datos)
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_DATABASE_URL=xxx

# EmailJS (Notificaciones)
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxx
NEXT_PUBLIC_EMAILJS_SERVICE_ID=xxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=xxx
```

> Nota: Los productos ahora se cargan localmente desde `src/data/products.json`.

### Opcionales

```env
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=xxx
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Contacto
NEXT_PUBLIC_CONTACT_EMAIL=contacto@autonivelante.cl
NEXT_PUBLIC_CONTACT_PHONE=+56971447333
NEXT_PUBLIC_WHATSAPP_NUMBER=56971447333
```

---

## 🚀 Proceso de Despliegue Paso a Paso

### 1. Pre-Despliegue (Local)

```bash
# 1. Actualizar dependencias
npm install

# 2. Verificar que TypeScript compila
npx tsc --noEmit

# 3. Ejecutar tests (si existen)
npm test

# 4. Build de producción
npm run build

# 5. Probar en local
npm start
# Verificar: http://localhost:3000
```

### 2. Preparar Archivos

```bash
# Crear archivo .tar.gz con todo excepto node_modules
tar -czf autonivelante-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.next' \
  .

# O usar rsync si tienes acceso SSH
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ usuario@servidor:/home/usuario/autonivelante/
```

### 3. En el Servidor (cPanel/SSH)

```bash
# 1. Extraer archivos
cd ~/autonivelante
tar -xzf autonivelante-deploy.tar.gz

# 2. Instalar dependencias de producción
npm ci --production

# 3. Build en servidor (si no se hizo localmente)
npm run build

# 4. Configurar variables de entorno
nano .env.local
# (Copiar todas las variables)

# 5. Reiniciar Node.js App desde cPanel
# O con PM2:
pm2 restart autonivelante
```

### 4. Verificación Post-Despliegue

**Checklist:**

- [ ] Sitio carga correctamente (<https://autonivelante.cl>)
- [ ] Assets estáticos se cargan (imágenes, CSS, JS)
- [ ] Productos se cargan desde Firebase
- [ ] Carrito funciona (agregar/eliminar productos)
- [ ] Formulario de contacto envía emails
- [ ] **Webhook de Stripe responde** (verificar en Stripe Dashboard)
- [ ] Pagos de prueba funcionan
- [ ] Certificado SSL activo
- [ ] Redirección HTTP → HTTPS funciona

**Probar Webhook de Stripe:**

```bash
# Enviar test webhook desde CLI de Stripe
stripe trigger payment_intent.succeeded --forward-to https://autonivelante.cl/api/stripe/webhook
```

---

## 🐛 Solución de problemas

### Error: "Cannot find module 'next'"

**Solución:**

```bash
npm install next react react-dom
```

### Error: "Port 3000 already in use"

**Solución:**

```bash
# Encontrar proceso
lsof -i :3000
# O
netstat -tulpn | grep 3000

# Matar proceso
kill -9 <PID>
```

### Error: Webhook de Stripe no funciona

**Diagnóstico:**

1. Verificar que la URL del webhook en Stripe Dashboard sea correcta
2. Verificar `NEXT_STRIPE_WEBHOOK_SECRET` en .env.local
3. Revisar logs: `pm2 logs autonivelante`
4. Probar con Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Error: Variables de entorno no se cargan

**Solución:**

```bash
# Asegurarse que .env.local existe
ls -la .env.local

# Verificar formato (sin espacios extra)
cat .env.local

# Reiniciar servidor después de cambiar variables
pm2 restart autonivelante
```

### Build falla por falta de memoria

**Solución:**

```bash
# Aumentar límite de memoria de Node.js
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## 📊 Monitoreo y Logs

### PM2 Logs

```bash
# Ver logs en tiempo real
pm2 logs autonivelante

# Ver solo errores
pm2 logs autonivelante --err

# Limpiar logs
pm2 flush
```

### Next.js Logs

Los logs de Next.js se guardan en `.next/` por defecto. Para logs persistentes:

```javascript
// next.config.mjs
const nextConfig = {
  // ...
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

### Monitoreo de Performance

```bash
# Instalar herramienta de monitoreo
npm install -g @next/bundle-analyzer

# Analizar bundle
ANALYZE=true npm run build
```

---

## 🔒 Seguridad

### Checklist de Seguridad

- [ ] Variables sensibles en `.env.local` (nunca en código)
- [ ] `.env.local` en `.gitignore`
- [ ] Certificado SSL/TLS activo
- [ ] Headers de seguridad configurados
- [ ] Rate limiting en webhooks de Stripe
- [ ] Validación de firma de webhooks
- [ ] CORS configurado correctamente
- [ ] Dependencias actualizadas (`npm audit`)

### Headers de Seguridad Recomendados

```javascript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

---

## 📞 Soporte

**Documentación:**

- Next.js: <https://nextjs.org/docs>
- Stripe Webhooks: <https://stripe.com/docs/webhooks>
- cPanel Node.js: <https://docs.cpanel.net/knowledge-base/web-services/guide-to-nodejs/>

**Contacto de Desarrollo:**

- Email: [email del desarrollador]
- Repositorio: [URL del repositorio]

---

## 📝 Changelog de Despliegue

### v2.0.0 - 6 Marzo 2026

- ❌ Eliminada exportación estática (`output: "export"`)
- ✅ Agregadas rutas API de Stripe
- ✅ Configurado rendering dinámico
- ⚠️ **Requiere servidor Node.js activo**

### v1.0.0 - [Fecha anterior]

- ✅ Exportación estática funcional
- ✅ Despliegue simple en hosting compartido
