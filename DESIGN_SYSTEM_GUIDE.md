# 🎨 Sistema de Componentes - Autonivelante Chile

**Fecha de Implementación**: Marzo 2026  
**Estado**: ✅ **EN PROGRESO** (Fase 1 Completada)  
**Tiempo Estimado Total**: 2 semanas

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Sistema de Design Tokens](#sistema-de-design-tokens)
4. [Componentes Base](#componentes-base)
5. [Uso de Storybook](#uso-de-storybook)
6. [Próximos Pasos](#próximos-pasos)
7. [Guía de Contribución](#guía-de-contribución)

---

## 🎯 Resumen Ejecutivo

### Fase 1: Completada ✅

Se ha establecido la infraestructura base del sistema de componentes:

✅ **Storybook Instalado**: Versión latest para Next.js  
✅ **Design Tokens**: Sistema centralizado de variables CSS  
✅ **Primer Componente**: Button con 7 variantes y full documentation  
✅ **Utilities CSS**: Clases helper reutilizables

### Objetivos del Sistema

El Sistema de Componentes busca:

1. **Consistencia Visual**: Todos los componentes usan design tokens centralizados
2. **Reusabilidad**: Componentes genéricos que se adaptan a múltiples contextos
3. **Documentación**: Storybook como fuente de verdad para UI
4. **Mantenibilidad**: Código limpio, bien organizado y fácil de modificar
5. **Escalabilidad**: Sistema que crece con el proyecto

---

## 🛠️ Instalación y Configuración

### Storybook Instalado

**Versión**: Storybook latest  
**Framework Integration**: @storybook/nextjs  
**Addons Instalados**:

- @storybook/addon-essentials
- @storybook/addon-interactions
- @storybook/addon-links
- @storybook/blocks

### Configuración

#### `.storybook/main.js`

```javascript
const config = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": require("path").resolve(__dirname, "../"),
    };
    return config;
  },
};
```

**Características**:

- ✅ Busca stories en `/src/**/*.stories.jsx`
- ✅ Autodocs activado
- ✅ Alias `@/` configurado
- ✅ Public assets disponibles

#### `.storybook/preview.js`

Configura el entorno global de Storybook:

- ✅ Estilos globales importados
- ✅ Redux Provider
- ✅ React Query Provider
- ✅ Backgrounds predefinidos (light, dark, autonivelante-blue)

### Scripts NPM

```json
{
  "storybook": "storybook dev -p 6006",
  "build-storybook": "storybook build"
}
```

**Uso**:

```bash
# Iniciar Storybook en desarrollo
npm run storybook

# Build estático para producción
npm run build-storybook
```

**URL**: `http://localhost:6006`

---

## 🎨 Sistema de Design Tokens

### Ubicación

```
/src/styles/
├── variables.css       # Design tokens centralizados
├── utilities.css       # Clases helper
└── globals.css         # Estilos globales base
```

### Variables CSS Definidas

#### 1. **Colores** (42 variables)

```css
/* Marca Principal */
--color-primary: #015c93
--color-primary-light: #0273b3
--color-primary-dark: #014573
--color-primary-rgb: 1, 92, 147

/* Secundarios */
--color-secondary: #f39200

/* Grises (10 tonos) */
--color-gray-50 → --color-gray-900

/* Semánticos */
--color-success: #10b981
--color-error: #ef4444
--color-warning: #f59e0b
--color-info: #3b82f6

/* Texto */
--color-text-primary
--color-text-secondary
--color-text-muted

/* Backgrounds */
--color-bg-primary
--color-bg-secondary
--color-bg-tertiary
```

#### 2. **Tipografía** (28 variables)

```css
/* Familias */
--font-primary: 'Inter', sans-serif
--font-secondary: 'Jost', 'Roboto', sans-serif

/* Tamaños (10 escalas) */
--font-size-xs: 0.75rem (12px)
--font-size-sm: 0.875rem (14px)
--font-size-base: 1rem (16px)
...
--font-size-6xl: 3.75rem (60px)

/* Pesos */
--font-weight-light: 300
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700

/* Line Heights */
--line-height-tight: 1.25
--line-height-normal: 1.5
--line-height-relaxed: 1.75
```

#### 3. **Spacing** (14 variables - Sistema 8pt)

```css
--spacing-0: 0
--spacing-1: 0.25rem (4px)
--spacing-2: 0.5rem (8px)
--spacing-3: 0.75rem (12px)
--spacing-4: 1rem (16px)
...
--spacing-32: 8rem (128px)
```

Basado en sistema 8-point grid para consistencia visual.

#### 4. **Breakpoints** (6 variables)

```css
--breakpoint-xs: 360px
--breakpoint-sm: 576px
--breakpoint-md: 768px
--breakpoint-lg: 992px
--breakpoint-xl: 1200px
--breakpoint-2xl: 1400px
```

#### 5. **Borders & Radius** (10 variables)

```css
/* Widths */
--border-width-thin: 1px
--border-width-medium: 2px
--border-width-thick: 3px

/* Radius */
--border-radius-sm: 0.25rem (4px)
--border-radius-md: 0.5rem (8px)
--border-radius-lg: 0.75rem (12px)
--border-radius-xl: 1rem (16px)
--border-radius-full: 9999px (círculo)
```

#### 6. **Shadows** (7 variables)

```css
--shadow-xs: Sombra muy sutil
--shadow-sm: Sombra pequeña
--shadow-md: Sombra media (default cards)
--shadow-lg: Sombra grande (modals)
--shadow-xl: Sombra muy grande (dropdowns)
--shadow-2xl: Sombra extra grande
--shadow-inner: Sombra interna
```

#### 7. **Z-Index** (7 variables)

```css
--z-index-dropdown: 1000
--z-index-sticky: 1020
--z-index-fixed: 1030
--z-index-modal-backdrop: 1040
--z-index-modal: 1050
--z-index-popover: 1060
--z-index-tooltip: 1070
```

Jerarquía predefinida para evitar conflictos.

#### 8. **Transitions** (9 variables)

```css
/* Durations */
--transition-fast: 150ms
--transition-base: 300ms
--transition-slow: 500ms

/* Presets */
--transition-all: all 300ms ease-in-out
--transition-colors: color, bg-color, border-color 150ms
--transition-transform: transform 300ms ease-in-out
--transition-opacity: opacity 150ms ease-in-out
```

### Utilities CSS (80+ clases)

#### Spacing

```css
.m-0, .m-1, .m-2, ... .m-8   /* Margin */
.mt-0, .mt-1, ...            /* Margin Top */
.mb-0, .mb-1, ...            /* Margin Bottom */
.p-0, .p-1, ... .p-8         /* Padding */
```

#### Typography

```css
.text-xs, .text-sm, .text-lg /* Sizes */
.font-light, .font-bold      /* Weights */
.text-primary, .text-muted   /* Colors */
.text-left, .text-center     /* Alignment */
```

#### Display & Flexbox

```css
.flex, .grid, .block         /* Display */
.flex-row, .flex-col         /* Direction */
.items-center, .justify-between /* Alignment */
.gap-1, .gap-2, .gap-4       /* Gap */
```

#### Responsive

```css
.sm\:hidden                  /* Hidden en móvil */
.md\:flex                    /* Flex en tablet+ */
.lg\:grid                    /* Grid en desktop+ */
```

### Uso de Design Tokens

#### En CSS

```css
.mi-componente {
  color: var(--color-primary);
  font-size: var(--font-size-lg);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  transition: var(--transition-all);
}
```

#### Con Utility Classes

```jsx
<div className="p-4 bg-primary text-white rounded-md shadow-lg">
  Contenido
</div>
```

---

## 🧩 Componentes Base

### Button Component ✅ COMPLETADO

**Ubicación**: `/src/components/common/Button/`

#### Estructura de Archivos

```
Button/
├── Button.jsx         # Componente React
├── Button.css         # Estilos específicos
├── Button.stories.jsx # Documentación Storybook
└── index.js           # Export helper
```

#### API del Componente

##### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `children` | `node` | - | Contenido del botón **(requerido)** |
| `variant` | `"primary" \| "secondary" \| "outline" \| "ghost" \| "danger" \| "success" \| "link"` | `"primary"` | Variante visual |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Tamaño del botón |
| `fullWidth` | `boolean` | `false` | Ocupa todo el ancho |
| `disabled` | `boolean` | `false` | Botón deshabilitado |
| `loading` | `boolean` | `false` | Estado de carga |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Tipo HTML |
| `onClick` | `function` | - | Callback de click |
| `leftIcon` | `node` | - | Ícono izquierdo |
| `rightIcon` | `node` | - | Ícono derecho |
| `className` | `string` | `""` | Clases adicionales |

##### Variantes Visuales

1. **Primary**: Botón de acción principal (fondo azul)
2. **Secondary**: Botón de acción secundaria (fondo naranja)
3. **Outline**: Botón con borde sin fondo
4. **Ghost**: Botón sin borde (transparente)
5. **Danger**: Botón de acción destructiva (rojo)
6. **Success**: Botón de confirmación (verde)
7. **Link**: Botón tipo enlace (sin estilos)

##### Tamaños

- **sm**: 32px altura (móvil friendly)
- **md**: 40px altura (default)
- **lg**: 48px altura (CTAs principales)
- **xl**: 56px altura (hero sections)

##### Estados

- **Default**: Estado normal
- **Hover**: Elevación + color oscuro
- **Active**: Sin elevación
- **Disabled**: Opacidad 50%, no interactivo
- **Loading**: Spinner animado, bloqueado

#### Ejemplos de Uso

```jsx
import Button from "@/src/components/common/Button";

// Básico
<Button>Click Me</Button>

// Con variante y tamaño
<Button variant="secondary" size="lg">
  Comprar Ahora
</Button>

// Con ícono
<Button 
  leftIcon={<ShoppingCartIcon />}
  onClick={handleAddToCart}
>
  Agregar al Carrito
</Button>

// Loading
<Button loading disabled>
  Procesando...
</Button>

// Full width
<Button fullWidth variant="primary">
  Continuar
</Button>
```

#### Stories de Storybook

El componente incluye 12 stories:

1. **Primary** - Estado por defecto
2. **Secondary** - Variante secundaria
3. **Outline** - Con borde
4. **Ghost** - Transparente
5. **Danger** - Destructivo
6. **Success** - Confirmación
7. **Link** - Tipo enlace
8. **Sizes** - Todos los tamaños
9. **WithIcons** - Con íconos
10. **Loading** - Estado de carga
11. **Disabled** - Deshabilitado
12. **AllVariants** - Todas las variantes juntas

**Ver en Storybook**: `http://localhost:6006/?path=/story/components-common-button--primary`

---

## 📚 Uso de Storybook

### Iniciar Storybook

```bash
npm run storybook
```

Abre `http://localhost:6006`

### Estructura de Navegación

```
Components/
└── Common/
    └── Button/
        ├── Primary
        ├── Secondary
        ├── Outline
        ├── ...
        └── Playground
```

### Features de Storybook

#### 1. **Canvas**

Visualiza el componente en diferentes variantes.

#### 2. **Controls**

Panel interactivo para cambiar props en tiempo real.

```
Controls Panel:
- variant: [dropdown] primary | secondary | ...
- size: [dropdown] sm | md | lg | xl
- disabled: [checkbox]
- loading: [checkbox]
- fullWidth: [checkbox]
```

#### 3. **Docs**

Documentación auto-generada con:

- Descripción del componente
- Tabla de props
- Ejemplos de uso
- ArgTypes

#### 4. **Actions**

Log de eventos (clicks, hovers, etc.)

#### 5. **Backgrounds**

Cambia el fondo para probar contraste:

- Light (default)
- Dark
- Autonivelante Blue

### Creando Nuevas Stories

Template básico:

```jsx
import MiComponente from "./MiComponente";

export default {
  title: "Components/[Categoría]/MiComponente",
  component: MiComponente,
  tags: ["autodocs"],
  argTypes: {
    // Definir controles
  },
};

export const Default = {
  args: {
    // Props por defecto
  },
};

export const Variant2 = {
  args: {
    // Otra variante
  },
};
```

---

## 🚀 Próximos Pasos

### Fase 2: Componentes Base Restantes (1 semana)

#### 1. **Card Component**

```
/src/components/common/Card/
├── Card.jsx
├── CardHeader.jsx
├── CardBody.jsx
├── CardFooter.jsx
├── Card.css
├── Card.stories.jsx
└── index.js
```

**Variantes**:

- Default
- Elevated (con sombra)
- Outlined (con borde)
- Interactive (hover effect)

**Props**:

- `variant`
- `padding`
- `noPadding`
- `onClick` (para cards clickeables)
- `as` (polimórfico: div, article, section)

#### 2. **Input Component**

```
/src/components/common/Input/
├── Input.jsx
├── Input.css
├── Input.stories.jsx
└── index.js
```

**Características**:

- Label integrado
- Helper text
- Error state
- Disabled state
- Icon support (left/right)
- Different types (text, email, password, number)

#### 3. **Typography Components**

```
/src/components/common/Typography/
├── Heading.jsx      # h1-h6
├── Text.jsx         # p, span
├── Typography.css
├── Typography.stories.jsx
└── index.js
```

#### 4. **Badge Component**

Pequeño indicador visual (new, sale, 50% off, etc.)

#### 5. **Avatar Component**

Foto de perfil o placeholder

#### 6. **Spinner/Loader Component**

Indicador de carga standalone

### Fase 3: Refactorizar Componentes Existentes (1 semana)

#### 1. **Unificar Cards**

**Problema actual**:

- `MainCard.jsx` (productos principales)
- `ProductCard.jsx` (listado)
- `MainHomeCard.jsx` (home)
- `CartProduct.jsx` (carrito)

**Solución**:
Crear `ProductCard` genérico que reemplace todos:

```jsx
<ProductCard
  product={product}
  variant="grid" | "list" | "cart"
  showActions={true}
  onAddToCart={handler}
  onRemove={handler}
/>
```

#### 2. **Unificar Header**

**Problema actual**:

- `Header.jsx`
- `HeaderAux.jsx`

**Solución**:
Un solo componente con prop `variant`:

```jsx
<Header variant="default" | "alternate" />
```

#### 3. **Unificar Menu**

**Problema actual**:

- `Menu.jsx` (desktop)
- `MobileMenu.jsx` (móvil)

**Solución**:
Componente responsive que detecta breakpoint:

```jsx
<Navigation 
  items={menuItems}
  logo={<Logo />}
  variant="horizontal" | "vertical"
/>
```

### Fase 4: Documentación y Testing (3-4 días)

1. **Guía de Estilo** completa en Storybook
2. **Visual Regression Testing** con Chromatic
3. **Accessibility Testing** con addon a11y
4. **Documentation** de patrones de uso

---

## 🎨 Guía de Contribución

### Estructura de Componente

Todo componente base debe seguir esta estructura:

```
ComponentName/
├── ComponentName.jsx          # Lógica del componente
├── ComponentName.css          # Estilos (usa design tokens)
├── ComponentName.stories.jsx  # Storybook stories
├── ComponentName.test.jsx     # Tests (opcional)
└── index.js                   # Export helper
```

### Template de Componente

```jsx
"use client";
import React from "react";
import PropTypes from "prop-types";
import "./ComponentName.css";

/**
 * ComponentName - [Breve descripción]
 * 
 * @component
 * @example
 * ```jsx
 * <ComponentName prop1="value">
 *   Content
 * </ComponentName>
 * ```
 */
const ComponentName = React.forwardRef(
  ({ children, variant = "default", ...props }, ref) => {
    return (
      <div ref={ref} className={`component-name component-${variant}`} {...props}>
        {children}
      </div>
    );
  }
);

ComponentName.displayName = "ComponentName";

ComponentName.propTypes = {
  /** Descripción de children */
  children: PropTypes.node,
  
  /** Descripción de variant */
  variant: PropTypes.oneOf(["default", "otra"]),
};

export default ComponentName;
```

### Convenciones de Estilo CSS

```css
/* Solo usar design tokens */
.component-name {
  color: var(--color-text-primary);          /* ✅ */
  color: #1f2937;                            /* ❌ */
  
  padding: var(--spacing-4);                 /* ✅ */
  padding: 1rem;                             /* ❌ */
  
  transition: var(--transition-colors);      /* ✅ */
  transition: color 0.3s ease;               /* ❌ */
}
```

### Naming Conventions

#### CSS Classes

- **BEM-like**: `.component-name__element--modifier`
- **Utility-first**: Usa utilities cuando sea apropiado

```css
/* Componente */
.btn-component { }

/* Variantes */
.btn-primary { }
.btn-secondary { }

/* Tamaños */
.btn-sm { }
.btn-md { }

/* Estados */
.btn-loading { }
.btn-disabled { }

/* Elementos internos */
.btn-icon { }
.btn-content { }
```

#### Props

- **camelCase**: `fullWidth`, `onClick`, `leftIcon`
- **Boolean props**: Prefijo `is` o `has` cuando sea ambiguo (`isOpen`, `hasError`)
- **Event handlers**: Prefijo `on` (`onClick`, `onChange`)

### Checklist de Componente

Antes de marcar un componente como "completo", verificar:

- [ ] ✅ Componente funciona en todos los casos de uso
- [ ] ✅ Props tienen PropTypes definidos
- [ ] ✅ Componente tiene JSDoc comments
- [ ] ✅ Usa design tokens (no hardcoded values)
- [ ] ✅ Responsive (funciona en mobile, tablet, desktop)
- [ ] ✅ Accesible (keyboard navigation, screen readers)
- [ ] ✅ Storybook stories cubren todos los casos
- [ ] ✅ Documentación clara en stories
- [ ] ✅ Tests unitarios (si aplica)
- [ ] ✅ Export helper (index.js)

---

## 📊 Progreso Actual

### Completado ✅

- [x] Instalación y configuración de Storybook
- [x] Sistema de design tokens (variables.css)
- [x] Utilities CSS (utilities.css)
- [x] Globals CSS (resets y base styles)
- [x] Button Component (completo con 7 variantes)
- [x] Button Stories (12 stories documentadas)
- [x] Documentación inicial

### En Progreso 🔄

- [ ] Card Component
- [ ] Input Component
- [ ] Typography Components

### Pendiente ⏳

- [ ] Badge Component
- [ ] Avatar Component
- [ ] Spinner Component
- [ ] Refactorización de componentes existentes
- [ ] Testing automation
- [ ] Visual regression tests
- [ ] Accessibility audit

### Porcentaje de Completitud

**Fase 1 (Setup)**: ████████████████████ 100%  
**Fase 2 (Base Components)**: ███░░░░░░░░░░░░░░░░░ 15%  
**Fase 3 (Refactoring)**: ░░░░░░░░░░░░░░░░░░░░ 0%  
**Fase 4 (Docs & Testing)**: ░░░░░░░░░░░░░░░░░░░░ 0%  

**Total**: ████░░░░░░░░░░░░░░░░ 20%

---

## 🎓 Recursos y Referencias

### Documentación Oficial

- [Storybook Docs](https://storybook.js.org/docs/react/get-started/introduction)
- [Storybook for Next.js](https://storybook.js.org/docs/react/get-started/nextjs)
- [CSS Variables (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### Inspiración de Sistemas de Diseño

- [Material Design](https://material.io/design)
- [Chakra UI](https://chakra-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/docs/customizing-colors)
- [Radix UI](https://www.radix-ui.com/)

### Tools

- [Coolors (Paleta de colores)](https://coolors.co/)
- [Type Scale (Escalas de tipografía)](https://type-scale.com/)
- [Baseline Grid Calculator](https://baselinecalculator.com/)

---

## 🔧 Troubleshooting

### Storybook no inicia

```bash
# Limpiar caché
rm -rf node_modules/.cache

# Reinstalar dependencias
npm install --legacy-peer-deps

# Reiniciar
npm run storybook
```

### Alias @ no funciona

Verificar `.storybook/main.js`:

```javascript
webpackFinal: async (config) => {
  config.resolve.alias = {
    ...config.resolve.alias,
    "@": require("path").resolve(__dirname, "../"),
  };
  return config;
}
```

### Variables CSS no funcionan

Asegúrate de importar en preview.js:

```javascript
import "../src/styles/globals.css";
```

### Componente no aparece en Storybook

Verificar:

1. Archivo termina en `.stories.jsx`
2. Está en carpeta `/src/**`
3. Tiene export default con `title` y `component`

---

## ✅ Conclusión

El Sistema de Componentes está en marcha con una base sólida:

- ✅ **Infraestructura**: Storybook configurado y funcionando
- ✅ **Design System**: 100+ variables CSS centralizadas
- ✅ **Primer Componente**: Button completo y documentado
- ✅ **Documentación**: Esta guía como referencia

**Próximo Milestone**: Completar componentes base (Card, Input, Typography) en 1 semana.

**Impacto Esperado**:

- 🎨 Consistencia visual mejorada
- 🚀 Velocidad de desarrollo aumentada (reusar componentes)
- 📚 Onboarding más rápido (Storybook como documentación)
- 🛠️ Mantenibilidad simplificada

---

**Firmado**: Desarrollador Junior  
**Fecha**: Marzo 2026  
**Proyecto**: Autonivelante Chile

**Estado**: ✅ **FASE 1 COMPLETADA - CONTINUANDO CON FASE 2**
