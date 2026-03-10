# Guía de implementación de manejo de errores - Fase 3

## 📋 Resumen General

Implementación completa de **manejo de errores en producción** con los siguientes componentes:

✅ **ErrorBoundary** - Captura errores de componentes React  
✅ **httpClient** - Cliente HTTP con retry automático (exponencial backoff)  
✅ **APIError** - Componente UI para mostrar errores al usuario  
✅ **Rutas de error** - Páginas de error para Server Components (error.jsx)  
✅ **Registro estructurado** - Logs estructurados con emojis para fácil identificación  

---

## 🏗️ Arquitectura de Manejo de Errores

```text
┌─────────────────────────────────────────────────────────┐
│  Global Error Boundary (app/layout.jsx)                 │
│  └─ Captura todos los errores no manejados              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│  Layout Component ErrorBoundary                         │
│  └─ Maneja errores específicos de contenido             │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴──────────────┐
        │                           │
        v                           v
   Server Components          Client Components
   (Page.jsx)                (usa ErrorBoundary)
        │                           │
        v                           v
   error.jsx Routes          Component-level
   (Fallback UI)             error handling
```

---

## 📦 Componentes Implementados

### 1. **ErrorBoundary.jsx** (`/src/components/common/`)

**Propósito**: Capturar errores de React y mostrar una interfaz de respaldo

**Características**:

- Componente de clase con `getDerivedStateFromError`
- `componentDidCatch` para logging
- Botón "Reintentar" para resetear el estado
- Detalles técnicos en modo desarrollo
- Estilos responsivos con Bootstrap

**Propiedades**: Ninguna (envuelve `children`)

**Métodos Clave**:

- `getDerivedStateFromError(error)` - Detecta errores
- `componentDidCatch(error, errorInfo)` - Registra en consola
- `handleReset()` - Limpia el estado de error

**Uso**:

```jsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

---

### 2. **httpClient.js** (`/src/lib/`)

**Propósito**: Cliente HTTP con retry automático y caché

**Características**:

- **Reintentos con retroceso exponencial**: 1s → 2s → 4s (máx 10s)
- **Jitter para evitar thundering herd**: +0-1s random
- **Max 3 retries** por defecto (configurable)
- **Tiempo de espera de solicitud**: 10s (configurable)
- **Detecta errores reintentables**:
  - Network errors (TypeError)
  - 408 Request Timeout
  - 429 Too Many Requests
  - 500 Internal Server Error
  - 502 Bad Gateway
  - 503 Service Unavailable
  - 504 Gateway Timeout
- **Caché en memoria**: Para acelerar consultas repetidas

**Métodos Exportados**:

```javascript
httpClient.get(url, options)      // GET request
httpClient.post(url, data, opts)  // POST request
httpClient.put(url, data, opts)   // PUT request
httpClient.delete(url, options)   // DELETE request
httpClient.clearCache()           // Limpiar caché
```

**Opciones**:

```javascript
{
  maxRetries: 3,          // Máximo número de reintentos
  timeout: 10000,         // Timeout en ms
  includeCache: true      // Usar caché
}
```

**Ejemplo de Uso**:

```javascript
try {
  const data = await httpClient.get('/api/products', { 
    maxRetries: 5 
  });
  console.log('✅ Éxito:', data);
} catch (error) {
  console.error('❌ Error final:', error.message);
}
```

---

### 3. **APIError.jsx** (`/src/components/common/`)

**Propósito**: Componente UI para mostrar errores amigables al usuario

**Características**:

- Detección automática de tipo de error
- Mensajes personalizados por tipo de error
- Icono animado y responsive
- Botón "Reintentar" con delay visual
- Detalles técnicos expandibles (dev mode)
- Integrado con react-bootstrap

**Props**:

```javascript
{
  error: Error,                    // Objeto error
  onRetry: () => void,             // Callback al reintentar
  title: string,                   // Título del error
  message: string,                 // Mensaje principal
  showDetails: boolean             // Mostrar detalles técnicos
}
```

**Ejemplo de Uso**:

```jsx
<APIError
  error={error}
  onRetry={() => refetch()}
  title="Error de conexión"
  message="No pudimos conectar al servidor"
  showDetails={isDevelopment}
/>
```

---

### 4. **Rutas de error** (error.jsx)

Archivos creados en todas las rutas críticas:

#### `app/error.jsx` (Global)

```javascript
// Captura errores no manejados en toda la aplicación
// Muestra: Algo salió mal - Se produjo un error inesperado
```

#### `app/products/error.jsx`

```javascript
// Captura errores en fetchMainProducts()
// Muestra: Error al cargar productos
```

#### `app/homeproducts/error.jsx`

```javascript
// Captura errores en fetchHomeProducts()
// Muestra: Error al cargar productos destacados
```

#### `app/cart/error.jsx`

```javascript
// Captura errores en la página del carrito
// Muestra: Error en el carrito
```

**Estructura Común**:

```jsx
"use client";

export default function RouteError({ error, reset }) {
  useEffect(() => {
    console.error("❌ [Ruta] Error:", error);
  }, [error]);

  return (
    <Layout>
      <APIError
        error={error}
        onRetry={reset}
        title="Título del Error"
        message="Mensaje amigable al usuario"
        showDetails={process.env.NODE_ENV === "development"}
      />
    </Layout>
  );
}
```

---

## 🔄 Flujo de Manejo de Errores

### **Flujo de error en Server Components**

```text
1. Page.jsx ejecuta fetchMainProducts()
2. httpClient realiza GET con retry automático (3 intentos)
3. Si todos fallan → Se lanza Error
4. Error Boundary captura en app/layout.jsx
5. error.jsx de la ruta específica muestra APIError
6. Usuario ve UI amigable con botón "Reintentar"
7. Click en "Reintentar" → reset() → Reintenta
```

### **Flujo de error en Client Components**

```text
1. Componente ejecuta función que lanza Error
2. ErrorBoundary captura el error
3. Muestra fallback UI con detalles técnicos
4. Usuario ve opción "Reintentar"
5. Click en "Reintentar" → Reset state
6. Componente vuelve a renderizar normalmente
```

### **Flujo de solicitudes de red**

```text
1. httpClient.get(url) - Intento 1
   ├─ Éxito → Retorna datos
   └─ Fallo (timeout/5xx) → Espera 1s + jitter
     │
     └─ Intento 2 (máx 4s espera)
        ├─ Éxito → Retorna datos
        └─ Fallo → Espera 2s + jitter
          │
          └─ Intento 3 (máx 8s espera)
             ├─ Éxito → Retorna datos
             └─ Fallo → Lanza error final
```

---

## 📝 Cambios en api.jsx

Todas las funciones de fetch actualizadas con httpClient:

### **fetchMainProducts()**

```javascript
const data = normalizeProducts(productsData.mainProducts ?? []);
```

### **fetchHomeProducts()**

```javascript
const data = normalizeProducts(productsData.homeProducts ?? []);
```

### **fetchProductsPage()**

```javascript
const data = normalizeProducts(productsData.productsPage ?? []);
```

### **getOrderById()**

```javascript
const data = await httpClient.get(`${baseUrl}/orders/${orderId}.json`);
```

### **saveOrder() y getOrders()**

```javascript
// PUT request con retry
const data = await httpClient.put(orderUrl, orderData);

// GET request con caché
const orders = await httpClient.get(ordersUrl);
```

### **updateOrderStatus()**

```javascript
const data = await httpClient.put(`${baseUrl}/orders/${orderId}/status.json`, status);
```

---

## 🔧 Cambios en Componentes

### **app/layout.jsx**

```javascript
import ErrorBoundary from "@/src/components/common/ErrorBoundary";

export default function RootLayout({ children }) {
  return (
    <html>
      <Providers>
        <body>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </body>
      </Providers>
    </html>
  );
}
```

### **Layout.jsx (Component)**

```javascript
import ErrorBoundary from "@/src/components/common/ErrorBoundary";

export default function Layout(props) {
  return (
    <>
      <Header />
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <Footer />
    </>
  );
}
```

### **Páginas con Server Components**

Removidos try-catch que retornaban null, ahora lanzan errores:

```javascript
// ANTES (❌)
try {
  const products = await fetch();
  return <ProductList products={products} />;
} catch (error) {
  return null; // Página en blanco
}

// DESPUÉS (✅)
const products = await fetch(); // Lanza error si falla
if (!products) throw new Error("No products found");
return <ProductList products={products} />;
```

---

## 📊 Casos de Error Manejados

### **Red/Conexión**

- ✅ Network timeout (408)
- ✅ Connection refused
- ✅ CORS errors
- ✅ DNS resolution failed
- ✅ Rate limiting (429)

### **Servidor**

- ✅ 500 Internal Server Error
- ✅ 502 Bad Gateway
- ✅ 503 Service Unavailable
- ✅ 504 Gateway Timeout

### **Aplicación**

- ✅ Null/undefined data
- ✅ Invalid response format
- ✅ Missing environment variables
- ✅ Component rendering errors

### **Usuario**

- ✅ Mensajes claros en español
- ✅ Botón "Reintentar" visible
- ✅ No páginas en blanco (siempre hay fallback)
- ✅ Detalles técnicos solo en desarrollo

---

## 🧪 Pruebas Manuales

### **Prueba 1: Timeout de red**

```javascript
// Simular en httpClient.js
const timeout = 100; // ms muy bajo
// Resultado: Error capturado, reintento automático, UI amigable
```

### **Prueba 2: Respuesta API inválida**

```javascript
// Cambiar URL a endpoint inválido
const url = "https://invalid-url.com/products";
// Resultado: Error después de 3 reintentos, APIError mostrado
```

### **Prueba 3: Variable de entorno faltante**

```javascript
// Corromper src/data/products.json (ej: product sin id o image)
// Resultado: normalización filtra datos inválidos y no rompe UI
```

### **Prueba 4: Error de componente React**

```javascript
// Renderizar componente que lanza error
throw new Error("Test error");
// Resultado: ErrorBoundary captura, muestra reset button
```

---

## 📚 Documentación Complementaria

Ver también:

- [ENV_REFACTORING_GUIDE.md](./ENV_REFACTORING_GUIDE.md) - Variables de entorno
- [AGENTS.md](./AGENTS.md) - Agentes especializados

---

## ✅ Checklist de Implementación

- ✅ ErrorBoundary.jsx creado
- ✅ httpClient.js con lógica de reintentos
- ✅ Componente APIError.jsx
- ✅ error.jsx para errores globales
- ✅ error.jsx para la ruta /products
- ✅ error.jsx para la ruta /homeproducts
- ✅ error.jsx para la ruta /cart
- ✅ app/layout.jsx con ErrorBoundary
- ✅ Layout.jsx component con ErrorBoundary
- ✅ api.jsx functions actualizadas con httpClient
- ✅ Server Components sin try-catch que retornan `null`
- ✅ Mensajes de error en español

---

## 🚀 Siguientes Pasos Opcionales

1. **Notificaciones toast**
   - Mostrar notificación cuando se completa retry
   - Usar react-hot-toast (ya instalado)

2. **Monitoreo avanzado**
   - Sentry integration para tracking de errores
   - Log agrupación por tipo de error

3. **Analítica de usuario**
   - Trackear qué errores son más comunes
   - Mejorar UX basado en patrones

4. **Degradación gradual**
   - Cache de datos previos
   - Modo offline básico
   - Skeleton loaders en lugar de errores

---

## 📞 Soporte y solución de problemas

### Error: "ErrorBoundary is not defined"

- Verificar import en layout.jsx: `import ErrorBoundary from "@/src/components/common/ErrorBoundary";`

### Error: "httpClient is not defined"

- Asegurar que api.jsx tenga: `import { httpClient } from "./httpClient";`

### Páginas mostrando APIError permanentemente

- Revisar consola para ver el error real
- Verificar variables de entorno en .env.local
- Revisar las reglas de la base de datos de Firebase

---

_Documentación creada: Fase 3 - Implementación de manejo de errores_  
_Última actualización: 2026_  
_Estado: ✅ COMPLETADO_
