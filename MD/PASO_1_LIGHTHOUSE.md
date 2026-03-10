# 🎯 PASO 1: Lighthouse Audit - Guía Visual

## ✅ Servidor corriendo en: <http://localhost:3001>

---

## 📊 Ejecutar Lighthouse (2 minutos)

### Opción A: Chrome DevTools (Recomendado)

**1. Asegúrate de estar en <http://localhost:3001>**

**2. Abre Chrome DevTools:**

- Presiona `F12`
- O click derecho → "Inspeccionar"
- O `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)

**3. Ve a la pestaña "Lighthouse":**

   ```
   Elements | Console | Sources | Network | ... | Lighthouse
                                                    ↑↑↑↑↑
   ```

**4. Configura el análisis:**

   ```
   Mode: Navigation (default)
   Device: Desktop ⬜
   Categories: 
     ☑ Performance  ← SOLO MARCA ESTE
     ☐ Accessibility
     ☐ Best Practices
     ☐ SEO
   ```

**5. Click en el botón azul:**

   ```
   [ Analyze page load ]
   ```

**6. Espera 30-60 segundos...**

- Verás la página recargándose varias veces
- Chrome está midiendo el rendimiento

---

## 📈 Interpretando los Resultados

### 🎯 **Puntaje de rendimiento**

```
┌─────────────────────────────┐
│  Performance                │
│                             │
│         92                  │  ← Este es tu score (0-100)
│      ▓▓▓▓▓▓▓▓▓░             │
│                             │
└─────────────────────────────┘
```

**Escala de colores:**

- 🟢 **90-100**: Excelente
- 🟡 **50-89**: Necesita mejora
- 🔴 **0-49**: Pobre

### ⚡ **Core Web Vitals**

Busca estas métricas en el reporte:

```
Metrics
├─ First Contentful Paint (FCP)
│  └─ 🎯 Target: < 1.8s
│     ✅ Esperado: ~1.0s
│
├─ Largest Contentful Paint (LCP)
│  └─ 🎯 Target: < 2.5s
│     ✅ Esperado: ~1.5s
│
├─ Total Blocking Time (TBT)
│  └─ 🎯 Target: < 200ms
│     ✅ Esperado: ~100ms
│
├─ Cumulative Layout Shift (CLS)
│  └─ 🎯 Target: < 0.1
│     ✅ Esperado: ~0.05
│
└─ Speed Index
   └─ 🎯 Target: < 3.4s
      ✅ Esperado: ~2.0s
```

### 📋 **Oportunidades (Opportunities)**

Deberías ver algo como:

```
✅ Properly size images
   Potential savings: 0 KiB
   → Already optimized with next/image!

✅ Serve images in next-gen formats
   Potential savings: 0 KiB
   → Already using AVIF/WebP!

✅ Eliminate render-blocking resources
   Potential savings: 0 ms
   → CSS/JS already optimized!

✅ Reduce unused JavaScript
   Potential savings: 0 KiB
   → Tree shaking working!
```

### 🔍 **Diagnósticos (Diagnostics)**

Busca estas confirmaciones:

```
✅ Preconnect to required origins
   → fonts.googleapis.com
   → firebasestorage.googleapis.com

✅ Use HTTP/2
   → Enabled

✅ Keep request counts low and transfer sizes small
   → Requests: ~20-30 (Good)
   → Total size: ~500-800 KB (Good)
```

---

## 📊 Ejemplo Visual de Resultados Esperados

```
╔════════════════════════════════════════╗
║  Performance                      92  ║  🟢 Excelente
╠════════════════════════════════════════╣
║                                        ║
║  Metrics                               ║
║  ├─ First Contentful Paint    1.2 s   ║  🟢
║  ├─ Speed Index                2.1 s   ║  🟢
║  ├─ Largest Contentful Paint   1.8 s   ║  🟢
║  ├─ Time to Interactive        2.5 s   ║  🟢
║  ├─ Total Blocking Time         80 ms  ║  🟢
║  └─ Cumulative Layout Shift    0.02    ║  🟢
║                                        ║
║  Opportunities                         ║
║  ✅ All optimizations applied!         ║
║                                        ║
║  Diagnostics                           ║
║  ✅ Preconnect configured              ║
║  ✅ Next-gen image formats             ║
║  ✅ Efficient cache policy             ║
║                                        ║
╚════════════════════════════════════════╝
```

---

## 🎬 Capturas Importantes

### 1. **Filmstrip View**

- Muestra cómo se carga la página visualmente
- Busca que el contenido principal aparezca rápido

### 2. **Treemap View**

- Muestra el tamaño de cada archivo JavaScript
- Verifica que no haya bundles gigantes

### 3. **Runtime Settings**

- Confirma que se ejecutó en Desktop
- Verifica la velocidad de red simulada

---

## 🐛 Solución de problemas

### Problema: "No se encuentra la pestaña Lighthouse"

**Solución:**

- Actualiza Chrome a la última versión
- O usa la extensión de Lighthouse: [Chrome Web Store](https://chrome.google.com/webstore/detail/lighthouse/blipmdconlkpinefehnmjammfjpmpbjk)

### Problema: "Error de conexión"

**Solución:**

```bash
# Verifica que el servidor esté corriendo
curl http://localhost:3001

# Si no responde, reinicia:
npm run dev
```

### Problema: "Score muy bajo (< 50)"

**Posibles causas:**

1. Extensiones de Chrome interfiriendo → Usa ventana de incógnito
2. Máquina lenta → Los números absolutos importan más que el score
3. Throttling muy agresivo → Cambia a Desktop sin throttling

---

## 📸 Exportar Resultados

**Para guardar el reporte:**

1. Click en el ícono de engranaje ⚙️ (esquina superior derecha)
2. Selecciona "View Trace"
3. O click en "💾 Save Report" para exportar HTML

**Para compartir:**

- El reporte HTML se puede abrir en cualquier navegador
- Incluye todos los detalles y gráficos

---

## ⏭️ Siguiente Paso

Una vez que tengas los resultados de Lighthouse:

1. **Toma nota del Performance Score**
2. **Verifica que LCP < 2.5s**
3. **Confirma que CLS < 0.1**

Luego continúa con:

- **Paso 2:** Validar lazy loading de imágenes
- **Paso 3:** Verificar optimización de fuentes

---

## 📞 ¿Necesitas Ayuda?

**Si el score es bajo (<80):**

- Comparte el reporte HTML
- Identifica las "Opportunities" principales
- Ajustaremos las optimizaciones específicas

**Si el score es alto (>90):**

- ✅ ¡Felicitaciones! El sitio está muy optimizado
- Continúa con las validaciones manuales para confirmar

---

**Tiempo estimado:** 2-3 minutos  
**Resultado esperado:** Performance Score > 90  
**Archivo:** lighthouse-report.json (generado en la raíz del proyecto)
