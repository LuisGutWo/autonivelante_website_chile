/* ═══════════════════════════════════════════════════
   OPTIMIZAR-IMAGENES.MJS — Deja las imágenes listas para servirse tal cual.

   Este sitio no usa el optimizador de Vercel: `images.unoptimized` está en
   true y next/image sirve el archivo directo. Eso vale cero transformaciones,
   pero traslada la responsabilidad acá: si una fuente entra pesada, se sirve
   pesada. Este script es la contraparte de esa decisión.

   Qué hace: convierte a WebP cada PNG y JPEG de public/assets/images, lo
   achica si pasa del ancho en que se muestra, y reescribe las rutas en el
   código. El original se borra: está en el historial de git.

   Cuando se escribió, las 106 imágenes del sitio ya estaban en WebP y
   ninguna pasaba de 1728 px, así que la primera corrida no tenía nada que
   hacer. Está para lo que venga: una foto nueva arrastrada desde el
   escritorio entra en PNG de 4000 px si nadie la mira.

   Es idempotente. Correrlo dos veces no hace nada la segunda.

   Uso:  npm run imagenes
         npm run imagenes -- --simular    (no escribe, solo informa)
   ═══════════════════════════════════════════════════ */

import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { basename, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RAIZ = fileURLToPath(new URL("..", import.meta.url));
const IMAGENES = join(RAIZ, "public", "assets", "images");
const SIMULAR = process.argv.includes("--simular");

const CONVERTIBLES = /\.(png|jpe?g|webp)$/i;

/* Ancho máximo por carpeta, en píxeles: el ancho al que la imagen se muestra,
   por dos para pantallas de densidad doble. Lo que no esté acá usa el tope
   general, que es una guarda y no una medida. */
const ANCHOS = [
  { prefijo: "banner/", ancho: 1920 },
  { prefijo: "background/", ancho: 1920 },
  { prefijo: "projects/", ancho: 1400 },
  { prefijo: "products/", ancho: 1400 },
  { prefijo: "carousel_services/", ancho: 1200 },
  { prefijo: "shape/", ancho: 800 },
  { prefijo: "icons/", ancho: 400 },
];
const POR_DEFECTO = 1400;
const CALIDAD = 78;

/* El favicon y los logotipos en PNG se quedan como están: su formato es
   parte del contrato con quien los consume, y un WebP ahí deja al sitio sin
   icono en parte de los navegadores. */
const INTOCABLES = [/^favicon/i, /^icons\//i];

const topeDe = (rel) =>
  (ANCHOS.find((r) => rel.startsWith(r.prefijo)) ?? { ancho: POR_DEFECTO }).ancho;

function listar(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) listar(p, acc);
    else if (CONVERTIBLES.test(e.name)) acc.push(p);
  }
  return acc;
}

function fuentesDeCodigo(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".next" || e.name.startsWith(".")) continue;
    const p = join(dir, e.name);
    if (p === fileURLToPath(import.meta.url)) continue;
    if (e.isDirectory()) fuentesDeCodigo(p, acc);
    else if (/\.(tsx?|jsx?|mjs|json|css)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const porHacer = [];
for (const ruta of listar(IMAGENES)) {
  const rel = relative(IMAGENES, ruta).split("\\").join("/");
  if (INTOCABLES.some((re) => re.test(rel))) continue;
  const meta = await sharp(readFileSync(ruta)).metadata();
  const tope = topeDe(rel);
  const yaEsWebp = extname(ruta).toLowerCase() === ".webp";
  if (yaEsWebp && meta.width <= tope) continue;
  porHacer.push({ ruta, rel, tope, meta });
}

if (porHacer.length === 0) {
  console.log("\nNada por convertir: todo está en WebP y dentro de su ancho.\n");
  process.exit(0);
}

console.log(`\n${porHacer.length} archivo(s) por procesar${SIMULAR ? " (simulación)" : ""}\n`);
console.log("archivo                                   antes    después   ahorro   ancho");
console.log("─".repeat(84));

let antesTotal = 0;
let despuesTotal = 0;

for (const { ruta, rel, tope, meta } of porHacer) {
  const antes = statSync(ruta).size;
  const achica = meta.width > tope;

  /* sharp lee en diferido. Si la fuente ya es .webp, destino y origen son el
     mismo archivo, y en Windows escribir sobre un identificador abierto falla
     con UNKNOWN. Cargarlo a memoria primero suelta el archivo. */
  let pipeline = sharp(readFileSync(ruta));
  if (achica) pipeline = pipeline.resize({ width: tope, withoutEnlargement: true });
  const buffer = await pipeline.webp({ quality: CALIDAD, effort: 6 }).toBuffer();

  /* Reencodear un WebP que ya venía bien comprimido puede dejarlo más pesado.
     Si no mejora, el trabajo juega en contra: se deja el original. */
  if (buffer.length >= antes && extname(ruta).toLowerCase() === ".webp") {
    console.log(
      rel.slice(0, 38).padEnd(40) +
        String(Math.round(antes / 1024)).padStart(5) + " KB" +
        "        —".padStart(11) +
        "  se deja: reencodear lo empeora",
    );
    antesTotal += antes;
    despuesTotal += antes;
    continue;
  }

  const destino = ruta.slice(0, -extname(ruta).length) + ".webp";
  antesTotal += antes;
  despuesTotal += buffer.length;

  console.log(
    rel.slice(0, 38).padEnd(40) +
      String(Math.round(antes / 1024)).padStart(5) + " KB" +
      String(Math.round(buffer.length / 1024)).padStart(8) + " KB" +
      String(Math.round((1 - buffer.length / antes) * 100) + "%").padStart(9) +
      (achica ? `   ${meta.width}→${tope}` : `   ${meta.width}`),
  );

  if (!SIMULAR) {
    writeFileSync(destino, buffer);
    if (destino !== ruta) unlinkSync(ruta);
  }
}

console.log("─".repeat(84));
console.log(
  "total".padEnd(40) +
    String(Math.round(antesTotal / 1024)).padStart(5) + " KB" +
    String(Math.round(despuesTotal / 1024)).padStart(8) + " KB" +
    String(Math.round((1 - despuesTotal / antesTotal) * 100) + "%").padStart(9),
);

/* La reescritura no se apoya en lo que se convirtió en esta corrida, sino en
   lo que hay en disco: así una corrida interrumpida a medias se repara sola
   la próxima vez, en vez de dejar el código apuntando a archivos que ya no
   existen. */
if (!SIMULAR) {
  const refs = /\/assets\/images\/[A-Za-z0-9@_\-./() ]+?\.(?:png|jpe?g)/g;
  let tocados = 0;
  for (const archivo of fuentesDeCodigo(RAIZ)) {
    const original = readFileSync(archivo, "utf8");
    const nuevo = original.replace(refs, (ref) => {
      if (existsSync(join(RAIZ, "public", ref))) return ref;
      const webp = ref.slice(0, -extname(ref).length) + ".webp";
      return existsSync(join(RAIZ, "public", webp)) ? webp : ref;
    });
    if (nuevo !== original) {
      writeFileSync(archivo, nuevo);
      tocados++;
      console.log(`  rutas actualizadas en ${relative(RAIZ, archivo).split("\\").join("/")}`);
    }
  }
  console.log(`\n${tocados} archivo(s) de código actualizados.`);
}
console.log("");
