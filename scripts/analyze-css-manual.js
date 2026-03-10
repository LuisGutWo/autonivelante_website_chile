const fs = require("fs");
const path = require("path");
const fg = require("fast-glob");

// Archivos CSS a analizar
const cssFiles = [
  "public/assets/css/elpath.css",
  "public/assets/css/bootstrap.css",
  "public/assets/css/flaticon.css",
  "public/assets/css/font-awesome-all.css",
  "public/assets/css/color.css",
  "public/assets/css/style.css",
  "public/assets/css/elements-css/cart.css",
  "public/assets/css/elements-css/productcard.css",
];

// Extraer clases CSS de un archivo CSS
function extractCSSClasses(cssContent) {
  const classes = new Set();

  // Regex para encontrar selectores de clase
  // Busca .clase-nombre (incluyendo BEM, guiones, números)
  const classRegex = /\.([\w-]+)/g;
  let match;

  while ((match = classRegex.exec(cssContent)) !== null) {
    // Filtrar pseudo-clases y clases de medios
    if (!match[1].startsWith(":") && !match[1].startsWith("@")) {
      classes.add(match[1]);
    }
  }

  return classes;
}

// Extraer clases usadas en archivos de código
async function extractUsedClasses() {
  const contentFiles = await fg(
    ["app/**/*.{js,jsx,ts,tsx}", "src/**/*.{js,jsx,ts,tsx}"],
    {
      cwd: path.join(__dirname, ".."),
      absolute: true,
    },
  );

  const usedClasses = new Set();

  for (const file of contentFiles) {
    try {
      const content = fs.readFileSync(file, "utf8");

      // Buscar clases en className, class, classList
      const patterns = [
        /className\s*=\s*["'`]([^"'`]+)["'`]/g,
        /class\s*=\s*["']([^"']+)["']/g,
        /classList\.\w+\(["']([^"']+)["']\)/g,
        /\bclass\s*:\s*["']([^"']+)["']/g,
      ];

      patterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          // Dividir por espacios para obtener clases individuales
          const classes = match[1].split(/\s+/).filter(Boolean);
          classes.forEach((cls) => usedClasses.add(cls.trim()));
        }
      });
    } catch (error) {
      // Ignorar errores de lectura de archivos
    }
  }

  return usedClasses;
}

// Analizar un archivo CSS
function analyzeCSSFile(cssPath, usedClasses) {
  console.log(`\n📊 Analizando: ${cssPath}`);
  console.log("─".repeat(70));

  const fullPath = path.join(__dirname, "..", cssPath);

  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Archivo no encontrado\n`);
    return null;
  }

  const content = fs.readFileSync(fullPath, "utf8");
  const size = fs.statSync(fullPath).size;
  const sizeKb = (size / 1024).toFixed(2);

  // Contar líneas
  const lines = content.split("\n").length;

  // Contar reglas CSS (aproximado)
  const rules = (content.match(/\{/g) || []).length;

  // Extraer clases definidas en este CSS
  const definedClasses = extractCSSClasses(content);

  // Encontrar clases no usadas
  const unusedClasses = [];
  definedClasses.forEach((cls) => {
    if (!usedClasses.has(cls)) {
      unusedClasses.push(cls);
    }
  });

  const usageRate =
    definedClasses.size > 0
      ? (
          ((definedClasses.size - unusedClasses.length) / definedClasses.size) *
          100
        ).toFixed(1)
      : "0.0";

  console.log(`📦 Tamaño:           ${sizeKb} KB`);
  console.log(`📄 Líneas:           ${lines.toLocaleString()}`);
  console.log(`📋 Reglas CSS:       ${rules.toLocaleString()}`);
  console.log(`🏷️  Clases definidas: ${definedClasses.size.toLocaleString()}`);
  console.log(
    `✅ Clases usadas:    ${(definedClasses.size - unusedClasses.length).toLocaleString()}`,
  );
  console.log(
    `❌ Clases sin usar:  ${unusedClasses.length.toLocaleString()} (${(100 - parseFloat(usageRate)).toFixed(1)}%)`,
  );

  // Mostrar algunas clases no usadas como muestra (máximo 10)
  if (unusedClasses.length > 0) {
    console.log(`\n🔍 Muestra de clases sin usar (primeras 10):`);
    unusedClasses.slice(0, 10).forEach((cls) => {
      console.log(`   • .${cls}`);
    });
    if (unusedClasses.length > 10) {
      console.log(`   ... y ${unusedClasses.length - 10} más`);
    }
  }

  return {
    file: cssPath,
    sizeKb: parseFloat(sizeKb),
    lines,
    rules,
    definedClasses: definedClasses.size,
    usedClasses: definedClasses.size - unusedClasses.length,
    unusedClasses: unusedClasses.length,
    usageRate: parseFloat(usageRate),
    unusedClassesList: unusedClasses,
  };
}

async function main() {
  console.log("🔍 ANÁLISIS MANUAL DE CSS - OPCIÓN D");
  console.log("═".repeat(70));
  console.log(
    "Estrategia: Análisis de clases CSS definidas vs. usadas en código\n",
  );

  console.log("⏳ Escaneando código fuente para encontrar clases usadas...");
  const usedClasses = await extractUsedClasses();
  console.log(
    `✅ Encontradas ${usedClasses.size.toLocaleString()} clases únicas en uso\n`,
  );

  const results = [];

  for (const cssFile of cssFiles) {
    const result = analyzeCSSFile(cssFile, usedClasses);
    if (result) {
      results.push(result);
    }
  }

  // Resumen general
  console.log("\n\n📋 RESUMEN GENERAL");
  console.log("═".repeat(70));

  const totalSize = results.reduce((sum, r) => sum + r.sizeKb, 0);
  const totalLines = results.reduce((sum, r) => sum + r.lines, 0);
  const totalRules = results.reduce((sum, r) => sum + r.rules, 0);
  const totalDefined = results.reduce((sum, r) => sum + r.definedClasses, 0);
  const totalUnused = results.reduce((sum, r) => sum + r.unusedClasses, 0);
  const avgUsageRate =
    results.reduce((sum, r) => sum + r.usageRate, 0) / results.length;

  console.log(`\n📊 Totales:`);
  console.log(`  • Tamaño total:         ${totalSize.toFixed(2)} KB`);
  console.log(`  • Líneas totales:       ${totalLines.toLocaleString()}`);
  console.log(`  • Reglas CSS:           ${totalRules.toLocaleString()}`);
  console.log(`  • Clases definidas:     ${totalDefined.toLocaleString()}`);
  console.log(
    `  • Clases sin usar:      ${totalUnused.toLocaleString()} (${((totalUnused / totalDefined) * 100).toFixed(1)}%)`,
  );
  console.log(`  • Tasa de uso promedio: ${avgUsageRate.toFixed(1)}%`);

  // Top archivos problemáticos
  console.log(`\n🎯 Archivos con más desperdicio de CSS:`);
  const sorted = [...results].sort((a, b) => b.unusedClasses - a.unusedClasses);
  sorted.slice(0, 5).forEach((r, i) => {
    const wasteKb = (r.sizeKb * (r.unusedClasses / r.definedClasses)).toFixed(
      2,
    );
    console.log(`\n  ${i + 1}. ${path.basename(r.file)}`);
    console.log(
      `     📦 Tamaño: ${r.sizeKb} KB | ❌ ${r.unusedClasses} clases sin usar (${(100 - r.usageRate).toFixed(1)}%)`,
    );
    console.log(`     🗑️  Desperdicio estimado: ~${wasteKb} KB`);
  });

  // Guardar reporte completo
  const reportPath = path.join(__dirname, "..", "css-usage-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n\n💾 Reporte completo guardado en: css-usage-report.json`);

  // Recomendaciones
  console.log(`\n\n💡 RECOMENDACIONES:`);

  results.forEach((r) => {
    const unusedPercent = 100 - r.usageRate;
    if (unusedPercent > 70) {
      console.log(
        `  🔴 ${path.basename(r.file)}: ${unusedPercent.toFixed(1)}% sin usar - CRÍTICO`,
      );
      console.log(
        `     → Considerar reemplazar con versión CDN o eliminar si no es esencial`,
      );
    } else if (unusedPercent > 40) {
      console.log(
        `  🟡 ${path.basename(r.file)}: ${unusedPercent.toFixed(1)}% sin usar - ALTA PRIORIDAD`,
      );
      console.log(`     → Revisar y eliminar clases no usadas manualmente`);
    } else if (unusedPercent > 20) {
      console.log(
        `  🟢 ${path.basename(r.file)}: ${unusedPercent.toFixed(1)}% sin usar - Considerar limpieza`,
      );
    } else {
      console.log(
        `  ✅ ${path.basename(r.file)}: ${unusedPercent.toFixed(1)}% sin usar - Bien optimizado`,
      );
    }
  });

  console.log(`\n\n⚠️  NOTAS IMPORTANTES:`);
  console.log(
    `  • Este análisis busca clases en className/class en archivos .jsx/.tsx`,
  );
  console.log(`  • Clases agregadas dinámicamente pueden no ser detectadas`);
  console.log(
    `  • Librerías de terceros (Bootstrap, Font Awesome) suelen tener baja tasa de uso`,
  );
  console.log(`  • Revisar manualmente antes de eliminar CSS\n`);
}

main().catch(console.error);
