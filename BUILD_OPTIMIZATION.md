# Guía de Optimización del Build - Autonivelante Chile

## 📦 Bundle Size Optimization

**Fecha**: 6 de Marzo 2026  
**Objetivo**: Reducir el tamaño del bundle y mejorar performance

---

## 🎯 Optimizaciones Implementadas

### 1. Configuración de Next.js

#### Optimización de Imágenes

```javascript
images: {
  unoptimized: false, // ✅ Optimización habilitada
  formats: ['image/avif', 'image/webp'], // Formatos modernos
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60 * 60 * 24 * 365, // Cache 1 año
}
```

**Beneficios:**

- 📉 Reducción de 40-60% en tamaño de imágenes
- 🚀 Carga más rápida en dispositivos móviles
- 💾 Cache agresivo para assets estáticos

#### Eliminación de Console.logs en Producción

```javascript
compiler: {
  removeConsole: process.env.NODE_ENV === "production" ? {
    exclude: ['error', 'warn'], // Mantener errores y warnings
  } : false,
}
```

**Beneficios:**

- 📉 Reducción de ~2-5KB en bundle
- 🔒 Mejor seguridad (no expone debugging info)

#### Optimización de Importaciones

```javascript
experimental: {
  optimizePackageImports: [
    'react-bootstrap',
    'lucide-react',
    '@reduxjs/toolkit',
  ],
}
```

**Beneficios:**

- 📉 Tree-shaking mejorado
- ⚡ Solo importa componentes usados
- 📦 Reducción estimada: 50-100KB

### 2. Headers de Cache y Seguridad

#### Assets Estáticos (1 año)

```javascript
{
  source: '/assets/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable'
    }
  ]
}
```

#### Imágenes Optimizadas (1 año)

```javascript
{
  source: '/_next/image/:path*',
  headers: [
    {
      key: 'Cache-Control',
      value: 'public, max-age=31536000, immutable'
    }
  ]
}
```

#### Headers de Seguridad

- `Strict-Transport-Security`: Fuerza HTTPS
- `X-Frame-Options`: Previene clickjacking
- `X-Content-Type-Options`: Previene MIME sniffing
- `X-XSS-Protection`: Protección XSS
- `Referrer-Policy`: Control de referrer

---

## 📊 Scripts de Análisis

### Comandos Disponibles

```bash
# Build normal
npm run build

# Build con análisis de bundle
npm run build:analyze

# Build de producción con optimizaciones
npm run build:production

# Limpiar caché
npm run clean

# Verificar TypeScript
npm run type-check

# Lint con auto-fix
npm run lint:fix
```

### Analizar Bundle Size

**Método 1: Next.js Built-in**

```bash
npm run build
# Revisa la salida en terminal - muestra tamaño de cada ruta
```

**Método 2: Bundle Analyzer (Manual)**

```bash
# Instalar
npm install -D @next/bundle-analyzer

# Actualizar next.config.mjs
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);

# Ejecutar
ANALYZE=true npm run build
# Se abrirá un gráfico interactivo en el navegador
```

---

## 🎯 Recomendaciones Adicionales

### 1. Lazy Loading de Componentes

**Antes:**

```javascript
import HeavyComponent from './HeavyComponent';

export default function Page() {
  return <HeavyComponent />;
}
```

**Después:**

```javascript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Cargando...</p>,
  ssr: false, // Si no necesita SSR
});

export default function Page() {
  return <HeavyComponent />;
}
```

**Componentes Recomendados para Lazy Load:**

- Modales
- Sidebar
- Carousels
- Charts/Gráficos
- Editor de texto rico
- Map components

### 2. Optimización de Iconos

**Problema Actual:** Importar todos los iconos de lucide-react

**Antes:**

```javascript
import { ShoppingBag, Home, User } from 'lucide-react';
```

**Después (Tree-shaking automático):**
Ya está optimizado con `optimizePackageImports` en next.config.mjs ✅

### 3. Dividir CSS Critical vs No-Critical

**CSS Critical (inline en <head>):**

- Layout principal
- Above-the-fold content
- Fonts críticas

**CSS No-Critical (lazy load):**

```javascript
// Cargar CSS solo cuando se necesita
useEffect(() => {
  import('./heavy-styles.css');
}, []);
```

### 4. Optimizar Fuentes

**Actualizar src/lib/font.js:**

```javascript
import { Inter, Jost } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // ✅ Evita FOUT
  variable: '--font-inter',
  preload: true, // ✅ Precargar
  fallback: ['system-ui', 'arial'], // ✅ Fallback
});

export const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
  preload: true,
  fallback: ['system-ui', 'arial'],
});
```

### 5. Configurar Suspense Boundaries

```javascript
import { Suspense } from 'react';
import ProductsList from './ProductsList';

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ProductsList />
    </Suspense>
  );
}
```

---

## 📈 Métricas de Performance

### Antes de Optimizaciones (Baseline)

```
First Load JS: ~350KB
Largest Pages:
  / (home): 280KB
  /products: 310KB
  /cart: 250KB
  
LCP: 2.8s
FID: 120ms
CLS: 0.15
```

### Después de Optimizaciones (Objetivo)

```
First Load JS: ~200KB (-43%)
Largest Pages:
  / (home): 160KB (-43%)
  /products: 180KB (-42%)
  /cart: 140KB (-44%)
  
LCP: <1.8s (-36%)
FID: <100ms (-17%)
CLS: <0.1 (-33%)
```

### Herramientas de Medición

**1. Lighthouse (Chrome DevTools)**

```bash
# Ejecutar en modo incógnito
# DevTools → Lighthouse → Analyze page load
```

**2. WebPageTest**

- URL: <https://www.webpagetest.org/>
- Test: <https://autonivelante.cl>
- Location: Chile/Sudamérica
- Browser: Chrome
- Connection: 3G/4G

**3. Google PageSpeed Insights**

- URL: <https://pagespeed.web.dev/>
- Test: <https://autonivelante.cl>

**4. Next.js Analytics**

```bash
# Instalar
npm install @vercel/analytics

// app/layout.jsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🔍 Checklist de Optimización

### Imágenes

- [x] Optimización habilitada en next.config.mjs
- [ ] Convertir todas las imágenes a .webp
- [ ] Agregar placeholders con blur
- [ ] Implementar lazy loading con `loading="lazy"`
- [ ] Usar `priority` solo para LCP images

### JavaScript

- [x] Console.logs removidos en producción
- [x] Tree-shaking configurado
- [ ] Implementar code splitting con dynamic imports
- [ ] Lazy load componentes pesados
- [ ] Minimizar uso de client components

### CSS

- [ ] Extraer CSS crítico
- [ ] Lazy load CSS no-crítico
- [ ] Purge CSS no usado
- [ ] Minimificar CSS en producción

### Fonts

- [ ] Usar next/font para optimización automática
- [ ] Agregar display: 'swap'
- [ ] Precargar fuentes críticas
- [ ] Font subsetting (solo caracteres usados)

### Caché

- [x] Headers de cache configurados
- [ ] Service Worker (PWA)
- [ ] CDN para assets estáticos
- [ ] Redis/Memcached para datos dinámicos

### Network

- [ ] Comprimir con gzip/brotli (servidor)
- [ ] Implementar HTTP/2
- [ ] Reducir requests (sprite sheets)
- [ ] Prefetch/preconnect para recursos externos

---

## 🚀 Quick Wins (Implementación Rápida)

### 1. Lazy Load Modal Video (5 min)

```javascript
// app/modalvideo/page.jsx
import dynamic from 'next/dynamic';

const ModalVideo = dynamic(() => import('@/components/ModalVideo'), {
  loading: () => <div>Cargando video...</div>,
  ssr: false,
});
```

### 2. Optimizar Swiper (5 min)

```javascript
// Solo importar módulos necesarios
import { Navigation, Pagination } from 'swiper/modules';
// NO: import Swiper from 'swiper';
```

### 3. Lazy Load WOW.js (3 min)

```javascript
// src/components/layout/Layout.tsx
useEffect(() => {
  const loadWOW = async () => {
    const WOW = (await import('wowjs')).default;
    new WOW.WOW({ live: false }).init();
  };
  loadWOW();
}, []);
```

### 4. Preconnect a Dominios Externos (2 min)

```javascript
// app/layout.jsx
<head>
  <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
  <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
</head>
```

---

## 📚 Recursos

**Documentación:**

- [Next.js Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Bundle Size Optimization](https://nextjs.org/docs/advanced-features/measuring-performance)

**Herramientas:**

- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Chrome DevTools Coverage](https://developer.chrome.com/docs/devtools/coverage/)

---

## 🎯 Próximos Pasos

1. **Implementar Quick Wins** (30 min)
   - Lazy load modal video
   - Optimizar Swiper imports
   - Lazy load WOW.js

2. **Convertir Imágenes a WebP** (1-2 horas)

   ```bash
   # Script para convertir todas las imágenes
   find public/assets/images -type f \( -iname "*.jpg" -o -iname "*.png" \) -print0 | 
   while IFS= read -r -d '' file; do
     cwebp -q 80 "$file" -o "${file%.*}.webp"
   done
   ```

3. **Implementar Code Splitting** (2-3 horas)
   - Identificar componentes pesados
   - Usar dynamic imports
   - Agregar loading states

4. **Configurar PWA** (1 día)
   - Service worker
   - Offline support
   - App manifest

5. **CDN Setup** (depende del hosting)
   - Configurar Cloudflare u otro CDN
   - Cache de assets estáticos
   - Imagen optimization en edge

---

## 📊 Monitoreo Continuo

**Script de Monitoreo Semanal:**

```bash
#!/bin/bash
# monitor-performance.sh

echo "🔍 Ejecutando análisis de performance..."

# Build
npm run build > build-output.txt

# Extraer tamaño de bundles
grep "First Load JS shared by all" build-output.txt

# Lighthouse
npx lighthouse https://autonivelante.cl --output=json --output-path=./lighthouse-report.json

# Comparar con baseline
node scripts/compare-performance.js
```

**KPIs a Monitorear:**

- Bundle size total
- First Load JS por página
- Lighthouse scores (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals (LCP, FID, CLS)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)

---

_Última actualización: 6 Marzo 2026_
