#!/usr/bin/env node
/**
 * Genera blurDataUrl para todas las entradas con `image` en products.json.
 * Diseñado para rutas locales bajo /public (ej: /assets/images/products/x.png).
 */

const fs = require("fs");
const path = require("path");
const { getPlaiceholder } = require("plaiceholder");

const PRODUCTS_FILE = path.join(__dirname, "../src/data/products.json");
const PUBLIC_DIR = path.join(__dirname, "../public");

// Alias para nombres legacy o inconsistentes en el catálogo.
const IMAGE_ALIASES = {
  "mapei_ultraplan_contact_img7.png": "uktraplan-contract.png",
};

function fallbackBlur() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><filter id="b"><feGaussianBlur stdDeviation="2"/></filter><rect width="10" height="10" fill="#e8e8e8" filter="url(#b)"/></svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

function normalizeImagePath(imagePath) {
  if (typeof imagePath !== "string") return imagePath;
  if (!imagePath.startsWith("/assets/images/products/")) return imagePath;

  const currentFileName = path.basename(imagePath);
  const aliasedFileName = IMAGE_ALIASES[currentFileName] || currentFileName;
  return `/assets/images/products/${aliasedFileName}`;
}

function resolveLocalPath(imagePath) {
  if (typeof imagePath !== "string") return null;
  const normalizedPath = normalizeImagePath(imagePath);
  if (normalizedPath.startsWith("/")) {
    return path.join(PUBLIC_DIR, normalizedPath.replace(/^\//, ""));
  }
  return null;
}

async function generateBlurDataUrl(imagePath) {
  try {
    const localPath = resolveLocalPath(imagePath);
    if (!localPath || !fs.existsSync(localPath)) {
      console.warn(`⚠️ Imagen no encontrada: ${imagePath}`);
      return fallbackBlur();
    }

    const buffer = fs.readFileSync(localPath);
    const { base64 } = await getPlaiceholder(buffer, { size: 10 });
    return base64 || fallbackBlur();
  } catch (error) {
    console.warn(`⚠️ Error generando blur para ${imagePath}: ${error.message}`);
    return fallbackBlur();
  }
}

async function walkAndUpdate(node, stats) {
  if (Array.isArray(node)) {
    for (const item of node) {
      await walkAndUpdate(item, stats);
    }
    return;
  }

  if (!node || typeof node !== "object") {
    return;
  }

  if (typeof node.image === "string") {
    node.image = normalizeImagePath(node.image);
    node.blurDataUrl = await generateBlurDataUrl(node.image);
    stats.processed += 1;
  }

  for (const value of Object.values(node)) {
    if (value && typeof value === "object") {
      await walkAndUpdate(value, stats);
    }
  }
}

async function main() {
  console.log("🚀 Generando blurDataUrl para products.json...\n");

  const productsData = JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf-8"));
  const stats = { processed: 0 };

  await walkAndUpdate(productsData, stats);

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(productsData, null, 2));

  console.log("✅ Proceso completado:");
  console.log(`   ✓ Imágenes procesadas: ${stats.processed}`);
}

main().catch((error) => {
  console.error("❌ Error crítico:", error.message);
  process.exit(1);
});
