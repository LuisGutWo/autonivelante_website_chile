# Ejemplos de Uso - Sistema de Carga de Imágenes

## Importes Rápidos

```tsx
// Opción 1: Importar desde index barrel
import { ImageSkeleton, CardSkeleton, OptimizedImage } from "@/components/elements";

// Opción 2: Importar directamente
import ImageSkeleton from "@/components/elements/ImageSkeleton";
import CardSkeleton from "@/components/elements/CardSkeleton";
import OptimizedImage from "@/components/elements/OptimizedImage";
```

---

## 1. ImageSkeleton - Skeleton Básico para Imágenes

### Ejemplo: Imagen rectangular (producto)

```tsx
"use client";
import { ImageSkeleton } from "@/components/elements";

export default function ProductImage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="image-wrapper">
      {isLoading && <ImageSkeleton width={300} height={200} variant="rectangular" />}
      {!isLoading && <img src="..." alt="Producto" />}
    </div>
  );
}
```

### Ejemplo: Avatar circular

```tsx
<ImageSkeleton width={50} height={50} variant="circular" />
```

---

## 2. CardSkeleton - Placeholder para Listas de Cards

### Ejemplo: Cargando productos

```tsx
"use client";
import { CardSkeleton } from "@/components/elements";
import { useQuery } from "@tanstack/react-query";

export default function ProductsPage() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) {
    return (
      <div className="container">
        <h1>Productos</h1>
        <CardSkeleton variant="product" count={6} />
      </div>
    );
  }

  return (
    <div className="products-grid">
      {products.map(p => <ProductCard product={p} />)}
    </div>
  );
}
```

### Ejemplo: Cargando proyectos

```tsx
if (loading) {
  return <CardSkeleton variant="project" count={4} />;
}
```

### Ejemplo: Cargando testimonios

```tsx
if (loading) {
  return <CardSkeleton variant="testimonial" count={3} />;
}
```

---

## 3. OptimizedImage - Imagen Optimizada con Blur

### Ejemplo: Con blur placeholder

```tsx
"use client";
import { OptimizedImage } from "@/components/elements";

export default function ProductCard({ product }) {
  return (
    <div className="card">
      <OptimizedImage
        src={product.image}
        alt={product.title}
        width={300}
        height={300}
        blurDataUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        objectFit="cover"
        onLoadingComplete={() => console.log("Imagen cargada")}
      />
      <h3>{product.title}</h3>
    </div>
  );
}
```

### Ejemplo: Imagen crítica (header)

```tsx
<OptimizedImage
  src="/assets/images/hero-banner.webp"
  alt="Banner principal"
  width={1200}
  height={600}
  priority={true}  // ← Carga inmediata, sin skeleton
  objectFit="cover"
/>
```

### Ejemplo: Imagen con fallback

```tsx
<OptimizedImage
  src={imageUrl}
  alt="Imagen"
  width={200}
  height={200}
  onLoadingComplete={() => {
    // Analytics, etc
  }}
/>
// Si hay error, muestra: "Error al cargar imagen"
```

---

## 4. Casos de Uso Específicos

### ProductsList actualizada con CardSkeleton

```tsx
// src/components/products/ProductsList.tsx
"use client";
import { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { CardSkeleton } from "@/components/elements";
import ProductCard from "@/components/common/ProductCard/ProductCard";
import CustomLoader from "@/components/elements/CustomLoader";
import { fetchProductsPage } from "@/lib/api";

interface ProductsListProps {
  title?: string;
  children?: ReactNode;
}

export default async function ProductsList({
  title = "Productos",
  children,
}: ProductsListProps) {
  const { data: products, isLoading } = useQuery({
    queryKey: ["productsPage"],
    queryFn: fetchProductsPage,
  });

  if (isLoading) {
    return (
      <section className="products-section">
        <div className="container">
          <h2>{title}</h2>
          <CardSkeleton variant="product" count={6} />
        </div>
      </section>
    );
  }

  return (
    <section className="products-section">
      <div className="container">
        <h2>{title}</h2>
        <div className="products-grid">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </div>
      </div>
      {children}
    </section>
  );
}
```

---

## 5. Mejoras CSS Recomendadas

### En ProductCard.css, reemplazar spinner

**Antes**:

```css
.product-card-image-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}
```

**Después** (usando ImageSkeleton):

```css
.product-card-image-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}
```

---

## 6. Pruebas de Componentes

### Test ImageSkeleton

```tsx
import { render } from "@testing-library/react";
import ImageSkeleton from "@/components/elements/ImageSkeleton";

test("renders image skeleton", () => {
  const { container } = render(
    <ImageSkeleton width={200} height={200} variant="rectangular" />
  );
  expect(container.querySelector(".image-skeleton")).toBeInTheDocument();
});
```

### Test CardSkeleton

```tsx
test("renders multiple card skeletons", () => {
  const { container } = render(
    <CardSkeleton variant="product" count={6} />
  );
  expect(container.querySelectorAll(".card-skeleton")).toHaveLength(6);
});
```

---

## 7. Consejos de rendimiento

### ✅ DO's

- ✅ Use `priority={true}` para hero/banner images
- ✅ Use `blurDataUrl` para placeholders suave
- ✅ Use `CardSkeleton` mientras cargan listas
- ✅ Use `sizes` attribute para responsive
- ✅ Keep image dimensions correctas (no distorsionadas)

### ❌ DON'Ts

- ❌ No usar sin lazy loading en items no-critical
- ❌ No usar imágenes enormes (> 5MB)
- ❌ No renderizar muchas imágenes sin virtualización
- ❌ No omitir `alt` text
- ❌ No usar `fill` sin prevenir stretching

---

## 8. Monitoreo y Debugging

### Console logs para debug

```tsx
<OptimizedImage
  {...props}
  onLoadingComplete={() => {
    console.log("✅ Imagen cargada:", props.alt);
  }}
/>
```

### Network throttling en DevTools

1. Chrome DevTools → Network tab
2. Throttle: "Slow 4G"
3. Reload → Deberías ver skeletons

### Rendimiento en Lighthouse

1. DevTools → Lighthouse
2. Audit → "Performance"
3. Busca: LCP (Largest Contentful Paint)
4. Meta: < 2.5s ES BUENO, < 1.2s ES EXCELENTE

---

**¡Listo! Ahora tienes un sistema robusto de carga de imágenes con skeleton loaders.**
