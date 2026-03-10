# Plaiceholder & Blur URLs - Guía de Implementación

## 📋 Resumen

Este proyecto usa **blur data URLs** generadas automáticamente en build-time para mejorar la experiencia de carga de imágenes. Las imágenes muestran un efecto blur/fade mientras se cargan las imágenes completas.

## 🏗️ Arquitectura

```text
Tiempo de compilación (CI/CD)
├─ npm run build
│  ├─ npm run generate:blur (automático)
│  │  ├── script: scripts/generate-blur-urls.js
│  │  ├── lee: src/data/products.json
│  │  ├── genera: SVG blur data URLs
│  │  └── escribe: blurDataUrl en products.json
│  └─ next build

Tiempo de ejecución
├─ ProductCard recibe product object
│  └─ con blurDataUrl desde JSON
├─ Image component usa placeholder="blur"
└─ Muestra SVG mientras carga la imagen real
```

## 🛠️ Scripts Disponibles

### Generar Blur URLs (Manual)

```bash
npm run generate:blur
```

- Procesa todas las imágenes en `src/data/products.json`
- Genera blur SVG data URLs
- Cachea resultados en `.blur-cache/`
- **Tiempo esperado**: ~2-3 segundos para 11 imágenes

### Build Automático

```bash
npm run build
# O
npm run build:production
```

- Ejecuta `generate:blur` automáticamente
- Luego npm run build normal

### Analizar Build

```bash
npm run build:analyze
# También ejecuta generate:blur primero
```

## 📊 Blur URL Format

Las blur URLs son **SVG embebidas en data URIs**:

```javascript
{
  "id": "P001",
  "title": "Producto",
  "image": "https://firebase...",
  "blurDataUrl": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0i..." 
  // ↑ Color moyenne + filtro Gaussian blur
}
```

**Ventajas**:

- ✓ Muy pequeñas (~200-300 bytes)
- ✓ No requieren requests adicionales
- ✓ Decodificadas instantáneamente
- ✓ Compatible con todos los navegadores

## 🚀 Cómo Usar en Componentes

### En ProductCard (Automático)

```jsx
// Ya está integrado, solo asegura que product tenga blurDataUrl
<Image
  src={product.image}
  alt={product.title}
  placeholder={product?.blurDataUrl ? "blur" : "empty"}
  blurDataURL={product?.blurDataUrl}
  // ... otros props
/>
```

### En Otros Componentes

Si necesitas usar blur URLs fuera de ProductCard:

```jsx
"use client";
import Image from "next/image";

export function MyComponent({ product }) {
  return (
    <Image
      src={product.image}
      alt={product.title}
      width={300}
      height={200}
      // 🎯 Agregar estas líneas
      placeholder={product?.blurDataUrl ? "blur" : "empty"}
      blurDataURL={product?.blurDataUrl}
      // ✓ El resto como siempre
    />
  );
}
```

## 📝 Agregar Blur URLs a Nuevos Productos

### Opción 1: Mediante el Script (Recomendado)

```bash
# 1. Actualizar src/data/products.json con nuevos productos
# 2. Ejecutar:
npm run generate:blur

# El script automáticamente:
# ✓ Detecta nuevas imágenes
# ✓ Genera blur URLs
# ✓ Actualiza el JSON
```

### Opción 2: Manual (Para pruebas)

Si necesitas debuggear una imagen específica:

```javascript
// En scripts/generate-blur-urls.js, agregar:
const imageUrl = "https://example.com/image.png";
const blurUrl = await getRemoteBlurUrl(imageUrl);
console.log(blurUrl);
```

## 🔄 Sistema de caché

El script mantiene un caché para evitar regenerar blur URLs innecesariamente:

```text
.blur-cache/
├── a1b2c3d4e5f6.json  (imagen 1)
├── f6e5d4c3b2a1.json  (imagen 2)
└── ...
```

**Ventajas**:

- ✓ Primera ejecución: Genera todos los blur URLs
- ✓ Ejecuciones posteriores: Solo genera nuevos
- ✓ Build rápido en CI/CD

**Limpiar caché** (si hay errores):

```bash
rm -rf .blur-cache
npm run generate:blur
```

## 🎨 Personalizar Blur Effect

Para cambiar la intensidad del blur, edita `scripts/generate-blur-urls.js`:

```javascript
// Línea ~78 - Aumentar para blur más fuerte
<feGaussianBlur in="SourceGraphic" stdDeviation="3" />
                                                    ↑
// Actual: 3 (rango 1-10 recomendado)
```

## ⚡ Impacto en rendimiento

| Métrica | Impacto |
| --- | --- |
| Tiempo de compilación | +2-3s (único al agregar productos) |
| Bundle Size | +4-5KB (blur URLs en JSON) |
| Tiempo de ejecución | 0ms (blur URLs en datos, no en JS) |
| Page Load | ✓ Mejor UX (blur effect visible) |
| LCP | ✓ Sin impacto (placeholder es SVG) |

## 🐛 Solución de problemas

### El script falla con "Input file is missing"

**Causa**: Imagen remota no accesible
**Solución**: El script usa fallback SVG automáticamente

```javascript
// Agregar timeout más largo en getRemoteBlurUrl:
timeout: 10000  // 10 segundos instead of 5000
```

### Blur URL no aparece al cargar imagen

**Verificar**:

1. ¿Tiene product.blurDataUrl en el JSON? → `npm run generate:blur`
2. ¿ProductCard recibe el objeto con blurDataUrl? → Debug en React DevTools
3. ¿Image component tiene `placeholder="blur"`? → Ver ProductCard.jsx

### Build falla: "Cannot find module 'blurhash'"

**Solución**:

```bash
npm install blurhash plaiceholder node-fetch@^2 --save
```

## 📚 Referencias

- [Next.js Image placeholder](https://nextjs.org/docs/app/api-reference/components/image#placeholder)
- [Plaiceholder Documentation](https://github.com/joe-bell/plaiceholder)
- [SVG Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)

## 🔗 Archivos Relevantes

- **Script**: `scripts/generate-blur-urls.js`
- **Productivos**: `src/data/products.json` (includes blurDataUrl)
- **Component**: `src/components/common/ProductCard/ProductCard.jsx`
- **Config**: `package.json` (build scripts)
- **Cache**: `.blur-cache/` (no hacer commit)
