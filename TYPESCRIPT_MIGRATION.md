# Guía de Migración a TypeScript - Autonivelante Chile

## 📊 Estado de Migración

**Fecha de inicio**: 6 de Marzo 2026  
**Progreso**: 35% completado

### ✅ Completado

#### Core & Redux

- [x] Configuración de TypeScript (`tsconfig.json`)
- [x] Tipos e interfaces principales (`src/types/index.ts`)
- [x] Redux store (`redux/store.ts`)
- [x] Redux Providers (`redux/Providers.tsx`)
- [x] Cart slice (`redux/slices/cartSlice.ts`)

#### Common Components

- [x] ProductCard (`src/components/common/ProductCard/ProductCard.tsx`)
- [x] CartCount (`src/components/common/CartCount.tsx`)
- [x] ErrorBoundary (`src/components/common/ErrorBoundary.tsx`)
- [x] Breadcrumb (`src/components/common/Breadcrumb/Breadcrumb.tsx`)

#### Layout Components

- [x] Menu (`src/components/layout/Menu.tsx`)
- [x] MobileMenu (`src/components/layout/MobileMenu.tsx`)

#### Element Components

- [x] Preloader (`src/components/elements/Preloader.tsx`)
- [x] WhatsAppButton (`src/components/elements/WhatsAppButton.tsx`)
- [x] BackToTop (`src/components/elements/BackToTop.tsx`)

#### Utilities

- [x] Helpers (`src/utils/helpers.ts`)

### 🔄 En Progreso

- [ ] Layout components (Footer, Header, HeaderGeneric)
- [ ] Páginas de App Router
- [ ] Componentes de formularios

### 📋 Pendiente

- [ ] Resto de componentes (elementos, common, layout)
- [ ] Redux store configuration
- [ ] API utilities
- [ ] Config files
- [ ] Custom hooks

---

## 🎯 Interfaces Principales Definidas

### Product & Cart

```typescript
interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  stock?: number;
  featured?: boolean;
}

interface CartItem extends Product {
  qty: number;
}
```

### User & Auth

```typescript
interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}
```

### Orders

```typescript
interface Order {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  shipping: ShippingInfo;
  status: OrderStatus;
  paymentIntentId?: string;
}

type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'cancelled' 
  | 'failed';
```

### Component Props

```typescript
interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'cart';
  index?: number;
  href?: string;
  imageHeight?: number;
  imageWidth?: number;
  onViewDetails?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onRemove?: (id: string) => void;
  onQtyChange?: (id: string, qty: number) => void;
  disableAddToCart?: boolean;
  showQuantityControls?: boolean;
  className?: string;
}
```

---

## 📝 Patrón de Migración

### 1. Componentes React

**Antes (.jsx):**

```javascript
const MyComponent = ({ title, onAction }) => {
  const [count, setCount] = useState(0);
  
  return <div>{title}</div>;
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  onAction: PropTypes.func,
};
```

**Después (.tsx):**

```typescript
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, onAction }) => {
  const [count, setCount] = useState<number>(0);
  
  return <div>{title}</div>;
};
```

### 2. Redux Slices

**Antes (.jsx):**

```javascript
const mySlice = createSlice({
  name: 'feature',
  initialState: {},
  reducers: {
    action: (state, action) => {
      state.value = action.payload;
    },
  },
});
```

**Después (.ts):**

```typescript
interface FeatureState {
  value: string;
}

const initialState: FeatureState = {
  value: '',
};

const mySlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    action: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});
```

### 3. Event Handlers

**Antes:**

```javascript
const handleClick = (event) => {
  console.log(event.target.value);
};
```

**Después:**

```typescript
const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
  console.log(event.currentTarget.value);
};
```

### 4. API Calls

**Antes:**

```javascript
const fetchData = async () => {
  const response = await fetch('/api/data');
  return response.json();
};
```

**Después:**

```typescript
interface ApiResponse {
  data: Product[];
  success: boolean;
}

const fetchData = async (): Promise<ApiResponse> => {
  const response = await fetch('/api/data');
  return response.json() as Promise<ApiResponse>;
};
```

---

## 🚀 Prioridades de Migración

### Fase 1: Core (Semana 1-2) ✅ EN PROGRESO

1. ✅ Configuración TypeScript
2. ✅ Tipos principales
3. ✅ ProductCard component
4. ✅ Cart slice
5. [ ] Store configuration
6. [ ] Layout components

### Fase 2: Components (Semana 3-4)

1. [ ] Header/HeaderAux
2. [ ] Menu/MobileMenu
3. [ ] Forms (Contact, Newsletter)
4. [ ] Cards (MainHomeCard, etc.)

### Fase 3: Pages (Semana 5-6)

1. [ ] app/page.tsx
2. [ ] app/products/page.tsx
3. [ ] app/cart/page.tsx
4. [ ] app/contact-page/page.tsx

### Fase 4: Utilities & Config (Semana 7)

1. [ ] API utilities
2. [ ] Firebase config
3. [ ] Custom hooks
4. [ ] Helper functions

---

## 🛠️ Comandos Útiles

```bash
# Verificar errores de TypeScript
npx tsc --noEmit

# Build del proyecto
npm run build

# Linting
npm run lint
```

---

## 📚 Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Next.js with TypeScript](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Redux Toolkit TypeScript](https://redux-toolkit.js.org/usage/usage-with-typescript)

---

## ⚠️ Notas Importantes

1. **Coexistencia**: Los archivos `.jsx` y `.tsx` pueden coexistir durante la migración
2. **Importaciones**: Actualizar imports cuando migres archivos dependientes
3. **PropTypes**: Eliminar PropTypes al migrar a TypeScript
4. **Type Guards**: Usar type guards para validaciones en runtime
5. **Strict Mode**: El proyecto usa `strict: true` para mejor type safety

---

## 📈 Beneficios Esperados

- ✅ **Autocompletado mejorado** en VS Code
- ✅ **Detección de errores en tiempo de desarrollo**
- ✅ **Refactoring más seguro**
- ✅ **Documentación implícita** con tipos
- ✅ **Menos bugs en producción**

---

**Último update**: 6 de Marzo 2026  
**Responsable**: Equipo de Desarrollo
