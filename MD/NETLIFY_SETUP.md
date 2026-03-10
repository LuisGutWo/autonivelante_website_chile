# Configuración de Variables de Entorno en Netlify

## Variables Requeridas

Para que el sitio funcione correctamente en Netlify, debes configurar las siguientes variables de entorno:

### 1. Variables de Stripe (Requeridas para pagos)

En el dashboard de Netlify:

1. Ve a: **Site → Settings → Build & deploy → Environment → Environment variables**
2. Agrega las siguientes variables:

\*\*\* NEXT_STRIPE_SECRET_KEY=tu_clave_secreta_stripe
NEXT_STRIPE_WEBHOOK_SECRET=tu_webhook_secret_stripe

---

**Notas importantes:**

- La clave secreta comienza con `sk_live_...` (producción) o `sk_test_...` (desarrollo)
- El webhook secret comienza con `whsec_...`
- **NUNCA** commits estas claves al repositorio
- Para desarrollo local, usa el archivo `.env.local` (ignorado por git)

### 2. Variables de Firebase (Ya configuradas en next.config.mjs)

Las siguientes variables ya están configuradas públicamente en el código:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- Etc.

Si necesitas cambiarlas, edita `next.config.mjs` o agrégalas como variables de entorno.

### 3. Variables de EmailJS (Para formularios de contacto)

Si usas EmailJS, agrega:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=tu_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=tu_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=tu_public_key
```

## Cómo Obtener las Claves de Stripe

1. Ve a: <https://dashboard.stripe.com/>
2. **API Keys:**
   - En el sidebar: **Developers → API keys**
   - Copia la "Secret key" (sk\_...)

3. **Webhook Secret:**
   - En el sidebar: **Developers → Webhooks**
   - Crea un nuevo endpoint con la URL: `https://tu-sitio.netlify.app/api/stripe/webhook`
   - Eventos a escuchar: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copia el "Signing secret" (whsec\_...)

## Verificación Post-Deploy

Después de configurar las variables:

1. Haz un nuevo deploy (o trigger retry del fallido)
2. Verifica los logs de build en Netlify
3. El build debe completarse exitosamente con mensaje: `✓ Generating static pages`

## Solución de problemas

### Error: "Neither apiKey nor config.authenticator provided"

- **Causa:** Falta `NEXT_STRIPE_SECRET_KEY` en Netlify
- **Solución:** Agrega la variable en Environment variables

### Error: "Missing NEXT_STRIPE_WEBHOOK_SECRET"

- **Causa:** Falta la variable del webhook
- **Solución:** Agrega la variable en Environment variables

### Build exitoso pero pagos no funcionan

- Verifica que las claves sean de producción (`sk_live_...`)
- Confirma que el webhook esté configurado apuntando a tu dominio de Netlify
- Revisa los logs de Stripe Dashboard para ver errores del webhook

## Archivo .env.local (Desarrollo Local)

Para desarrollo local, crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Stripe
NEXT_STRIPE_SECRET_KEY=sk_test_...
NEXT_STRIPE_WEBHOOK_SECRET=whsec_...

# EmailJS (opcional)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_...
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
```

Este archivo está en `.gitignore` y nunca será commiteado al repositorio.

## Nota de Seguridad

🔒 **IMPORTANTE:** Nunca expongas tus claves secretas:

- No las commits al repositorio
- No las compartas en screenshots
- No las incluyas en código del lado del cliente
- Usa siempre variables de entorno para claves sensibles
