const { PurgeCSS } = require("purgecss");
const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");

// Archivos CSS a analizar (los más grandes y sospechosos)
const cssFiles = [
  "public/assets/css/elpath.css",
  "public/assets/css/bootstrap.css",
  "public/assets/css/flaticon.css",
  "public/assets/css/font-awesome-all.css",
  "public/assets/css/color.css",
  "public/assets/css/style.css",
];

// Rutas donde buscar contenido HTML/JS/JSX que usa CSS
const contentGlobs = [
  "app/**/*.{js,jsx,ts,tsx}",
  "src/**/*.{js,jsx,ts,tsx}",
  "public/**/*.html",
];

async function analyzeCSSFile(cssPath, contentFiles) {
  console.log(`\n📊 Analizando: ${cssPath}`);
  console.log("─".repeat(60));

  const fullPath = path.join(__dirname, "..", cssPath);

  // Verificar si el archivo existe
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Archivo no encontrado: ${cssPath}`);
    return null;
  }

  // Obtener tamaño original
  const originalSize = fs.statSync(fullPath).size;
  const originalKb = (originalSize / 1024).toFixed(2);

  try {
    const purgeCSSResult = await new PurgeCSS().purge({
      content: contentFiles,
      css: [fullPath],
      safelist: {
        // Clases que siempre deben mantenerse (agregadas dinámicamente o por librerías)
        standard: [
          /^wow/,
          /^animate__/,
          /^swiper/,
          /^owl/,
          /^modal/,
          /^fade/,
          /^show/,
          /^active/,
          /^collapse/,
          /^navbar/,
          /^dropdown/,
          /^btn-/,
          /^carousel/,
          /^slide/,
        ],
        deep: [],
        greedy: [/data-wow/, /data-animate/],
      },
      defaultExtractor: (content) => {
        // Extractor personalizado para React/Next.js
        const matches = content.match(/[\w-/:]+(?<!:)/g) || [];
        return matches;
      },
    });

    // Debug: ver qué devuelve PurgeCSS
    if (!purgeCSSResult || purgeCSSResult.length === 0) {
      console.log(`⚠️  PurgeCSS no devolvió resultados para ${cssPath}`);
      return null;
    }

    const purgedCSS = purgeCSSResult[0].css;
    const purgedSize = Buffer.byteLength(purgedCSS, "utf8");
    const purgedKb = (purgedSize / 1024).toFixed(2);
    const reduction = ((1 - purgedSize / originalSize) * 100).toFixed(2);

    // Contar número aproximado de reglas CSS
    const originalRules = (fs.readFileSync(fullPath, "utf8").match(/\{/g) || [])
      .length;
    const purgedRules = (purgedCSS.match(/\{/g) || []).length;
    const rulesRemoved = originalRules - purgedRules;

    return {
      file: cssPath,
      originalKb,
      purgedKb,
      reduction,
      originalRules,
      purgedRules,
      rulesRemoved,
      purgedCSS,
    };
  } catch (error) {
    console.error(`❌ Error analizando ${cssPath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("🔍 ANÁLISIS DE CSS NO UTILIZADO - OPCIÓN D");
  console.log("═".repeat(60));
  console.log(`Escaneando archivos en:`);
  contentGlobs.forEach((p) => console.log(`  • ${p}`));

  // Resolver globs a archivos reales
  const contentFiles = await fg(contentGlobs, {
    cwd: path.join(__dirname, ".."),
    absolute: true,
  });

  console.log(`✅ Encontrados ${contentFiles.length} archivos de contenido\n`);

  if (contentFiles.length === 0) {
    console.error(
      "❌ No se encontraron archivos de contenido. Verifica los globs.",
    );
    return;
  }

  const results = [];

  for (const cssFile of cssFiles) {
    const result = await analyzeCSSFile(cssFile, contentFiles);
    if (result) {
      results.push(result);

      console.log(
        `📦 Tamaño original:  ${result.originalKb} KB (${result.originalRules} reglas)`,
      );
      console.log(
        `✨ Después de purge:  ${result.purgedKb} KB (${result.purgedRules} reglas)`,
      );
      console.log(
        `🗑️  Reducción:        ${result.reduction}% (${result.rulesRemoved} reglas eliminables)\n`,
      );
    }
  }

  // Resumen general
  console.log("\n📋 RESUMEN GENERAL");
  console.log("═".repeat(60));

  const totalOriginal = results.reduce(
    (sum, r) => sum + parseFloat(r.originalKb),
    0,
  );
  const totalPurged = results.reduce(
    (sum, r) => sum + parseFloat(r.purgedKb),
    0,
  );
  const totalReduction = ((1 - totalPurged / totalOriginal) * 100).toFixed(2);
  const totalRulesRemoved = results.reduce((sum, r) => sum + r.rulesRemoved, 0);

  console.log(`\n📊 Totales:`);
  console.log(`  • Tamaño original:  ${totalOriginal.toFixed(2)} KB`);
  console.log(`  • Después de purge: ${totalPurged.toFixed(2)} KB`);
  console.log(
    `  • Ahorro potencial: ${(totalOriginal - totalPurged).toFixed(2)} KB (${totalReduction}%)`,
  );
  console.log(`  • Reglas CSS eliminables: ${totalRulesRemoved}`);

  // Archivos con mayor impacto
  console.log(`\n🎯 Top archivos con mayor reducción:`);
  const sorted = [...results].sort(
    (a, b) => parseFloat(b.reduction) - parseFloat(a.reduction),
  );
  sorted.slice(0, 3).forEach((r, i) => {
    console.log(`  ${i + 1}. ${r.file}`);
    console.log(
      `     ${r.originalKb} KB → ${r.purgedKb} KB (-${r.reduction}%)`,
    );
  });

  // Guardar resultados en JSON
  const reportPath = path.join(__dirname, "..", "css-analysis-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n💾 Reporte completo guardado en: css-analysis-report.json`);

  // Recomendaciones
  console.log(`\n💡 RECOMENDACIONES:`);
  results.forEach((r) => {
    if (parseFloat(r.reduction) > 50) {
      console.log(
        `  ⚠️  ${r.file}: ${r.reduction}% reducible - ALTA PRIORIDAD`,
      );
    } else if (parseFloat(r.reduction) > 20) {
      console.log(
        `  📌 ${r.file}: ${r.reduction}% reducible - Considerar limpieza`,
      );
    } else {
      console.log(`  ✅ ${r.file}: ${r.reduction}% reducible - Optimizado`);
    }
  });

  console.log(
    `\n⚠️  ADVERTENCIA: Este es un análisis automático. Revisar manualmente antes de aplicar.`,
  );
  console.log(
    `📝 Próximo paso: Revisar css-analysis-report.json y decidir qué limpiar.\n`,
  );
}

main().catch(console.error);
