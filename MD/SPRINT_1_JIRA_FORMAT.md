# Sprint 1 - Jira Format Ready

**Sprint Goal**: Instrumentar eventos críticos y endurecer flujo de contacto para decisiones basadas en datos con riesgo bajo.

**Duration**: 2 semanas  
**Team Capacity**: Ajustar según equipo  
**Sprint Dates**: [Definir según calendario]

---

## Epic: Conversión y Trazabilidad Comercial

**Epic Key**: `CONV-001`  
**Epic Name**: Aumentar conversión mediante instrumentación y optimización de CTAs

---

## Story 1: Instrumentación Base de Eventos de Negocio

**Issue Type**: Story  
**Summary**: Instrumentar eventos críticos del embudo comercial (view_item, add_to_cart, contact_click)  
**Story Points**: 5  
**Priority**: High  
**Labels**: `analytics`, `tracking`, `frontend`, `data-driven`  
**Components**: Frontend, Analytics  
**Sprint**: Sprint 1  

### Description

Como equipo de negocio, necesitamos medir eventos clave del embudo de conversión para tomar decisiones informadas sobre dónde invertir esfuerzos de optimización.

Actualmente no tenemos visibilidad clara sobre:

- Qué productos generan más interés
- Qué canal de contacto prefieren los usuarios (WhatsApp, teléfono, formulario)
- Dónde abandonan el proceso de compra
- Diferencias de comportamiento entre dispositivos

### Acceptance Criteria

✅ **AC1**: Se disparan eventos `view_item` al ver detalle de producto con payload:

```javascript
{
  event: 'view_item',
  product_id: string,
  product_name: string,
  price: number,
  category: string
}
```

✅ **AC2**: Se disparan eventos `add_to_cart` al agregar producto con payload:

```javascript
{
  event: 'add_to_cart',
  product_id: string,
  product_name: string,
  price: number,
  quantity: number
}
```

✅ **AC3**: Se disparan eventos `contact_click` en todos los canales con payload:

```javascript
{
  event: 'contact_click',
  method: 'whatsapp' | 'phone' | 'contact_form',
  source: 'floating_panel' | 'contact_page',
  device_type: 'mobile' | 'desktop'
}
```

✅ **AC4**: Existe helper centralizado de tracking (`src/lib/analytics.ts`) documentado

✅ **AC5**: Los eventos no se duplican en un mismo ciclo de usuario

✅ **AC6**: Tests unitarios pasan sin regresión

✅ **AC7**: Build de producción exitoso

### Technical Notes

**Files to modify**:

- `src/lib/analytics.ts` (crear nuevo)
- `src/components/elements/WhatsAppButton.tsx`
- `src/components/layout/Contact.tsx`
- `app/products/[id]/page.jsx`
- `app/cart/page.jsx`
- `redux/slices/cartSlice.jsx`

**Dependencies**:

- Acceso a GA4 o dataLayer configurado
- Variables de entorno si se requiere tracking ID

**Testing Strategy**:

- Unit tests para helper de analytics
- Integration tests para eventos en componentes clave
- Manual QA en consola del navegador para verificar payload

---

### Subtask 1.1: Definir Esquema de Eventos y Convenciones

**Issue Type**: Subtask  
**Summary**: Crear diccionario de eventos y estructura de payload estándar  
**Story Points**: 1  
**Assignee**: [Frontend Lead / Analytics]  

**Description**:
Documentar esquema completo de eventos, nomenclatura y payload esperado para mantener consistencia.

**Acceptance Criteria**:

- Documento con todos los eventos del embudo
- Especificación de campos requeridos/opcionales
- Ejemplos de payload por evento
- Ubicación: `docs/analytics-events.md` o en código como comentarios JSDoc

---

### Subtask 1.2: Crear Helper de Tracking Reutilizable

**Issue Type**: Subtask  
**Summary**: Implementar `src/lib/analytics.ts` con función trackEvent centralizada  
**Story Points**: 2  
**Assignee**: [Frontend Developer]  

**Description**:
Crear módulo centralizado para evitar lógica duplicada de tracking en múltiples componentes.

**Acceptance Criteria**:

- Archivo `src/lib/analytics.ts` creado con TypeScript
- Función `trackEvent(eventName, payload)` exportada
- Soporte para gtag y dataLayer según configuración
- Manejo de errores sin romper UI
- Tests unitarios del helper

**Implementation Example**:

```typescript
// src/lib/analytics.ts
export const trackEvent = (eventName: string, payload: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, payload);
    }
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};
```

---

### Subtask 1.3: Instrumentar contact_click en CTAs

**Issue Type**: Subtask  
**Summary**: Agregar tracking a WhatsAppButton y Contact form  
**Story Points**: 1  
**Assignee**: [Frontend Developer]  

**Description**:
Integrar eventos de contacto en componentes de CTA flotante y formulario.

**Acceptance Criteria**:

- `WhatsAppButton.tsx` usa `trackEvent` consistentemente
- `Contact.tsx` dispara evento al envío exitoso
- Payload incluye `method`, `source`, `device_type`
- Validado manualmente en consola del navegador

---

### Subtask 1.4: Instrumentar view_item y add_to_cart

**Issue Type**: Subtask  
**Summary**: Agregar tracking en páginas de producto y carrito  
**Story Points**: 2  
**Assignee**: [Frontend Developer]  

**Description**:
Integrar eventos de producto en rutas dinámicas y slice de Redux.

**Acceptance Criteria**:

- `app/products/[id]/page.jsx` dispara `view_item` al montar
- `cartSlice.jsx` dispara `add_to_cart` en acción `addToCart`
- Payload completo con info de producto
- No afecta performance de carga

---

### Subtask 1.5: Documentar Eventos y Validar

**Issue Type**: Subtask  
**Summary**: Crear guía de uso y validar implementación completa  
**Story Points**: 1  
**Assignee**: [QA + Frontend]  

**Description**:
Documentar convenciones y realizar QA manual de eventos instrumentados.

**Acceptance Criteria**:

- README actualizado con sección de analytics
- Checklist de QA completado para cada evento
- Video/screenshots de eventos en consola para referencia

---

## Story 2: Hardening del CTA Flotante de Contacto

**Issue Type**: Story  
**Summary**: Garantizar funcionamiento robusto del botón flotante de contacto en todos los dispositivos  
**Story Points**: 3  
**Priority**: High  
**Labels**: `ux`, `mobile`, `frontend`, `conversion`  
**Components**: Frontend  
**Sprint**: Sprint 1  

### Description

Como usuario móvil o desktop, necesito que el botón de contacto siempre funcione correctamente para poder contactar a la empresa sin fricción.

Después de refactorización reciente, necesitamos validar y endurecer el flujo completo para evitar casos donde el click no dispare la acción esperada.

### Acceptance Criteria

✅ **AC1**: En móvil, botón "Llamar" abre el marcador telefónico del dispositivo

✅ **AC2**: En móvil y desktop, botón "WhatsApp" abre `wa.me` en nueva pestaña

✅ **AC3**: En desktop, botón "Contacto" navega a `/contact-page`

✅ **AC4**: El panel de opciones se cierra al hacer click fuera o presionar Escape

✅ **AC5**: No hay conflictos CSS que impidan el click (z-index, pointer-events)

✅ **AC6**: Tests del componente pasan (8/8 en `WhatsAppButton.test.tsx`)

✅ **AC7**: No hay regresión visual en mobile (320px) ni desktop (1920px)

### Technical Notes

**Files to modify**:

- `src/components/elements/WhatsAppButton.tsx`
- `public/assets/css/elements-css/contact.css`
- `src/components/elements/WhatsAppButton.test.tsx` (si aplica)

**Testing Devices**:

- Android Chrome
- iOS Safari
- Desktop Chrome/Firefox/Safari

---

### Subtask 2.1: Validar Comportamiento tel: en Múltiples Navegadores

**Issue Type**: Subtask  
**Summary**: Probar enlace tel: en matriz de dispositivos reales  
**Story Points**: 1  
**Assignee**: [QA]  

**Description**:
Matriz de prueba de `tel:+56971447333` en navegadores principales.

**Acceptance Criteria**:

- Tabla con resultado por navegador/OS
- Identificar edge cases o fallos
- Documentar comportamiento esperado

---

### Subtask 2.2: Ajustar Fallback de Llamada sin Romper Accesibilidad

**Issue Type**: Subtask  
**Summary**: Refinar handlePhoneClick para máxima compatibilidad  
**Story Points**: 1  
**Assignee**: [Frontend Developer]  

**Description**:
Asegurar que `window.location.assign(callUrl)` funcione sin conflictos de estado React.

**Acceptance Criteria**:

- Implementación validada en código
- Sin errores de consola en navegadores objetivo
- Tests a11y pasan

---

### Subtask 2.3: Revisar CSS para Evitar Conflictos de Click Area

**Issue Type**: Subtask  
**Summary**: Auditar z-index, pointer-events y tamaños de botón  
**Story Points**: 1  
**Assignee**: [Frontend Developer]  

**Description**:
Revisar CSS de `.btn-wsp`, `.contact-fab`, `.btn-wsp-panel` para evitar sobreposición no intencional.

**Acceptance Criteria**:

- Área clickeable mínima de 44x44px en mobile
- z-index sin conflictos con otros modales/overlays
- Panel visible y clickeable al expandirse

---

## Story 3: Smoke Tests del Flujo Comercial Crítico

**Issue Type**: Story  
**Summary**: Crear suite de smoke tests E2E para flujo producto -> carrito -> contacto  
**Story Points**: 5  
**Priority**: Medium  
**Labels**: `testing`, `e2e`, `ci`, `quality`  
**Components**: QA, DevOps  
**Sprint**: Sprint 1  

### Description

Como equipo técnico, necesitamos pruebas automatizadas del flujo comercial para detectar regresiones antes de producción.

Sin estas pruebas, cambios en componentes de UI, rutas o lógica de negocio pueden romper el embudo sin que lo detectemos hasta que usuarios reales reportan.

### Acceptance Criteria

✅ **AC1**: Suite E2E valida: ver `/products/[id]` -> agregar a carrito -> navegar a `/cart`

✅ **AC2**: Suite E2E valida: desde `/cart` -> navegar a `/checkout` o `/contact-page`

✅ **AC3**: Tests se ejecutan con `npm run test:e2e` localmente

✅ **AC4**: Tests se ejecutan en CI y fallan el build si no pasan

✅ **AC5**: Tiempo de ejecución < 2 minutos para smoke tests

✅ **AC6**: Documentación en README de cómo ejecutar y debuggear

### Technical Notes

**Framework sugerido**: Playwright o Cypress

**Files to create**:

- `tests/e2e/smoke/product-to-cart.spec.ts`
- `tests/e2e/smoke/cart-to-checkout.spec.ts`
- `playwright.config.ts` o `cypress.config.ts`

**CI Integration**:

- Agregar step en pipeline existente
- Configurar screenshots/videos en fallos

---

### Subtask 3.1: Configuración Framework E2E

**Issue Type**: Subtask  
**Summary**: Instalar y configurar Playwright/Cypress  
**Story Points**: 2  
**Assignee**: [QA Lead / DevOps]  

**Description**:
Setup inicial del framework de E2E testing.

**Acceptance Criteria**:

- Dependencias instaladas
- Config base funcional
- Test dummy ejecuta correctamente
- Scripts en `package.json`

---

### Subtask 3.2: Crear Smoke Test Producto -> Carrito

**Issue Type**: Subtask  
**Summary**: Implementar test de agregar producto al carrito  
**Story Points**: 2  
**Assignee**: [QA Engineer]  

**Description**:
Test que valide navegación, click en "Agregar al carrito" y confirmación.

**Acceptance Criteria**:

- Navega a `/products/P001`
- Click en botón de agregar
- Verifica contador de carrito incrementa
- Valida toast/notificación de éxito

---

### Subtask 3.3: Crear Smoke Test Carrito -> Checkout/Contacto

**Issue Type**: Subtask  
**Summary**: Implementar test de navegación desde carrito  
**Story Points**: 1  
**Assignee**: [QA Engineer]  

**Description**:
Test que valide rutas desde `/cart` hacia checkout o contacto.

**Acceptance Criteria**:

- Navega a `/cart` con producto
- Valida visualización del producto
- Click en botón de checkout/contacto
- Verifica navegación correcta

---

## Story 4: Dashboard Inicial de Conversión por Canal

**Issue Type**: Story  
**Summary**: Crear dashboard de conversión por canal de contacto (WhatsApp/Llamada/Formulario)  
**Story Points**: 3  
**Priority**: Medium  
**Labels**: `analytics`, `dashboard`, `business-intelligence`  
**Components**: Analytics  
**Sprint**: Sprint 1  

### Description

Como equipo de negocio, necesitamos visibilidad sobre qué canal de contacto prefieren los usuarios para priorizar optimizaciones con mayor impacto.

El dashboard debe permitir comparar conversión entre WhatsApp, llamada telefónica y formulario web, segmentado por dispositivo.

### Acceptance Criteria

✅ **AC1**: Dashboard accesible en GA4 (o herramienta actual) para todo el equipo

✅ **AC2**: Métricas visibles:

- Click rate por canal (`whatsapp`, `phone`, `contact_form`)
- Segmentación por `device_type` (mobile/desktop)
- Tendencia semanal

✅ **AC3**: KPI semanal definido: CTR de contacto y tasa inicio de checkout

✅ **AC4**: Primer informe semanal emitido al final del sprint

### Technical Notes

**Dependencies**:

- Story 1 completada (eventos instrumentados)
- Acceso a GA4 o herramienta de analytics

**Deliverable**:

- URL del dashboard compartida
- Template de reporte semanal

---

### Subtask 4.1: Crear Exploración en GA4 por contact_click

**Issue Type**: Subtask  
**Summary**: Setup de custom report en GA4  
**Story Points**: 1  
**Assignee**: [Analytics Specialist]  

**Description**:
Crear exploración personalizada con dimensiones relevantes.

**Acceptance Criteria**:

- Exploración creada con nombre descriptivo
- Incluye dimensiones: `method`, `source`, `device_type`
- Métricas: event_count, unique_users

---

### Subtask 4.2: Segmentar por Dispositivo y Crear Visualizaciones

**Issue Type**: Subtask  
**Summary**: Agregar comparativas mobile vs desktop  
**Story Points**: 1  
**Assignee**: [Analytics Specialist]  

**Description**:
Añadir segmentación y gráficos comparativos.

**Acceptance Criteria**:

- Gráfico de barras por canal y dispositivo
- Tabla resumen con conversión por segmento

---

### Subtask 4.3: Definir KPIs y Publicar Primer Reporte

**Issue Type**: Subtask  
**Summary**: Establecer baseline y emitir primer informe semanal  
**Story Points**: 1  
**Assignee**: [Product Owner + Analytics]  

**Description**:
Definir métricas objetivo y formato de reporte recurrente.

**Acceptance Criteria**:

- KPIs documentados (ej: "CTR contacto > 5%")
- Primer reporte circulado al equipo
- Formato de reporte semanal establecido

---

## Sprint 1 Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Eventos inconsistentes por nomenclatura | Medium | High | Diccionario único desde Subtask 1.1 |
| Diferencias de comportamiento tel: entre navegadores | Medium | Medium | Matriz de prueba real (Subtask 2.1) |
| Falta de baseline previa para comparar | Low | Medium | Semana 1 enfocada en baseline |
| Framework E2E toma más tiempo de setup | Medium | Low | Priorizar un test crítico primero |
| Acceso limitado a GA4 | Low | High | Verificar permisos en Sprint Planning |

---

## Sprint 1 Métricas de éxito

✅ **Velocity**: 16 Story Points completados  
✅ **Quality**: 0 bugs críticos en producción post-deploy  
✅ **Coverage**: 100% de eventos críticos instrumentados  
✅ **Stability**: CTA flotante 0 reportes de falla  
✅ **Automation**: Smoke tests ejecutando en CI  
✅ **Data**: Dashboard con datos reales disponibles  

---

## Sprint 1 Ceremony Schedule (Ejemplo)

**Sprint Planning**: [Fecha] 2h  
**Daily Standup**: Diario 15min  
**Mid-Sprint Check-in**: [Fecha mitad sprint] 1h  
**Sprint Review**: [Fecha final] 1h  
**Sprint Retrospective**: [Fecha final] 1h  

---

## Notes for Jira Import

**CSV Format Headers** (si se importa por CSV):

```
Issue Type,Summary,Description,Priority,Story Points,Labels,Component,Sprint,Acceptance Criteria
```

**JSON Format** (si se usa API de Jira):
Disponible bajo demanda con estructura completa de fields.

---

**Document Version**: 1.0  
**Last Updated**: 9 marzo 2026  
**Owner**: [Tech Lead / Scrum Master]
