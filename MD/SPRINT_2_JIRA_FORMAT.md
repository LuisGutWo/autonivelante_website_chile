# Sprint 2 - Jira Format Ready

**Sprint Goal**: Optimizar SEO, accesibilidad y performance visual para aumentar tráfico orgánico y mejorar experiencia de usuario.

**Duration**: 2 semanas  
**Team Capacity**: Ajustar según equipo  
**Sprint Dates**: [Definir según calendario]  
**Dependencies**: Sprint 1 completado (eventos instrumentados funcionando)

---

## Epic: Experiencia y Descubribilidad

**Epic Key**: `EXP-001`  
**Epic Name**: Mejorar SEO, accesibilidad y performance visual para crecimiento orgánico

---

## Story 5: SEO Optimizado por Detalle de Producto y Proyecto

**Issue Type**: Story  
**Summary**: Implementar metadata dinámica completa en páginas de producto y proyecto  
**Story Points**: 5  
**Priority**: High  
**Labels**: `seo`, `metadata`, `organic-growth`, `frontend`  
**Components**: Frontend, SEO  
**Sprint**: Sprint 2  

### Description

Como empresa, necesitamos mejorar el posicionamiento orgánico de nuestras páginas de productos y proyectos para atraer más tráfico cualificado sin depender únicamente de publicidad pagada.

Actualmente las páginas tienen metadata básica, pero carecen de optimización específica por producto/proyecto, lo que limita nuestra visibilidad en motores de búsqueda y redes sociales.

### Business Value

- **Traffic**: +30-50% de tráfico orgánico esperado en 3 meses
- **CTR**: Mejora de CTR en SERP con titles/descriptions optimizados
- **Social**: Mejor presentación al compartir en redes sociales
- **Authority**: Mayor relevancia semántica para keywords objetivo

### Acceptance Criteria

✅ **AC1**: Cada página `/products/[id]` tiene metadata única:

- `<title>` con formato: "{Nombre Producto} | Autonivelante Chile"
- `<meta name="description">` con keywords y propuesta de valor
- `<link rel="canonical">` correcto

✅ **AC2**: OpenGraph tags completos en productos:

```html
<meta property="og:title" content="{Nombre Producto}" />
<meta property="og:description" content="{Descripción optimizada}" />
<meta property="og:image" content="{URL imagen producto}" />
<meta property="og:url" content="{URL canónica}" />
<meta property="og:type" content="product" />
```

✅ **AC3**: Twitter Card tags implementados:

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{Título}" />
<meta name="twitter:description" content="{Descripción}" />
<meta name="twitter:image" content="{Imagen}" />
```

✅ **AC4**: Página `/projects` tiene metadata descriptiva del catálogo

✅ **AC5**: Validación con herramientas:

- Google Rich Results Test: 0 errores
- Facebook Sharing Debugger: preview correcto
- Twitter Card Validator: preview correcto

✅ **AC6**: No regresión en Lighthouse SEO score (mantener o mejorar)

✅ **AC7**: Build de producción exitoso

### Technical Notes

**Files to modify**:

- `app/products/[id]/page.jsx`
- `app/projects/page.jsx`
- `app/layout.jsx` (metadata helper si aplica)
- `next.config.mjs` (verificar configuración de metadata)

**SEO Keywords Research**:

- "piso autonivelante Chile"
- "nivelación de pisos Santiago"
- "productos autonivelantes construcción"
- [Agregar keywords según investigación]

**Image Requirements**:

- OG image: 1200x630px mínimo
- Alt text descriptivo en todas las imágenes

---

### Subtask 5.1: Auditoría SEO Actual y Gap Analysis

**Issue Type**: Subtask  
**Summary**: Evaluar estado actual de metadata y definir targets  
**Story Points**: 1  
**Assignee**: [SEO Specialist / Frontend Lead]  

**Description**:
Revisar metadata existente, analizar competencia y definir estrategia de optimización.

**Acceptance Criteria**:

- Documento con:
  - Metadata actual por tipo de página
  - Comparativa con 3-5 competidores
  - Keywords objetivo por categoría
  - Templates de titles/descriptions
- Aprobación de stakeholders

**Deliverable**: `docs/seo-strategy-sprint2.md`

---

### Subtask 5.2: Implementar Metadata Dinámica en Páginas de Producto

**Issue Type**: Subtask  
**Summary**: Agregar generación de metadata en app/products/[id]/page.jsx  
**Story Points**: 2  
**Assignee**: [Frontend Developer]  

**Description**:
Usar API de Next.js para generar metadata dinámica por producto.

**Acceptance Criteria**:

- Función `generateMetadata` exportada
- Title y description únicos por producto
- OpenGraph y Twitter Cards completos
- Imagen de producto como og:image
- Canonical URL correcto

**Implementation Example**:

```javascript
export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);
  
  return {
    title: `${product.title} | Autonivelante Chile`,
    description: `${product.description.substring(0, 155)}...`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.image],
      url: `https://autonivelante.cl/products/${params.id}`,
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description,
      images: [product.image],
    },
  };
}
```

---

### Subtask 5.3: Implementar Metadata en Página de Proyectos

**Issue Type**: Subtask  
**Summary**: Optimizar SEO de app/projects/page.jsx  
**Story Points**: 1  
**Assignee**: [Frontend Developer]  

**Description**:
Agregar metadata descriptiva para el catálogo de proyectos realizados.

**Acceptance Criteria**:

- Title y description optimizados
- Keywords relevantes incluidos
- OG tags para compartir en redes

---

### Subtask 5.4: Validación y Pruebas de Metadata

**Issue Type**: Subtask  
**Summary**: Verificar metadata con herramientas de validación  
**Story Points**: 1  
**Assignee**: [QA / SEO Specialist]  

**Description**:
Probar metadata en herramientas oficiales y corregir issues.

**Acceptance Criteria**:

- Checklist de validación completado:
  - [ ] Google Rich Results Test
  - [ ] Facebook Sharing Debugger
  - [ ] Twitter Card Validator
  - [ ] LinkedIn Post Inspector
- Screenshots de previews correctos
- Documento con URLs validadas

---

## Story 6: Structured Data Ampliado (Schema.org)

**Issue Type**: Story  
**Summary**: Implementar schema markup completo para Product, Breadcrumb y LocalBusiness  
**Story Points**: 5  
**Priority**: High  
**Labels**: `seo`, `structured-data`, `schema-org`, `rich-results`  
**Components**: Frontend, SEO  
**Sprint**: Sprint 2  

### Description

Como empresa, necesitamos structured data (JSON-LD) para mejorar la presentación en resultados de búsqueda y habilitar rich snippets que aumenten el CTR orgánico.

El structured data ayuda a Google a entender mejor nuestro contenido y mostrarlo de forma enriquecida (ratings, precio, disponibilidad, breadcrumbs, información local).

### Business Value

- **Visibility**: Rich results destacan más en SERP
- **CTR**: +20-40% de CTR con rich snippets
- **Trust**: Información estructurada genera mayor confianza
- **Voice Search**: Mejor indexación para búsquedas por voz

### Acceptance Criteria

✅ **AC1**: Schema `Product` implementado en `/products/[id]`:

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Nombre del Producto",
  "image": "URL imagen",
  "description": "Descripción",
  "brand": {
    "@type": "Brand",
    "name": "Autonivelante Chile"
  },
  "offers": {
    "@type": "Offer",
    "price": "precio",
    "priceCurrency": "CLP",
    "availability": "https://schema.org/InStock"
  }
}
```

✅ **AC2**: Schema `BreadcrumbList` en todas las páginas internas

✅ **AC3**: Schema `LocalBusiness` en home y páginas clave:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Autonivelante Chile",
  "image": "logo URL",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CL"
  },
  "telephone": "+56971447333",
  "url": "https://autonivelante.cl"
}
```

✅ **AC4**: Validación en Google Rich Results Test: 0 errores críticos

✅ **AC5**: Schema Markup Validator: válido

✅ **AC6**: Componente `StructuredData.tsx` reutilizable y documentado

### Technical Notes

**Files to modify/create**:

- `src/components/common/StructuredData.tsx` (ampliar/refactorizar)
- `app/products/[id]/page.jsx`
- `app/layout.jsx` (LocalBusiness)
- `src/components/common/Breadcrumb/*` (agregar schema)

**Schema Types Priority**:

1. Product (productos)
2. LocalBusiness (home)
3. BreadcrumbList (navegación)
4. Organization (footer/about)

---

### Subtask 6.1: Refactorizar Componente StructuredData

**Issue Type**: Subtask  
**Summary**: Crear componente flexible para múltiples tipos de schema  
**Story Points**: 2  
**Assignee**: [Frontend Developer]  

**Description**:
Ampliar o refactorizar componente existente para soportar Product, LocalBusiness, BreadcrumbList.

**Acceptance Criteria**:

- Componente acepta `type` y `data` como props
- Genera JSON-LD válido
- TypeScript interfaces para cada schema type
- Tests unitarios básicos

---

### Subtask 6.2: Implementar Schema Product en Páginas de Producto

**Issue Type**: Subtask  
**Summary**: Agregar JSON-LD de Product en app/products/[id]/page.jsx  
**Story Points**: 2  
**Assignee**: [Frontend Developer]  

**Description**:
Integrar schema Product con datos reales del producto.

**Acceptance Criteria**:

- Schema renderizado en `<head>` o al final del body
- Datos dinámicos desde Firebase/API
- Validado en Rich Results Test

---

### Subtask 6.3: Implementar Schema LocalBusiness y Breadcrumb

**Issue Type**: Subtask  
**Summary**: Agregar LocalBusiness en home y BreadcrumbList en navegación  
**Story Points**: 1  
**Assignee**: [Frontend Developer]  

**Description**:
Completar schemas para negocio local y breadcrumbs.

**Acceptance Criteria**:

- LocalBusiness con datos de contacto correctos
- BreadcrumbList generado dinámicamente según ruta
- Validado sin errores

---

## Story 7: Accesibilidad Automática en Tests (a11y)

**Issue Type**: Story  
**Summary**: Integrar validación automatizada de accesibilidad en componentes críticos  
**Story Points**: 3  
**Priority**: Medium  
**Labels**: `accessibility`, `a11y`, `testing`, `quality`  
**Components**: QA, Frontend  
**Sprint**: Sprint 2  

### Description

Como empresa responsable, necesitamos garantizar que nuestra web sea accesible para todos los usuarios, incluyendo personas con discapacidades.

La accesibilidad no solo es un requisito legal en muchos países, sino que mejora la experiencia para todos los usuarios y el SEO.

### Business Value

- **Legal**: Reducir riesgo de demandas por accesibilidad
- **UX**: Mejora experiencia para 15%+ de usuarios con necesidades especiales
- **SEO**: Google favorece sitios accesibles
- **Brand**: Demuestra compromiso con inclusión

### Acceptance Criteria

✅ **AC1**: Tests a11y automatizados en componentes críticos:

- `WhatsAppButton`
- `Contact` (formulario)
- `ProductCard`
- `Header/Menu`
- Páginas principales

✅ **AC2**: Herramienta integrada (jest-axe, vitest-axe o similar)

✅ **AC3**: Umbral definido: 0 violaciones críticas permitidas

✅ **AC4**: Tests a11y se ejecutan en CI y bloquean merge si fallan

✅ **AC5**: Documentación de estándares a11y en el proyecto

✅ **AC6**: Fix de violaciones encontradas en componentes auditados

### Technical Notes

**Tools**:

- `vitest-axe` o `jest-axe`
- `@axe-core/react` para debugging en desarrollo

**WCAG Compliance Target**: WCAG 2.1 Level AA

**Files to modify**:

- `vitest.config.ts` (configurar axe)
- Tests de componentes críticos
- Nuevos archivos: `src/tests/a11y/*.test.tsx`

---

### Subtask 7.1: Configuración de Herramienta a11y en Pruebas Suite

**Issue Type**: Subtask  
**Summary**: Instalar y configurar vitest-axe o jest-axe  
**Story Points**: 1  
**Assignee**: [QA Lead / Frontend]  

**Description**:
Integrar herramienta de testing a11y en suite existente.

**Acceptance Criteria**:

- Dependencia instalada
- Helper `toHaveNoViolations` disponible
- Test ejemplo funciona
- Documentación en README

---

### Subtask 7.2: Crear Tests a11y para Componentes Críticos

**Issue Type**: Subtask  
**Summary**: Implementar tests de accesibilidad en componentes clave  
**Story Points**: 2  
**Assignee**: [QA Engineer]  

**Description**:
Agregar checks a11y en tests unitarios de componentes.

**Acceptance Criteria**:

- Al menos 5 componentes con a11y tests
- Tests fallan si hay violaciones críticas
- Cobertura de: forms, navigation, buttons, links

**Example Test**:

```typescript
import { axe, toHaveNoViolations } from 'vitest-axe';
expect.extend(toHaveNoViolations);

it('should have no accessibility violations', async () => {
  const { container } = render(<WhatsAppButton />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

---

## Story 8: Optimización de Imágenes Above-the-Fold

**Issue Type**: Story  
**Summary**: Optimizar carga de imágenes críticas para mejorar LCP y CLS  
**Story Points**: 5  
**Priority**: High  
**Labels**: `performance`, `images`, `core-web-vitals`, `frontend`  
**Components**: Frontend, Performance  
**Sprint**: Sprint 2  

### Description

Como usuario, necesito que la página cargue rápidamente para no abandonar el sitio mientras espero.

Las imágenes above-the-fold (hero, banners) son críticas para el LCP (Largest Contentful Paint). Optimizarlas correctamente puede reducir el LCP en 30-50%.

### Business Value

- **Performance**: LCP < 2.5s (objetivo Core Web Vitals)
- **Retention**: -10-20% de bounce rate con mejor carga
- **SEO**: Core Web Vitals son factor de ranking
- **UX**: Percepción de velocidad mejora satisfacción

### Acceptance Criteria

✅ **AC1**: Imágenes hero/banner usan `priority` en next/image:

```jsx
<Image src="..." priority={true} />
```

✅ **AC2**: Formatos modernos (WebP/AVIF) en imágenes críticas

✅ **AC3**: Tamaños responsivos correctos (srcset optimizado)

✅ **AC4**: Dimensiones explícitas (width/height) para evitar CLS

✅ **AC5**: Lighthouse Performance score mejora en móvil:

- Antes: [baseline]
- Después: +10 puntos mínimo

✅ **AC6**: LCP real (RUM) < 2.5s en 75th percentile

✅ **AC7**: No regresión visual en mobile/desktop

### Technical Notes

**Files to modify**:

- `src/components/layout/Banner.jsx`
- `src/components/layout/FeaturesBanner.jsx`
- `public/assets/images/**` (auditar y optimizar)
- `next.config.mjs` (verificar config de images)

**Tools**:

- ImageOptim / Squoosh para compresión
- Chrome DevTools (Performance, Network)
- PageSpeed Insights / WebPageTest

**Optimization Checklist**:

- [ ] Priority flag en hero images
- [ ] WebP/AVIF con fallback
- [ ] Lazy loading correcto (solo below-the-fold)
- [ ] Blur placeholder para mejor UX
- [ ] Dimensiones explícitas siempre

---

### Subtask 8.1: Auditoría de Imágenes Above-the-Fold Actual

**Issue Type**: Subtask  
**Summary**: Identificar todas las imágenes críticas y su estado actual  
**Story Points**: 1  
**Assignee**: [Frontend / Performance Engineer]  

**Description**:
Listar imágenes above-the-fold, medir tamaño/formato actual y calcular potencial de mejora.

**Acceptance Criteria**:

- Tabla con:
  - Ruta del archivo
  - Componente que lo usa
  - Dimensiones actuales
  - Formato actual
  - Peso actual
  - Uso de priority/lazy
- Priorización por impacto en LCP

---

### Subtask 8.2: Optimizar y Convertir Imágenes a Formatos Modernos

**Issue Type**: Subtask  
**Summary**: Comprimir y generar versiones WebP/AVIF de imágenes críticas  
**Story Points**: 2  
**Assignee**: [Frontend Developer]  

**Description**:
Procesar imágenes hero/banner para reducir peso sin perder calidad.

**Acceptance Criteria**:

- Imágenes críticas en WebP (y AVIF si posible)
- Reducción de 40%+ en peso
- Calidad visual sin degradación notable
- Fallback a formato original si aplica

---

### Subtask 8.3: Implementar priority y Dimensiones Explícitas

**Issue Type**: Subtask  
**Summary**: Ajustar componentes Banner y FeaturesBanner con optimizaciones  
**Story Points**: 1  
**Assignee**: [Frontend Developer]  

**Description**:
Agregar props `priority`, `width`, `height` en next/image de componentes críticos.

**Acceptance Criteria**:

- `priority={true}` en imágenes above-the-fold
- width/height explícitos para evitar CLS
- Sizes optimizados para responsive

---

### Subtask 8.4: Validación de Performance y LCP

**Issue Type**: Subtask  
**Summary**: Medir mejora en Lighthouse y RUM  
**Story Points**: 1  
**Assignee**: [QA / Performance Engineer]  

**Description**:
Validar que optimizaciones mejoran métricas reales.

**Acceptance Criteria**:

- Lighthouse antes/después documentado
- LCP mejora en al menos 0.5s
- CLS sin regresión
- Tests visuales pasan sin cambios

---

## Sprint 2 Dependencies & Blockers

| Dependency | Description | Owner | Risk |
|------------|-------------|-------|------|
| Firebase product data | Necesario para metadata dinámica | Backend | Low |
| SEO keywords research | Define titles/descriptions | Marketing | Medium |
| Image assets originales | Para reoptimizar en formatos modernos | Design | Low |
| GA4 access | Para validar mejoras de tráfico | Analytics | Low |

---

## Sprint 2 Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Schema markup incorrecto causa warnings | Medium | Medium | Validación rigurosa con Google tools |
| Optimización de imágenes degrada calidad visual | Low | High | QA visual exhaustivo antes de merge |
| Tests a11y revelan muchas violaciones existentes | Medium | Medium | Priorizar fixes críticos, resto a backlog |
| SEO improvements tardan meses en verse | High | Low | Expectativa clara: resultados en 2-3 meses |

---

## Sprint 2 Métricas de éxito

✅ **Velocity**: 18 Story Points completados  
✅ **SEO Readiness**: 100% de páginas clave con metadata completa  
✅ **Accessibility**: 0 violaciones críticas en componentes auditados  
✅ **Performance**: +10 puntos Lighthouse móvil, LCP < 2.5s  
✅ **Quality**: 0 errores de structured data en Rich Results Test  
✅ **Coverage**: Tests a11y automatizados en CI  

---

## Sprint 2 Ceremony Schedule (Ejemplo)

**Sprint Planning**: [Fecha] 2h  
**Daily Standup**: Diario 15min  
**Mid-Sprint Check-in**: [Fecha mitad sprint] 1h  
**Sprint Review**: [Fecha final] 1h  

- Demo: Metadata en acción (compartir en redes)
- Demo: Rich results preview
- Demo: Lighthouse score improvement  
**Sprint Retrospective**: [Fecha final] 1h  

---

## Checklist de validación post-sprint 2
**SEO Validation**:

- [ ] Google Search Console sin errores de structured data
- [ ] Metadata preview correcto en todas las herramientas
- [ ] Canonical URLs sin duplicados
- [ ] Rich Results Test: valid para Product schema

**Performance Validation**:

- [ ] Lighthouse móvil: Performance > 85
- [ ] LCP < 2.5s en PageSpeed Insights
- [ ] CLS < 0.1
- [ ] No lazy loading en images above-the-fold

**Accessibility Validation**:

- [ ] Tests a11y pasan en CI
- [ ] Manual audit con lector de pantalla (NVDA/VoiceOver)
- [ ] Keyboard navigation funciona en todos los flows críticos
- [ ] Color contrast ratios cumplen WCAG AA

---

## Handoff to Sprint 3

**Completed**:

- Metadata y structured data implementados
- Performance visual optimizado
- Tests a11y integrados

**Ready for Sprint 3**:

- B9: Unificar tokens visuales (CSS)
- B10: Cerrar migración TS
- B11: Observabilidad de errores
- B12: Experimentación A/B

**Insights para Sprint 3**:

- Datos de conversión de Sprint 1 ya disponibles para priorizar experimentos
- Baseline de performance establecido para medir optimizaciones futuras
- A11y infrastructure lista para ampliar cobertura

---

**Document Version**: 1.0  
**Last Updated**: 9 marzo 2026  
**Owner**: [Tech Lead / Scrum Master]  
**Previous Sprint**: [SPRINT_1_JIRA_FORMAT.md](SPRINT_1_JIRA_FORMAT.md)
