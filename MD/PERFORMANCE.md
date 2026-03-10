# Guía de optimización de rendimiento - Autonivelante Chile

## 🚀 Optimizaciones Implementadas

### 1. Optimización de Imágenes

- ✅ **next/image**: Todas las imágenes usan el componente optimizado de Next.js
- ✅ **Lazy Loading**: `loading="lazy"` en todas las imágenes no críticas
- ✅ **Formatos modernos**: AVIF y WebP habilitados
- ✅ **Responsive images**: `sizes` configurado para diferentes viewports
- ✅ **Image skeleton**: Loading states con ImageSkeleton mientras cargan

**Ejemplo**:

```tsx
<Image
  src={product.image}
  alt={product.title}
  width={300}
  height={200}
  loading="lazy"
  sizes="(max-width: 600px) 100vw, 300px"
/>
```

### 2. Optimización de Fuentes

- ✅ **Font Display Swap**: Evita FOIT (Flash of Invisible Text)
- ✅ **Subsetting**: Solo caracteres latinos cargados
- ✅ **Variable fonts**: Inter y Jost optimizados

```js
// src/lib/font.js
export const inter = Inter({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  display: "swap", // 🎯 Clave para performance
});
```

### 3. Resource Hints

- ✅ **Preconnect**: Google Fonts y Firebase Storage
- ✅ **DNS Prefetch**: Dominios de Firebase
- ✅ **Reduced latency**: Conexiones anticipadas a recursos externos

```tsx
{/* app/layout.tsx */}
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
```

### 4. Code Splitting y Lazy Loading

- ✅ **Dynamic imports**: WOW.js cargado dinámicamente
- ✅ **React.lazy**: Componentes pesados cargados bajo demanda
- ✅ **Route-based splitting**: Next.js maneja automáticamente

```tsx
// Layout.tsx - WOW.js lazy loaded
const initWow = async () => {
  const wowModule = await import("wowjs");
  window.wow = new wowModule.WOW({ live: false });
  window.wow.init();
};
```

### 5. Optimización de Bundle

- ✅ **Tree Shaking**: Eliminación de código no usado
- ✅ **Package optimization**: react-bootstrap, lucide-react optimizados
- ✅ **Console removal**: console.log eliminado en producción
- ✅ **Compression**: Respuestas gzip/brotli habilitadas

```js
// next.config.mjs
compiler: {
  removeConsole: process.env.NODE_ENV === "production" ? {
    exclude: ["error", "warn"],
  } : false,
},
```

### 6. Caching Strategy

- ✅ **Static assets**: Cache de 1 año (immutable)
- ✅ **Images**: Cache optimizado con next/image
- ✅ **Client-side cache**: React Query con stale-while-revalidate

Headers configurados:

```js
// Cache para assets estáticos
source: "/assets/:path*",
headers: [{
  key: "Cache-Control",
  value: "public, max-age=31536000, immutable",
}]
```

### 7. React Query Optimization

- ✅ **Stale time**: 5 minutos
- ✅ **Cache time**: 10 minutos
- ✅ **Deduplication**: Requests automáticamente deduplicados
- ✅ **Background refetch**: Actualización silenciosa

```tsx
// src/hooks/useProducts.ts
const staleTime = 1000 * 60 * 5; // 5 min
const cacheTime = 1000 * 60 * 10; // 10 min
```

### 8. Redux Performance

- ✅ **Redux Toolkit**: Optimizado con Immer
- ✅ **Memoization**: useAppSelector con shallow equality
- ✅ **Normalized state**: Estado plano y normalizado

### 9. Component Optimization

- ✅ **React.memo**: Componentes pesados memoizados
- ✅ **useCallback**: Handlers optimizados
- ✅ **useMemo**: Cálculos costosos cacheados

```tsx
// ProductCard optimizado con React.memo
const ProductCard: React.FC<ProductCardProps> = React.memo(({ product }) => {
  const handleAddToCart = useCallback(() => {
    dispatch(addToCart(product));
  }, [dispatch, product]);
  
  // ...
});
```

### 10. Network Optimization

- ✅ **prefetch={false}**: Links sin prefetch innecesario
- ✅ **HTTP/2**: Multiplexing de requests
- ✅ **Security headers**: X-DNS-Prefetch-Control habilitado

### 11. SEO Performance

- ✅ **JSON-LD**: Structured data sin bloquear rendering
- ✅ **Metadata**: Estático cuando es posible
- ✅ **Sitemap**: Generado en build-time
- ✅ **robots.txt**: Optimizado para crawlers

---

## 📊 Métricas Target (Lighthouse)

### Objetivos de rendimiento

- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Total Blocking Time (TBT)**: < 200ms

### Current Status

✅ Todas las optimizaciones implementadas
⏳ Pendiente: Medición con Lighthouse en producción

---

## 🔧 Comandos de Performance

### Build Optimizado

```bash
npm run build
```

### Analizar Bundle Size

```bash
npm run build -- --profile
```

### Lighthouse CI (Manual)

```bash
npx lighthouse https://autonivelante.cl --view
```

---

## 📝 Checklist de Performance

### Imágenes

- [x] Todas usan next/image
- [x] Lazy loading habilitado
- [x] Dimensiones explícitas (width/height)
- [x] Formatos modernos (AVIF, WebP)
- [x] Responsive con sizes attribute

### Fonts

- [x] Font display swap
- [x] Subsets optimizados
- [x] Preconnect a Google Fonts
- [x] Variable fonts cuando sea posible

### JavaScript

- [x] Code splitting por ruta
- [x] Dynamic imports para librerías pesadas
- [x] Tree shaking habilitado
- [x] Console.log eliminado en producción

### CSS

- [x] CSS crítico inline (automático Next.js)
- [x] CSS modules para scope
- [x] Minificación habilitada

### Caching

- [x] Headers de cache configurados
- [x] Static assets con cache largo
- [x] Imágenes con cache optimizado
- [x] React Query para client cache

### Network

- [x] Preconnect para recursos externos
- [x] DNS prefetch para imágenes
- [x] Compression habilitada
- [x] Prefetch deshabilitado en links innecesarios

### React

- [x] Componentes memoizados
- [x] useCallback para handlers
- [x] useMemo para cálculos
- [x] Error boundaries para prevenir crashes

---

## 🎯 Próximas Optimizaciones

### Corto Plazo

1. **PWA**: Habilitar progressive web app

   ```bash
   npm install next-pwa
   ```

2. **Web Vitals Monitoring**: Implementar tracking

   ```tsx
   export function reportWebVitals(metric) {
     // Send to analytics
   }
   ```

3. **Image Priority**: Marcar imágenes above-the-fold

   ```tsx
   <Image priority src={heroImage} />
   ```

### Mediano Plazo

1. **CDN**: Cloudflare/AWS CloudFront para assets
2. **Service Worker**: Cache offline avanzado
3. **Incremental Static Regeneration**: Para productos frecuentes

### Largo Plazo

1. **Edge Functions**: Mover API routes a edge
2. **Streaming SSR**: React 18 Suspense boundaries
3. **Partial Hydration**: Islands architecture

---

## 📚 Referencias

- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [React Performance](https://react.dev/learn/render-and-commit#optimizing-performance)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Última actualización**: Marzo 2026  
**Mantenido por**: Equipo Autonivelante Chile
