#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DIRECTORIES = ["app", "src", "redux"];
const EXTENSIONS = [".jsx", ".tsx", ".js", ".ts"];

/**
 * Convierte un import con alias @/ a ruta relativa
 * @param {string} filePath - Ruta absoluta del archivo
 * @param {string} importPath - El path en el import
 * @returns {string} - El import path convertido a ruta relativa
 */
function convertAliasToRelative(filePath, importPath) {
  if (!importPath.startsWith("@/")) {
    return importPath;
  }

  // Remueve el prefijo @/
  const targetPath = importPath.slice(2);

  // Obtiene la carpeta del archivo actual
  const dir = path.dirname(filePath);

  // Calcula la ruta relativa desde el archivo actual al target
  let relativePath = path.relative(dir, targetPath);

  // Asegura que use puntos para ir hacia arriba
  if (!relativePath.startsWith(".")) {
    relativePath = "./" + relativePath;
  }

  // Normaliza separadores de ruta
  relativePath = relativePath.replace(/\\/g, "/");

  return relativePath;
}

/**
 * Procesa un archivo y reemplaza los imports con alias
 */
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    const originalContent = content;

    // Regex para encontrar imports con alias @/
    const importRegex = /from\s+['"`](@\/[^'"`]+)['"`]/g;

    content = content.replace(importRegex, (match, importPath) => {
      const newPath = convertAliasToRelative(filePath, importPath);
      return `from '${newPath}'`;
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`✗ Error procesando ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Procesa recursivamente todas las carpetas y archivos
 */
function processDirectory(dir, depth = 0) {
  const maxDepth = 10;
  if (depth > maxDepth) return;

  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Ignora node_modules y .next
        if (file !== "node_modules" && file !== ".next" && file !== ".git") {
          processDirectory(fullPath, depth + 1);
        }
      } else if (stat.isFile()) {
        if (EXTENSIONS.includes(path.extname(file))) {
          processFile(fullPath);
        }
      }
    }
  } catch (error) {
    console.error(`✗ Error procesando directorio ${dir}:`, error.message);
  }
}

console.log("🔄 Convirtiendo imports de alias @/ a rutas relativas...\n");

for (const dir of DIRECTORIES) {
  const fullPath = path.resolve(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    console.log(`\n📁 Procesando ${dir}/`);
    processDirectory(fullPath);
  }
}

console.log("\n✅ ¡Conversión completada!");
