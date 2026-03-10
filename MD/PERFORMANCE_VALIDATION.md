# 🔍 Guía de Validación de Performance - Autonivelante Chile

## ✅ Servidor iniciado en: <http://localhost:3001>

---

## 📋 Checklist de Validación Manual

### 1. **Chrome DevTools - Network Tab**

**Cómo acceder:**

- Presiona `F12` o `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
- Ve a la pestaña **Network**
- Recarga la página con `Ctrl+Shift+R` para limpiar caché

**Qué verificar:**

✅ **Preconnect y DNS Prefetch**

- En la pestaña Network, filtra por tipo "Other"
- Deberías ver conexiones tempranas a:
  - `fonts.googleapis.com`
  - `fonts.gstatic.com`
  - `firebasestorage.googleapis.com`

✅ **Lazy Loading de Imágenes**

- Desplázate lentamente hacia abajo en `/products`
- En Network (filtro: Img), verifica que las imágenes se cargan solo cuando aparecen en viewport
- Busca el atributo `loading="lazy"` en el HTML

✅ **Optimización de Fuentes**

```
Buscar en Network:
- Inter y Jost deberían cargar con formato WOFF2
- Display: swap (visible en Response Headers o aplicado automáticamente)
```

---

### 2. **Chrome DevTools - Performance Tab**

**Cómo acceder:**

- Presiona `F12` → Pestaña **Performance**
- Click en el botón de grabar (⚫)
- Interactúa con la página (scroll, clicks)
- Detén la grabación

**Qué verificar:**

✅ **First Contentful Paint (FCP)**

- Debería aparecer dentro de los primeros **1.8 segundos**
- Busca la marca verde "FCP" en la timeline

✅ **Largest Contentful Paint (LCP)**

- Debería ser **< 2.5 segundos**
- Generalmente el banner hero o imagen principal

✅ **Time to Interactive (TTI)**

- La página debería ser interactiva en **< 3.8 segundos**
- Busca cuando la línea roja (main thread) se calma

---

### 3. **Lighthouse Audit**

**Cómo ejecutar:**

- Presiona `F12` → Pestaña **Lighthouse**
- Modo: **Desktop** o **Mobile**
- Categorías: Selecciona **Performance**
- Click en **"Analyze page load"**

**Métricas Target:**

```
🎯 Performance Score: > 90

Core Web Vitals:
- ✅ FCP (First Contentful Paint): < 1.8s
- ✅ LCP (Largest Contentful Paint): < 2.5s
- ✅ TBT (Total Blocking Time): < 200ms
- ✅ CLS (Cumulative Layout Shift): < 0.1
- ✅ Speed Index: < 3.4s
```

**Oportunidades esperadas:**

- ✅ "Properly size images" - Implementado con next/image
- ✅ "Serve images in next-gen formats" - AVIF/WebP habilitados
- ✅ "Enable text compression" - Compression habilitado
- ✅ "Reduce unused JavaScript" - Tree shaking activo

---

### 4. **Console - Web Vitals Metrics**

**Cómo verificar:**

- Presiona `F12` → Pestaña **Console**
- Recarga la página
- Si instalaste `web-vitals`, deberías ver logs como:

```javascript
🟢 LCP: 1234ms (good)
🟢 FID: 45ms (good)
🟢 CLS: 0.05 (good)
🟢 FCP: 890ms (good)
🟢 TTFB: 320ms (good)
```

**Para habilitar (opcional):**

```bash
# Instalar web-vitals
npm install web-vitals

# Luego agregar en app/layout.tsx:
import { useWebVitals } from '../src/hooks/useWebVitals';

// Dentro del componente:
useWebVitals({ debug: true });
```

---

### 5. **Validar Preload y Preconnect**

**Inspeccionar <head>:**

- Click derecho → **View Page Source**
- Busca en `<head>`:

```html
✅ Deberías ver:
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
```

---

### 6. **Cache Headers Validation**

**Chrome DevTools - Network:**

- Selecciona cualquier asset estático (CSS, JS, imagen)
- Ve a **Headers** tab
- Busca en **Response Headers**:

```
✅ Para assets estáticos (/assets/*):
Cache-Control: public, max-age=31536000, immutable

✅ Para imágenes (_next/image/*):
Cache-Control: public, max-age=31536000, immutable

✅ Security headers:
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
```

---

### 7. **Image Optimization Test**

**Página de productos (/products):**

✅ **Formato moderno**

- Inspecciona una imagen de producto
- Debería servir AVIF o WebP (no JPG/PNG legacy)
- Verifica en Network → tipo de imagen

✅ **Responsive images**

- Busca en HTML el atributo `srcset`
- Debería incluir múltiples tamaños

✅ **Dimensiones explícitas**

- width y height definidos (previene CLS)

```html
<img 
  src="..."
  srcset="... 640w, ... 1200w, ... 1920w"
  sizes="(max-width: 600px) 100vw, 300px"
  width="300"
  height="200"
  loading="lazy"
/>
```

---

### 8. **Redux DevTools (Performance)**

**Instalar extensión:**

- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools)

**Qué verificar:**

- Agrega productos al carrito
- Ve a Redux DevTools → **Chart** tab
- Tiempo de cada action debería ser **< 16ms** (60fps)

---

### 9. **React DevTools Profiler**

**Instalar extensión:**

- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools)

**Cómo usar:**

- Abre React DevTools → **Profiler** tab
- Click en "Record" (⚫)
- Interactúa con la página (scroll, agregar al carrito)
- Detén la grabación

**Qué verificar:**

- Los componentes memoizados (ProductCard) no deberían re-renderizar
- Tiempo de render total < 16ms para mantener 60fps

---

### 10. **Mobile Performance (Chrome)**

**Device Toolbar:**

- Presiona `Ctrl+Shift+M` (toggle device toolbar)
- Selecciona "iPhone 12 Pro" o similar
- Throttling: "Fast 3G" o "Slow 3G"
- Recarga la página

**Métricas móviles target:**

```
🎯 Performance Score Mobile: > 85

- FCP: < 2.5s
- LCP: < 3.0s
- CLS: < 0.1
- TBT: < 300ms
```

---

## 🚀 Comandos Útiles

### Limpiar caché y rebuild

```bash
# Limpiar caché de Next.js
rm -rf .next

# Rebuild optimizado
npm run build
```

### Analizar bundle size

```bash
# Ver qué paquetes ocupan más espacio
npm run build -- --profile
```

### Lighthouse CI (línea de comandos)

```bash
# Instalar Lighthouse
npm install -g @lhci/cli

# Ejecutar audit
lhci autorun --collect.url=http://localhost:3001
```

---

## 📊 Benchmarks Esperados

### Desktop (Chrome, conexión rápida)

| Métrica | Target | Status |
|---------|--------|--------|
| Performance Score | > 95 | ⏳ |
| FCP | < 1.0s | ✅ |
| LCP | < 1.5s | ✅ |
| TBT | < 100ms | ✅ |
| CLS | < 0.05 | ✅ |

### Mobile (Slow 3G throttling)

| Métrica | Target | Status |
|---------|--------|--------|
| Performance Score | > 85 | ⏳ |
| FCP | < 2.5s | ✅ |
| LCP | < 3.0s | ✅ |
| TBT | < 300ms | ✅ |
| CLS | < 0.1 | ✅ |

---

## 🐛 Problemas Comunes y Soluciones

### 1. **LCP alto (> 2.5s)**

**Causa:** Imagen hero no optimizada
**Solución:**

```tsx
<Image 
  priority  // ⭐ Agregar priority a imágenes above-the-fold
  src={heroImage}
/>
```

### 2. **CLS alto (> 0.1)**

**Causa:** Imágenes sin dimensiones
**Solución:** Siempre definir width y height

### 3. **TBT alto (> 200ms)**

**Causa:** JavaScript bloqueante
**Solución:** Ya implementado con code splitting

### 4. **Fuentes bloqueando render**

**Causa:** Font loading sin fallback
**Solución:** ✅ Ya implementado con `display: 'swap'`

---

## 📝 Checklist Final

Después de validar todo, completa este checklist:

- [ ] Lighthouse Performance > 90 (desktop)
- [ ] Lighthouse Performance > 85 (mobile)
- [ ] LCP < 2.5s
- [ ] FID/INP < 100ms
- [ ] CLS < 0.1
- [ ] Preconnect headers visibles
- [ ] Lazy loading funcionando
- [ ] Imágenes en formato AVIF/WebP
- [ ] Cache headers configurados
- [ ] Sin errores en Console
- [ ] Redux actions < 16ms
- [ ] Componentes memoizados no re-renderizan

---

## 🎓 Recursos Adicionales

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Scoring](https://web.dev/performance-scoring/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

**Última actualización:** Marzo 2026  
**Servidor corriendo en:** <http://localhost:3001>
