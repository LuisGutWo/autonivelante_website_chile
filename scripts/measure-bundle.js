const fs = require("fs");
const path = require("path");

/**
 * Script para medir el tamaño del bundle de Next.js
 * Uso: node scripts/measure-bundle.js
 */

function getDirectorySize(directoryPath) {
  let totalSize = 0;

  if (!fs.existsSync(directoryPath)) {
    return 0;
  }

  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stat.size;
    }
  }

  return totalSize;
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function measureBundle() {
  console.log("\n📦 Bundle Size Analysis\n");
  console.log("=".repeat(60));

  const nextPath = path.join(__dirname, "..", ".next");

  if (!fs.existsSync(nextPath)) {
    console.log("❌ Error: No se encontró el directorio .next");
    console.log('   Ejecuta "npm run build" primero');
    return;
  }

  // Medir directorios individuales
  const directories = [
    { name: "Static Pages", path: path.join(nextPath, "static") },
    { name: "Server Chunks", path: path.join(nextPath, "server") },
    { name: "Cache", path: path.join(nextPath, "cache") },
  ];

  let totalSize = 0;

  directories.forEach(({ name, path: dirPath }) => {
    const size = getDirectorySize(dirPath);
    totalSize += size;
    console.log(`\n${name}:`);
    console.log(`  ${formatBytes(size)}`);
  });

  // Tamaño total
  const fullSize = getDirectorySize(nextPath);
  console.log("\n" + "=".repeat(60));
  console.log(`\n✨ Total Build Size: ${formatBytes(fullSize)}\n`);

  // Analizar chunks de JavaScript
  const staticDir = path.join(nextPath, "static", "chunks");
  if (fs.existsSync(staticDir)) {
    console.log("\n📄 JavaScript Chunks:\n");

    const chunks = fs
      .readdirSync(staticDir)
      .filter((file) => file.endsWith(".js"))
      .map((file) => ({
        name: file,
        size: fs.statSync(path.join(staticDir, file)).size,
      }))
      .sort((a, b) => b.size - a.size)
      .slice(0, 10); // Top 10

    chunks.forEach((chunk, index) => {
      console.log(`  ${index + 1}. ${chunk.name}`);
      console.log(`     ${formatBytes(chunk.size)}`);
    });
  }

  // Recomendaciones
  console.log("\n" + "=".repeat(60));
  console.log("\n💡 Recomendaciones:\n");

  if (fullSize > 5 * 1024 * 1024) {
    // > 5MB
    console.log("  ⚠️  Build size grande (>5MB)");
    console.log("     - Considera implementar code splitting");
    console.log("     - Revisa dependencias pesadas");
  } else if (fullSize > 3 * 1024 * 1024) {
    // > 3MB
    console.log("  ℹ️  Build size moderado (>3MB)");
    console.log("     - Revisa oportunidades de optimización");
  } else {
    console.log("  ✅ Build size óptimo (<3MB)");
  }

  console.log("\n📊 Para análisis detallado:");
  console.log("   npm run build:analyze\n");
}

// Ejecutar
measureBundle();
