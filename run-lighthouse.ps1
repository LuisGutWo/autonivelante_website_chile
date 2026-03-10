# Ejecutar Lighthouse Performance Audit
# Este script ejecuta Lighthouse en el navegador instalado

Write-Host "🚀 Ejecutando Lighthouse Performance Audit..." -ForegroundColor Cyan
Write-Host "📍 URL: http://localhost:3001" -ForegroundColor Gray
Write-Host ""

# Verificar que el servidor esté corriendo
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Servidor respondiendo correctamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: El servidor no está corriendo en localhost:3001" -ForegroundColor Red
    Write-Host "   Inicia el servidor con: npm run dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "⏳ Ejecutando Lighthouse (esto tomará 30-60 segundos)..." -ForegroundColor Yellow
Write-Host "   Se abrirá el reporte en tu navegador al finalizar" -ForegroundColor Gray
Write-Host ""

# Ejecutar Lighthouse con reporte HTML que se abre automáticamente
npx lighthouse http://localhost:3001 `
    --only-categories=performance `
    --preset=desktop `
    --output=html `
    --output-path=lighthouse-report.html `
    --view `
    --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Análisis completado!" -ForegroundColor Green
    Write-Host "📊 Reporte guardado en: lighthouse-report.html" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🎯 Métricas a verificar:" -ForegroundColor Yellow
    Write-Host "  • Performance Score: > 90" -ForegroundColor Gray
    Write-Host "  • FCP (First Contentful Paint): < 1.8s" -ForegroundColor Gray
    Write-Host "  • LCP (Largest Contentful Paint): < 2.5s" -ForegroundColor Gray
    Write-Host "  • TBT (Total Blocking Time): < 200ms" -ForegroundColor Gray
    Write-Host "  • CLS (Cumulative Layout Shift): < 0.1" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Error al ejecutar Lighthouse" -ForegroundColor Red
    Write-Host "   Intenta ejecutar manualmente desde Chrome DevTools (F12 → Lighthouse)" -ForegroundColor Yellow
}
