# Sprint 3 - Jira Format Ready

**Sprint Goal**: Reducir deuda técnica, unificar sistema de diseño y habilitar observabilidad para mantener velocidad de desarrollo.

**Duration**: 2 semanas  
**Team Capacity**: Ajustar según equipo  
**Sprint Dates**: [Definir según calendario]  
**Dependencies**: Sprint 1 y 2 completados (eventos + SEO funcionando)

---

## Epic: Estabilidad y Escalabilidad

**Epic Key**: `TECH-001`  
**Epic Name**: Reducir deuda técnica y mejorar mantenibilidad del codebase

---

## Story 9: Sistema de Design Tokens Unificado

**Issue Type**: Story  
**Summary**: Consolidar variables de diseño (colores, spacing, sombras, radios) en sistema de tokens reutilizable  
**Story Points**: 5  
**Priority**: Medium  
**Labels**: `design-system`, `css`, `dx`, `maintainability`  
**Components**: Frontend, Design  
**Sprint**: Sprint 3  

### Description

Como desarrollador frontend, necesito un sistema de tokens de diseño centralizado para:

- Eliminar valores hardcoded duplicados en CSS
- Acelerar implementación de cambios visuales
- Mantener consistencia visual cross-componente
- Facilitar theming futuro

Actualmente tenemos valores duplicados de colores, spacing, sombras y radios en múltiples archivos CSS, lo que hace difícil mantener coherencia visual y ralentiza cambios de diseño.

### Business Value

- **Dev Speed**: -50% tiempo para cambios visuales globales
- **Consistency**: Interfaz más coherente mejora percepción de marca
- **Maintenance**: Menos bugs visuales por inconsistencias
- **Scalability**: Base para theming (dark mode, branding multi-tenant)

### Acceptance Criteria

✅ **AC1**: Archivo de tokens CSS Variables creado:

```css
/* src/styles/tokens.css */
:root {
  /* Colors */
  --color-primary: #015c93;
  --color-primary-dark: #014a6f;
  --color-success: #25d366;
  --color-text: #333333;
  --color-bg: #ffffff;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.15);
  --shadow-lg: 0 8px 16px rgba(0,0,0,0.2);
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.3s ease;
  --transition-slow: 0.5s ease;
}
```

✅ **AC2**: Al menos 5 archivos CSS refactorizados usando tokens:

- `public/assets/css/elements-css/contact.css`
- `public/assets/css/elements-css/productcard.css`
- Otros archivos con valores hardcoded

✅ **AC3**: Reducción medible de valores duplicados:

- Antes: [X valores únicos de color/spacing]
- Después: < 20% de valores hardcoded restantes

✅ **AC4**: Documentación de sistema de tokens:

- Guía de uso para desarrolladores
- Showcase visual de tokens disponibles

✅ **AC5**: No regresión visual en ninguna página (QA visual completo)

✅ **AC6**: Build de producción exitoso

✅ **AC7**: Performance CSS sin degradación (tamaño bundle igual o menor)

### Technical Notes

**Files to create**:

- `src/styles/tokens.css` (nuevo)
- `docs/design-tokens.md` (documentación)

**Files to refactor**:

- `public/assets/css/elements-css/contact.css`
- `public/assets/css/elements-css/productcard.css`
- `public/assets/css/style.css`
- Otros archivos con valores hardcoded

**Strategy**:

1. Auditoría de valores actuales
2. Definir nomenclatura de tokens
3. Migración incremental por componente
4. QA visual tras cada batch

**Tools**:

- CSS Variables (nativo)
- PostCSS (si se requiere procesamiento adicional)

---

### Subtask 9.1: Auditoría de Valores CSS Actuales

**Issue Type**: Subtask  
**Summary**: Inventariar colores, spacing, sombras y radios en uso  
**Story Points**: 1  
**Assignee**: [Frontend Lead / Designer]  

**Description**:
Extraer todos los valores de diseño utilizados actualmente para identificar patrones y normalizar.

**Acceptance Criteria**:

- Documento con:
  - Lista de colores únicos y su frecuencia
  - Valores de spacing usados
  - Box shadows en uso
  - Border radius variants
- Propuesta de nomenclatura de tokens
- Identificación de valores a deprecar

**Deliverable**: `docs/css-audit-tokens.md`

---

### Subtask 9.2: Crear Archivo de Design Tokens

**Issue Type**: Subtask  
**Summary**: Implementar src/styles/tokens.css con CSS Variables  
**Story Points**: 1  
**Assignee**: [Frontend Developer]  

**Description**:
Crear archivo centralizado con todas las CSS Variables definidas.

**Acceptance Criteria**:

- Archivo `src/styles/tokens.css` creado
- Importado en `app/layout.jsx` o entry point
- Tokens organizados por categoría
- Comentarios descriptivos por sección

---

### Subtask 9.3: Refactorizar Archivos CSS Críticos

**Issue Type**: Subtask  
**Summary**: Migrar contact.css y productcard.css a usar tokens  
**Story Points**: 2  
**Assignee**: [Frontend Developer]  

**Description**:
Reemplazar valores hardcoded por CSS Variables en archivos prioritarios.

**Acceptance Criteria**:

- `contact.css` usa tokens para colores, spacing, sombras
- `productcard.css` refactorizado con tokens
- Git diff muestra reducción neta de valores mágicos
- QA visual pasa sin cambios

**Example**:

```css
/* Antes */
.btn-wsp {
  background-color: #25d366;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;
}

/* Después */
.btn-wsp {
  background-color: var(--color-success);
  box-shadow: var(--shadow-lg);
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}
```

---

### Subtask 9.4: Documentar y Validar Sistema de Tokens

**Issue Type**: Subtask  
**Summary**: Crear guía de uso y showcases visuales  
**Story Points**: 1  
**Assignee**: [Frontend / Designer]  

**Description**:
Documentar sistema para que todo el equipo lo adopte consistentemente.

**Acceptance Criteria**:

- `docs/design-tokens.md` con:
  - Lista completa de tokens disponibles
  - Ejemplos de uso
  - Cuándo crear nuevos tokens vs reutilizar
- Página showcase opcional (ej: Storybook) con tokens visualizados
- Presentación al equipo completada

---

## Story 10: Cerrar Migración TypeScript Completa

**Issue Type**: Story  
**Summary**: Eliminar archivos JS/JSX remanentes y finalizar migración a TypeScript  
**Story Points**: 5  
**Priority**: Medium  
**Labels**: `typescript`, `migration`, `technical-debt`, `dx`  
**Components**: Frontend  
**Sprint**: Sprint 3  

### Description

Como desarrollador, necesito un codebase 100% TypeScript para:

- Prevenir errores de tipos en development y build
- Mejorar autocompletado y DX en IDE
- Facilitar refactoring seguro con garantías de tipo
- Reducir bugs en producción

Actualmente quedan archivos `.jsx` y `.js` no migrados, creando inconsistencia y potencialmente permitiendo errores que TS previene.

### Business Value

- **Quality**: -20-30% bugs relacionados a tipos
- **Dev Speed**: Refactoring más rápido con confianza
- **Onboarding**: Nuevos devs entienden el código más fácil
- **Maintenance**: Menos documentación necesaria (tipos son docs)

### Acceptance Criteria

✅ **AC1**: 0 archivos `.jsx` funcionales en `src/` (excepto Storybook)

✅ **AC2**: 0 archivos `.js` en `src/components/` y `src/lib/`

✅ **AC3**: `tsconfig.json` con `allowJs: false` y `strict: true`

✅ **AC4**: Todos los componentes migrados tienen:

- Props tipadas con interface/type
- No uso de `any` (excepto casos justificados)
- Event handlers tipados correctamente

✅ **AC5**: Build de producción sin warnings de TS

✅ **AC6**: Tests pasan sin regresión (82/82 o equivalente)

✅ **AC7**: Documentación actualizada reflejando stack TS

### Technical Notes

**Migration Strategy**:

1. Identificar archivos JS/JSX restantes
2. Priorizar por criticidad y acoplamiento
3. Migrar batch por batch con tests
4. Endurecer tsconfig progresivamente

**Files likely to migrate** (basado en auditoría previa):

- Archivos de configuración si aplica
- Componentes legacy no migrados
- Utilities/helpers sin tipos

**Verification**:

```bash
# Comando para listar JS/JSX restantes
find src -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v .stories.jsx
```

---

### Subtask 10.1: Auditoría Final de Archivos JS/JSX

**Issue Type**: Subtask  
**Summary**: Listar todos los archivos JS/JSX pendientes de migración  
**Story Points**: 1  
**Assignee**: [Frontend Lead]  

**Description**:
Identificar exactamente qué archivos quedan por migrar y priorizar.

**Acceptance Criteria**:

- Lista completa con ruta de cada archivo
- Clasificación por:
  - Criticidad (core, feature, util)
  - Acoplamiento (alto, medio, bajo)
  - Esfuerzo estimado
- Plan de migración por batches

**Deliverable**: `docs/ts-migration-final.md`

---

### Subtask 10.2: Migrar Batch 1 (Alta Prioridad)

**Issue Type**: Subtask  
**Summary**: Convertir archivos críticos a TypeScript  
**Story Points**: 2  
**Assignee**: [Frontend Developer]  

**Description**:
Migrar archivos de alta prioridad/uso frecuente.

**Acceptance Criteria**:

- Archivos críticos migrados a `.tsx`/`.ts`
- Props tipadas con interfaces
- Tests actualizados y pasando
- No uso de `any` sin justificación
- Sin errores de TS en archivos migrados

---

### Subtask 10.3: Migrar Batch 2 (Media/Baja Prioridad)

**Issue Type**: Subtask  
**Summary**: Convertir archivos restantes a TypeScript  
**Story Points**: 1  
**Assignee**: [Frontend Developer]  

**Description**:
Completar migración de archivos secundarios.

**Acceptance Criteria**:

- Todos los archivos funcionales migrados
- Solo quedan `.stories.jsx` (si aplica)
- tsconfig sin `allowJs`
- Build exitoso

---

### Subtask 10.4: Endurecer tsconfig y Validación Final

**Issue Type**: Subtask  
**Summary**: Activar strict mode y validar calidad de tipos  
**Story Points**: 1  
**Assignee**: [Frontend Lead]  

**Description**:
Fortalecer configuración de TS para máxima seguridad.

**Acceptance Criteria**:

- `tsconfig.json` con:

  ```json
  {
    "compilerOptions": {
      "strict": true,
      "allowJs": false,
      "noImplicitAny": true,
      "strictNullChecks": true
    }
  }
  ```

- 0 errores de build
- Documento con estadísticas:
  - Archivos migrados
  - % cobertura de tipos
  - Reducción de `any`

---

## Story 11: Observabilidad de Errores (Cliente y Servidor)

**Issue Type**: Story  
**Summary**: Implementar captura y monitoreo de errores con Sentry o alternativa  
**Story Points**: 5  
**Priority**: High  
**Labels**: `monitoring`, `observability`, `production`, `devops`  
**Components**: Fullstack, DevOps  
**Sprint**: Sprint 3  

### Description

Como equipo técnico, necesitamos visibilidad sobre errores en producción para:

- Detectar issues antes de que usuarios los reporten masivamente
- Priorizar fixes con datos de frecuencia/impacto
- Reducir MTTR (Mean Time To Resolution)
- Entender contexto completo de errores (stack, user, environment)

Actualmente, errores en producción solo se detectan cuando usuarios reportan o revisamos logs manualmente.

### Business Value

- **Uptime**: Detección temprana reduce downtime acumulado
- **UX**: Usuarios experimentan menos bugs (fix proactivo)
- **Efficiency**: -40-60% tiempo en debugging
- **Trust**: Postura proactiva mejora confianza de usuarios

### Acceptance Criteria

✅ **AC1**: Herramienta de monitoring integrada (Sentry, Rollbar, LogRocket, etc.)

✅ **AC2**: Errores de cliente capturados automáticamente:

- JavaScript exceptions
- Unhandled promise rejections
- React error boundaries
- Network errors (fetch/API)

✅ **AC3**: Errores de servidor capturados:

- API route exceptions
- Next.js server errors
- Edge function errors

✅ **AC4**: Context enriquecido en cada error:

- User ID (si está autenticado)
- Browser/OS/Device
- URL y ruta
- Breadcrumbs de acciones previas
- Custom tags (feature, component)

✅ **AC5**: Alertas configuradas para errores críticos:

- Slack/email notification
- Threshold: >X errores en Y minutos

✅ **AC6**: Dashboard accesible para todo el equipo

✅ **AC7**: Source maps configurados para stack traces legibles

✅ **AC8**: Performance sin degradación (< 50ms overhead)

### Technical Notes

**Tool Selection**:

- **Sentry** (recomendado): Open source, buena integración Next.js
- **Rollbar**: Alternativa similar
- **LogRocket**: Incluye session replay (más caro)
- **Bugsnag**: Opción enterprise

**Files to modify**:

- `app/layout.jsx` (error boundary + Sentry init)
- `next.config.mjs` (Sentry plugin si aplica)
- API routes (error handlers)
- `.env.local` y `.env.production` (DSN y config)

**Implementation Example (Sentry)**:

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    // Filter sensitive data
    return event;
  }
});
```

---

### Subtask 11.1: Evaluación y Configuración de Herramienta

**Issue Type**: Subtask  
**Summary**: Seleccionar tool de monitoring e instalar dependencias  
**Story Points**: 1  
**Assignee**: [DevOps / Tech Lead]  

**Description**:
Comparar opciones, crear cuenta y configurar proyecto.

**Acceptance Criteria**:

- Tool seleccionado con justificación
- Cuenta/proyecto creado
- DSN y keys obtenidos
- Dependencias instaladas
- Configuración base funcionando en dev

**Deliverable**: `docs/monitoring-setup.md`

---

### Subtask 11.2: Integración Client-Side

**Issue Type**: Subtask  
**Summary**: Configurar captura de errores en cliente (browser)  
**Story Points**: 2  
**Assignee**: [Frontend Developer]  

**Description**:
Integrar SDK en aplicación Next.js para capturar errores de cliente.

**Acceptance Criteria**:

- Sentry (o tool elegido) inicializado en client
- Error boundaries React configurados
- Errores no manejados capturados
- Test manual: forzar error y verificar en dashboard
- Source maps cargados correctamente

---

### Subtask 11.3: Integración Server-Side

**Issue Type**: Subtask  
**Summary**: Configurar captura de errores en API routes y SSR  
**Story Points**: 1  
**Assignee**: [Backend / Fullstack Developer]  

**Description**:
Integrar captura de errores en rutas de servidor.

**Acceptance Criteria**:

- Sentry inicializado en server/edge
- try-catch en API routes con logging
- Errores de SSR capturados
- Test manual: forzar error de API y verificar

---

### Subtask 11.4: Configurar Alertas y Dashboard

**Issue Type**: Subtask  
**Summary**: Setup de notificaciones y accesos para el equipo  
**Story Points**: 1  
**Assignee**: [DevOps / Tech Lead]  

**Description**:
Configurar notificaciones y dar acceso al equipo.

**Acceptance Criteria**:

- Slack/email alerts configurados
- Thresholds definidos (ej: >10 errores/5min)
- Todos los devs tienen acceso al dashboard
- Documentación de cómo usar la herramienta
- Runbook básico para responder a alertas

---

## Story 12: Experimentación A/B Framework Base

**Issue Type**: Story  
**Summary**: Implementar infraestructura básica para experimentos A/B en CTAs y conversion  
**Story Points**: 3  
**Priority**: Low  
**Labels**: `experimentation`, `ab-testing`, `optimization`, `product`  
**Components**: Frontend, Product  
**Sprint**: Sprint 3  

### Description

Como equipo de producto, necesitamos capacidad de experimentar con cambios en UI y copy para optimizar conversión de forma data-driven.

Sin infraestructura de A/B testing, cambios se hacen "a ciegas" sin validar si mejoran o empeoran métricas clave.

### Business Value

- **Optimization**: Mejoras basadas en datos, no suposiciones
- **Risk Reduction**: Cambios validados antes de full rollout
- **Learning**: Cultura de experimentación continua
- **ROI**: Inversión en features con mayor impacto probado

### Acceptance Criteria

✅ **AC1**: Librería o framework de A/B testing integrado (ej: Posthog, GrowthBook, feature flags)

✅ **AC2**: Primer experimento implementado y funcionando:

- **Hipótesis ejemplo**: "Cambiar orden de botones en WhatsAppButton mejora clicks en Llamar"
- Variante A: Orden actual
- Variante B: Llamar primero, WhatsApp segundo

✅ **AC3**: Tracking de assignment y conversión:

- Evento `experiment_viewed` con variant
- Métricas de éxito definidas y trackeadas

✅ **AC4**: Dashboard muestra resultados del experimento:

- Conversión por variante
- Significancia estadística
- Sample size suficiente

✅ **AC5**: Documentación de cómo crear nuevos experimentos

✅ **AC6**: No degradación de performance (< 20ms overhead)

### Technical Notes

**Tool Options**:

- **GrowthBook** (open source, self-hosted posible)
- **Posthog** (all-in-one, incluye analytics)
- **LaunchDarkly** (enterprise, feature flags)
- **Optimizely** (caro, full-featured)

**Implementation Pattern**:

```typescript
// useExperiment hook example
const { variant } = useExperiment('cta-button-order');

if (variant === 'B') {
  return <PhoneFirstCTA />;
}
return <WhatsAppFirstCTA />;
```

**Success Metrics Example**:

- Primary: Click rate en botón Llamar
- Secondary: Overall contact rate
- Guardrail: Bounce rate no aumenta

---

### Subtask 12.1: Selección e Integración de Framework

**Issue Type**: Subtask  
**Summary**: Evaluar tools y setup de infraestructura base  
**Story Points**: 1  
**Assignee**: [Product / Tech Lead]  

**Description**:
Comparar opciones y configurar herramienta elegida.

**Acceptance Criteria**:

- Tool seleccionado con pros/cons
- SDK instalado y configurado
- Primer feature flag de prueba funcional
- Documentación básica

---

### Subtask 12.2: Implementar Primer Experimento (CTA Order)

**Issue Type**: Subtask  
**Summary**: Crear experimento de orden de botones en WhatsAppButton  
**Story Points**: 1  
**Assignee**: [Frontend Developer]  

**Description**:
Implementar lógica de variantes y tracking.

**Acceptance Criteria**:

- Código con variante A y B
- Asignación aleatoria 50/50
- Evento `experiment_viewed` disparado
- Evento de conversión trackeado
- QA manual de ambas variantes

---

### Subtask 12.3: Análisis y Documentación de Resultados

**Issue Type**: Subtask  
**Summary**: Evaluar resultado del experimento y crear playbook  
**Story Points**: 1  
**Assignee**: [Product / Analytics]  

**Description**:
Analizar datos y documentar proceso para futuros experimentos.

**Acceptance Criteria**:

- Resultado del experimento documentado
- Decisión de ganador o rollback
- Playbook: "Cómo crear un experimento A/B"
- Presentación al equipo

---

## Sprint 3 Dependencies & Blockers

| Dependency | Description | Owner | Risk |
|------------|-------------|-------|------|
| Auditoría CSS completa | Necesaria antes de crear tokens | Design/Frontend | Low |
| Listado final de archivos JS/JSX | Para cerrar migración TS | Frontend Lead | Low |
| Acceso a Sentry/monitoring tool | Configuración de cuentas | DevOps | Medium |
| Definición de experimento A/B | Hipótesis clara del producto | Product | Low |

---

## Sprint 3 Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Refactor CSS introduce regresiones visuales | Medium | High | QA visual exhaustivo, screenshots automatizados |
| Migración TS rompe builds por tipos complejos | Medium | Medium | Migración incremental, tests en cada paso |
| Overhead de monitoring afecta performance | Low | Medium | Configurar sample rate adecuado, medir impacto |
| Tool de A/B testing resulta complejo de usar | Medium | Low | Empezar con herramienta simple (feature flags) |
| Refactors toman más tiempo que estimado | Medium | Medium | Timebox estricto, priorizar lo crítico |

---

## Sprint 3 Métricas de éxito

✅ **Velocity**: 18 Story Points completados  
✅ **Code Quality**: 100% TypeScript en src/ (allowJs: false)  
✅ **Design Consistency**: >80% de valores CSS usando tokens  
✅ **Observability**: 100% errores críticos capturados en monitoring  
✅ **Experimentation**: 1 experimento A/B funcionando con datos reales  
✅ **Technical Debt**: -30% deuda técnica medida (archivos legacy, valores hardcoded)  

---

## Sprint 3 Ceremony Schedule

**Sprint Planning**: [Fecha] 2h  
**Daily Standup**: Diario 15min  
**Mid-Sprint Check-in**: [Fecha mitad sprint] 1h  
**Sprint Review**: [Fecha final] 1h  

- Demo: Sistema de tokens en acción (cambio global de color live)
- Demo: Dashboard de errores con ejemplos reales
- Demo: Experimento A/B funcionando  
**Sprint Retrospective**: [Fecha final] 1.5h (incluir retro de 3 sprints)  

---

## Checklist de validación post-sprint 3
**Technical Debt Reduction**:

- [ ] 0 archivos`.jsx` funcionales en src/ (excepto Storybook)
- [ ] tsconfig con `allowJs: false` y `strict: true`
- [ ] Build sin warnings de TypeScript
- [ ] >80% valores CSS usando tokens

**Observability**:

- [ ] Errores client-side capturados en monitoring tool
- [ ] Errores server-side capturados
- [ ] Alertas configuradas y probadas
- [ ] Source maps funcionando correctamente
- [ ] Equipo tiene acceso al dashboard

**Design System**:

- [ ] Archivo `tokens.css` creado e importado
- [ ] Al menos 5 archivos CSS refactorizados
- [ ] Documentación de tokens disponible
- [ ] 0 regresiones visuales reportadas

**Experimentation**:

- [ ] Framework A/B integrado
- [ ] Primer experimento con resultados
- [ ] Playbook documentado
- [ ] Métricas de conversión trackeadas

---

## Retrospective Focus Points (Sprint 1-3)

**Themes to discuss**:

1. **Velocity**: ¿Mantuvimos estimaciones consistentes?
2. **Quality**: ¿Tests automatizados previenen regresiones?
3. **Collaboration**: ¿Frontend/Backend/QA colaboran eficientemente?
4. **Technical Decisions**: ¿Elección de tools fue acertada?
5. **Process**: ¿Ceremonias agregan valor o son overhead?

**Celebrate**:

- 3 sprints completados sin major incidents
- Instrumentación y observabilidad habilitadas
- Deuda técnica reducida significativamente
- Base sólida para crecimiento futuro

---

## Handoff to Sprint 4+

**Foundation Ready**:

- ✅ Eventos de negocio instrumentados
- ✅ SEO y structured data optimizados
- ✅ Performance visual mejorada
- ✅ Codebase 100% TypeScript
- ✅ Design tokens unificados
- ✅ Observabilidad de errores
- ✅ Framework de experimentación

**Next Phase (Sprint 4+) Suggestions**:

1. **Mobile-first optimization deep dive**
   - PWA capabilities
   - Offline support
   - App-like interactions

2. **Checkout flow optimization**
   - Multi-step wizard
   - Payment integrations
   - Abandoned cart recovery

3. **Content Management**
   - Admin panel para productos/proyectos
   - CMS headless integration
   - Content versioning

4. **Advanced Analytics**
   - Cohort analysis
   - Funnel optimization
   - Session replay integration

5. **Internationalization** (si aplica)
   - Multi-language support
   - Currency conversion
   - Regional pricing

---

## Technical Debt Metrics (Post-Sprint 3)

**Before Sprint 1-3**:

- JS/JSX files: ~X archivos
- TS strict: false
- Hardcoded values: ~Y instancias
- Error monitoring: 0%
- A/B testing: No disponible

**After Sprint 3**:

- JS/JSX files: 0 (funcionales)
- TS strict: true
- Hardcoded values: <20%
- Error monitoring: 100%
- A/B testing: Framework activo

**ROI Estimated**:

- Dev velocity: +30-40% en futuros sprints
- Bug detection: -50-60% tiempo en debugging
- Design changes: -50% tiempo para cambios globales
- Confidence in deploys: Alta (tests + monitoring)

---

**Document Version**: 1.0  
**Last Updated**: 9 marzo 2026  
**Owner**: [Tech Lead / Scrum Master]  
**Previous Sprints**:  

- [SPRINT_1_JIRA_FORMAT.md](SPRINT_1_JIRA_FORMAT.md)  
- [SPRINT_2_JIRA_FORMAT.md](SPRINT_2_JIRA_FORMAT.md)
