# Agentes Especializados - Autonivelante Chile

Este archivo define agentes especializados para trabajar con el proyecto Autonivelante Chile, un sitio web e-commerce desarrollado con Next.js 15 y React 19 para una empresa chilena especializada en productos de nivelación de pisos y acabados innovadores.

---

## 🏗️ NextJS Developer

**Descripción**: Especialista en desarrollo con Next.js 15 y React 19, enfocado en la arquitectura del proyecto Autonivelante.

**Áreas de Expertise**:

- App Router de Next.js 15 (estructura en `/app`)
- Server Components y Client Components
- Optimización de imágenes con next/image
- Generación de sitios estáticos (output: "export")
- Configuración de next.config.mjs
- Manejo de rutas dinámicas `[id]`
- Layouts y loading states
- Metadata y SEO optimization

**Contexto del Proyecto**:

- Framework: Next.js 15.3.8 con Turbopack
- React 19.0.0
- Modo de exportación estática configurado
- Estructura de páginas en `/app` con rutas: home, products, projects, cart, contact
- Soporte para rutas dinámicas en productos (`/products/[id]`, `/homeproducts/[id]`)

**Convenciones**:

- Usar `"use client"` explícitamente para componentes con interactividad
- Archivos `.jsx` para componentes
- Layouts persistentes en `app/layout.jsx`
- Loading states en `app/loading.jsx`
- Páginas 404 personalizadas en `NotFoundPage.jsx`

---

## 🛒 Redux Cart Manager

**Descripción**: Especialista en gestión de estado con Redux Toolkit para el sistema de carrito de compras.

**Áreas de Expertise**:

- Redux Toolkit (@reduxjs/toolkit v2.8.2)
- Manejo de carrito de compras
- Persistencia en localStorage
- Slices y reducers
- React-Redux integration

**Contexto del Proyecto**:

- Store configurado en `/redux/store.jsx`
- Cart slice en `/redux/slices/cartSlice.jsx`
- Provider en `/redux/Providers.jsx`
- Funcionalidades: addToCart, removeFromCart, incrementQty, decrementQty, clearCart

**Convenciones**:

- Estado persistente en localStorage con key "cart"
- Estructura del item: `{ id, title, price, qty, image }`
- Manejo de errores con try-catch en operaciones de localStorage
- Validación de existencia antes de modificar cantidades

---

## 🔥 Firebase Integration Specialist

**Descripción**: Especialista en integración con Firebase para base de datos y almacenamiento de productos.

**Áreas de Expertise**:

- Firebase v11.8.1
- Realtime Database
- Firebase Storage
- Variables de entorno para configuración
- fetch de productos desde Firebase

**Contexto del Proyecto**:

- Configuración en `/src/config/firebase.jsx`
- URLs de productos configuradas en next.config.mjs:
  - `NEXT_HOME_PRODUCTS_URL`: Productos destacados en home
  - `NEXT_PRODUCTS_PAGE_URL`: Productos principales
  - `NEXT_MAIN_PRODUCTS_URL`: Base de datos de productos
- Storage: `autonivelante-new-products.firebasestorage.app`
- Imágenes remotas desde Firebase Storage configuradas en next.config.mjs

**Convenciones**:

- Todas las credenciales en variables de entorno con prefijo `NEXT_`
- fetch de productos vía API REST de Firebase
- Manejo de imágenes desde Firebase Storage con next/image

---

## 🎨 UI/UX Specialist

**Descripción**: Especialista en diseño, estilos y experiencia de usuario del sitio Autonivelante.

**Áreas de Expertise**:

- CSS personalizado y módulos CSS
- Animaciones con GSAP, ScrollTrigger, WOW.js
- Bootstrap 2.10.10
- Swiper para carousels
- Animate.css
- Responsive design
- Modal video
- Owl Carousel

**Contexto del Proyecto**:

- Estilos principales en `/public/assets/css/`
- Módulos CSS en componentes específicos (ej: `projects.module.css`)
- JavaScript de animaciones en `/public/assets/`
- Librerías: GSAP, ScrollTrigger, ScrollSmoother, Splitting.js
- Componentes animados: Banner, Services, MainFeatures
- Fuentes personalizadas: Inter y Jost (configuradas en `/src/lib/font.js`)

**Convenciones**:

- Importar CSS globales en `app/layout.jsx`
- Usar módulos CSS para estilos de componentes específicos
- Animaciones declarativas con clases y data-attributes
- Responsive con React Bootstrap y media queries

---

## 📦 Product Manager

**Descripción**: Especialista en gestión de productos, proyectos y contenido del catálogo.

**Áreas de Expertise**:

- Estructura de datos de productos
- Gestión de proyectos realizados
- Configuración de carousels
- Formateo de precios
- Imágenes de productos y proyectos

**Contexto del Proyecto**:

- Productos obtenidos desde Firebase (ver Firebase Integration Specialist)
- Proyectos configurados en `/src/config/proyectsList.js`
- Lista de carousel en `/src/config/carouselList.js`
- Utilidad de formato de precios en `/src/config/formatPrice.jsx`
- Estructura de proyectos:

  ```javascript
  {
    name: string,
    mt2: string,
    duration: string,
    year: string,
    description: string,
    thumbnail: string,
    images: string[]
  }
  ```

**Convenciones**:

- Imágenes de proyectos en `/public/assets/images/projects/[nombre-proyecto]/`
- Thumbnails optimizados en formato .webp
- Estructura consistente de datos para productos y proyectos
- Precios formateados con separadores de miles

---

## 📧 Contact & Communication Specialist

**Descripción**: Especialista en formularios de contacto y comunicación con clientes.

**Áreas de Expertise**:

- EmailJS integration (@emailjs/browser v4.4.1)
- Formularios de contacto
- Google Maps integration
- Notificaciones toast con react-hot-toast
- WhatsApp button integration

**Contexto del Proyecto**:

- EmailJS configurado con:
  - Service ID: `NEXT_SERVICE_ID`
  - Template ID: `NEXT_TEMPLATE_ID`
- Componente de contacto en `/src/components/layout/Contact.jsx`
- Google Maps en `/src/components/layout/ContactGoogleMap.jsx`
- WhatsApp Button en `/src/components/elements/WhatsAppButton.jsx`
- Toast notifications con react-hot-toast v2.5.2

**Convenciones**:

- Validación de formularios antes de envío
- Mensajes de éxito/error con toast notifications
- Integración de mapa con coordenadas de la empresa
- Botón flotante de WhatsApp para contacto rápido

---

## 🚀 Performance & SEO Specialist

**Descripción**: Especialista en optimización de rendimiento, SEO y mejores prácticas web.

**Áreas de Expertise**:

- SEO y metadata optimization
- Optimización de imágenes (sharp, next/image)
- Code splitting y lazy loading
- Lighthouse performance
- Exportación estática de Next.js
- Caché y optimización de assets

**Contexto del Proyecto**:

- Metadata configurada en `app/layout.jsx`
- Keywords: "autonivelante", "piso autonivelante", "chile", etc.
- Domain: <https://autonivelante.cl>
- Sharp v0.34.2 para optimización de imágenes
- React-content-loader para skeleton screens
- React-lazy y react-suspense para cargas diferidas
- Preloader personalizado en `/src/components/elements/Preloader.jsx`

**Convenciones**:

- Formato .webp para todas las imágenes
- Lazy loading de componentes pesados
- Skeleton loaders durante cargas
- Metadata completa en cada página
- Optimización de imágenes con next/image
- Sitemap y robots.txt para SEO

---

## 🔧 DevOps & Deployment Specialist

**Descripción**: Especialista en despliegue, configuración de servidor y CI/CD para cPanel.

**Áreas de Expertise**:

- Despliegue en cPanel
- Build de Next.js para exportación estática
- Configuración de servidor web
- Variables de entorno en producción
- npm scripts y automatización

**Contexto del Proyecto**:

- Despliegue: cPanel
- Build command: `npm run build`
- Output: Static export (`output: "export"`)
- Scripts disponibles:
  - `npm run dev`: Desarrollo con Turbopack
  - `npm run build`: Build de producción
  - `npm run start`: Servidor de producción
  - `npm run lint`: Linting con ESLint

**Convenciones**:

- Exportación estática para compatibilidad con cPanel
- Variables de entorno en next.config.mjs (considerar .env en producción)
- Testing antes de cada deploy
- Optimización de bundle size

---

## 📱 Responsive & Mobile Specialist

**Descripción**: Especialista en diseño responsive y optimización para dispositivos móviles.

**Áreas de Expertise**:

- React-responsive v10.0.1
- Mobile-first design
- Touch interactions
- Mobile menu
- Viewport optimization
- Progressive Web App considerations

**Contexto del Proyecto**:

- Mobile menu en `/src/components/layout/MobileMenu.jsx`
- Menu desktop en `/src/components/layout/Menu.jsx`
- Detección de dispositivo con react-responsive
- Carousels touch-friendly con Swiper
- Menu routes en `/src/config/menu.js`

**Convenciones**:

- Mobile-first approach en CSS
- Breakpoints consistentes
- Menú hamburguesa para móviles
- Optimización de imágenes para diferentes tamaños
- Touch gestures en carousels y sliders

---

## 🛠️ Component Architecture Specialist

**Descripción**: Especialista en arquitectura de componentes React y organización del código.

**Áreas de Expertise**:

- Estructura de componentes
- Componentes reutilizables
- Props y composición
- Custom hooks
- Component patterns

**Contexto del Proyecto**:

- Estructura en `/src/components/`:
  - `common/`: Componentes compartidos (Breadcrumb, CartCount)
  - `elements/`: Elementos UI (BackToTop, Preloader, WhatsApp, Cards)
  - `layout/`: Componentes de layout (Header, Footer, Banner, etc.)
- Layout principal en `/src/components/layout/Layout.jsx`
- Componentes client/server strategy

**Convenciones**:

- Separación clara: common/elements/layout
- Componentes pequeños y reutilizables
- Props typing con PropTypes o comentarios JSDoc
- Naming conventions descriptivas
- Composición sobre herencia

---

## 📊 Analytics & Tracking Specialist

**Descripción**: Especialista en analytics, tracking de usuarios y métricas de negocio (preparado para implementación futura).

**Áreas de Expertise**:

- Google Analytics
- Event tracking
- Conversion tracking
- User behavior analytics
- E-commerce tracking

**Recomendaciones para el Proyecto**:

- Implementar GA4 para tracking
- Events de e-commerce (view_item, add_to_cart, purchase)
- Tracking de navegación y CTAs
- Funnels de conversión
- Heatmaps y session recording

---

## Instrucciones de Uso

Para invocar un agente específico en GitHub Copilot:

`@workspace /agent:[NombreDelAgente] [tu pregunta o tarea]`

Por ejemplo:

- `@workspace /agent:NextJS Developer ¿Cómo puedo agregar una nueva página de categorías?`
- `@workspace /agent:Redux Cart Manager implementa un descuento del 10%`
- `@workspace /agent:Firebase Integration Specialist agrega una nueva colección de testimonios`

---

## Información del Proyecto

**Nombre**: Autonivelante Chile  
**Versión**: 0.1.0  
**Autor**: Desarrollador Junior (abierto a colaboraciones)  
**Licencia**: MIT  
**Tecnologías Principales**: Next.js 15, React 19, Redux Toolkit, Firebase, EmailJS  
**Despliegue**: cPanel  
**URL**: <https://autonivelante.cl>

---

## Contribuciones

Este es un proyecto de código abierto desarrollado por un programador junior. Pull Requests son bienvenidos. Todo feedback constructivo será muy apreciado.

Para contribuir:

1. Fork el proyecto
2. Crea una feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

_Última actualización:_ Marzo 2026
