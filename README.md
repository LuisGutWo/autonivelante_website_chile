# Autonivelante Chile Website

Sitio web e-commerce de Autonivelante Chile, enfocado en productos y servicios para nivelación de pisos y acabados industriales.

Este repositorio esta preparado para que diferentes desarrolladores puedan continuar el trabajo con una base estable, optimizada y documentada.

## Estado del Proyecto

- Framework principal: `Next.js 16` (App Router) + `React 19`
- Estado: listo para evolución continua y despliegue productivo
- Calidad actual:
  - Lighthouse (ultima validación en produccion): `Performance 99`, `Accessibility 96`, `Best Practices 100`, `SEO 100`
  - Testing: suite automatizada con `Vitest` y `Testing Library`
  - SEO técnico: metadata, JSON-LD, `robots.ts` y `sitemap.ts` dinámico
  - Performance: optimizaciones de imágenes, caching, preconnect/dns-prefetch y bundle tuning

## Stack Tecnológico

- Frontend: `Next.js`, `React`, `TypeScript` (con coexistencia de archivos `.js/.jsx` en migración)
- Estado global: `Redux Toolkit` + `React Redux`
- Data fetching/cache: `TanStack React Query`
- Pagos: `Stripe` (client + API routes para intents/webhooks)
- Backend as a service: `Firebase` (Realtime Database/Storage)
- Contacto: `EmailJS`
- UI y utilidades: `React Bootstrap`, `Swiper`, `react-hot-toast`, `lucide-react`
- Calidad y DX: `ESLint`, `Vitest`, `Storybook`

## Arquitectura (Resumen)

- `app/`: rutas App Router, layouts, paginas, SEO runtime (`robots.ts`, `sitemap.ts`), endpoints (`app/api/stripe/*`)
- `src/components/`: componentes de UI y layout
- `src/hooks/`: hooks de dominio (`useProducts`, `useRedux`, `useWebVitals`)
- `src/lib/`: utilidades de API/http, iconos, logger y fuentes
- `src/config/`: configuraciones de menu, carruseles, firebase y helpers de formato
- `redux/`: store, providers y slices del carrito
- `scripts/`: scripts operativos (blur placeholders, verificacion de entorno, medición de bundle)
- `MD/`: documentacion técnica adicional de performance y validación

## Requisitos

- `Node.js 20+` recomendado
- `npm 10+` recomendado

## Configuration Local

1. Instalar dependencias:

```bash
npm install
```

1. Configurar variables de entorno en `.env.local`.

Variables mas relevantes (resumen):

- Firebase (publicas):
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
- EmailJS:
  - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
  - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
  - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
  - `NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID`
- Stripe:
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `NEXT_STRIPE_SECRET_KEY`
  - `NEXT_STRIPE_WEBHOOK_SECRET`
- Sitio/analytics:
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_SITE_NAME`
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (opcional)

1. Verificar configuracion de entorno:

```bash
node scripts/verify-env.js
```

1. Ejecutar en desarrollo:

```bash
npm run dev
```

## Scripts Disponibles

### Desarrollo

- `npm run dev`: servidor de desarrollo con Turbopack
- `npm run lint`: validación de lint
- `npm run lint:fix`: autoprotección de lint
- `npm run type-check`: chequeo de tipos (`tsc --noEmit`)

### Testing

- `npm run test`: tests en modo normal
- `npm run test:watch`: tests en watch
- `npm run test:coverage`: cobertura
- `npm run test:ui`: interfaz de Vitest

### Build y produccion

- `npm run generate:blur`: genera placeholders blur para imágenes
- `npm run build`: build completo (incluye `generate:blur`)
- `npm run build:analyze`: build con analysis de bundle
- `npm run build:production`: build forzado en modo produccion
- `npm run start`: arranque de servidor productivo
- `npm run start:production`: arranque productivo en puerto `3000`
- `npm run clean`: limpieza de artefactos (`.next`, `out`, cache)

### UI Components

- `npm run storybook`: entorno Storybook
- `npm run build-storybook`: build de Storybook

## SEO y Performance Implementados

- Metadata completa por pagina
- Structured Data (JSON-LD) con componente reusable (`src/components/common/StructuredData.tsx`)
- Sitemap dinámico (`app/sitemap.ts`) con rutas estáticas + productos
- `robots.ts` configurado para indexacion
- Optimizaciones `next/image` + formatos modernos (`AVIF`, `WebP`)
- Cache agresivo para assets estáticos e imágenes optimizadas
- Headers de seguridad y red (HSTS, X-Frame-Options, DNS prefetch, etc.)
- `optimizePackageImports` y `optimizeCss` en `next.config.mjs`

Documentacion complementaria:

- `MD/PERFORMANCE.md`
- `MD/PERFORMANCE_VALIDATION.md`
- `run-lighthouse.ps1`

## Despliegue

### Flujo recomendado

1. Verificar entorno (`node scripts/verify-env.js`)
2. Ejecutar calidad (`npm run lint`, `npm run type-check`, `npm run test`)
3. Generar build (`npm run build`)
4. Validar en modo produccion con Lighthouse
5. Desplegar en infraestructura objetivo (incluyendo cPanel si aplica)

Nota importante: este proyecto usa rutas API para Stripe (`app/api/stripe/*`), por lo que no esta configurado para exportación estática pura (`output: "export"` esta deshabilitado).

## Checklist Pre-Release

- [ ] Variables de entorno completas y sin credenciales hardcodeadas
- [ ] Lint, type-check y tests en verde
- [ ] Build de produccion sin errores
- [ ] Validación de pagos Stripe en entorno de prueba
- [ ] Validación de formularios EmailJS
- [ ] Validación SEO técnica (metadata, sitemap, robots, JSON-LD)
- [ ] Lighthouse en produccion dentro de umbrales del equipo

## Contribucion

Se aceptan Pull Requests y mejoras de arquitectura, rendimiento, accesibilidad y DX.

Flujo sugerido:

1. Crear branch de trabajo (`feature/*`, `fix/*`, `chore/*`)
2. Mantener commits pequeños y descriptivos
3. Incluir pruebas o actualizar tests cuando aplique
4. Abrir PR con contexto técnico y evidencia de validación

## Licencia

MIT.
