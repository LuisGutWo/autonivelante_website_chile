#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE VERIFICACIÓN DE VARIABLES DE ENTORNO
 *
 * Este script verifica que todas las variables necesarias estén configuradas
 * en tu archivo .env.local
 *
 * CÓMO USAR:
 * node scripts/verify-env.js
 *
 * O agregar como script en package.json:
 * "verify-env": "node scripts/verify-env.js"
 */

const fs = require("fs");
const path = require("path");

// Colores para terminal
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
};

console.log(
  `\n${colors.blue}🔍 VERIFICACIÓN DE VARIABLES DE ENTORNO${colors.reset}\n`,
);
console.log("─".repeat(60));

// Variables requeridas (críticas para que la app funcione)
const REQUIRED_VARS = [
  // Firebase (Públicas)
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_APP_ID",

  // Firebase Database URLs
  "NEXT_PUBLIC_FIREBASE_DATABASE_URL",

  // EmailJS
  "NEXT_PUBLIC_EMAILJS_PUBLIC_KEY",
  "NEXT_PUBLIC_EMAILJS_SERVICE_ID",
];

// Variables opcionales (recomendadas pero no críticas)
const OPTIONAL_VARS = [
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "NEXT_STRIPE_SECRET_KEY",
  "NEXT_PUBLIC_EMAILJS_TEMPLATE_ID",
  "NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID",
  "NEXT_PUBLIC_GA_MEASUREMENT_ID",
  "NEXT_PUBLIC_CONTACT_EMAIL",
  "NEXT_PUBLIC_WHATSAPP_NUMBER",
];

// Variables privadas (solo verificar si existen, no mostrar valor)
const PRIVATE_VARS = [
  "NEXT_STRIPE_SECRET_KEY",
  "NEXT_STRIPE_WEBHOOK_SECRET",
  // Legacy fallback - prefer NEXT_PUBLIC_FIREBASE_DATABASE_URL
  "NEXT_FIREBASE_DATABASE_URL",
];

// Cargar variables de .env.local si existe
const envPath = path.join(process.cwd(), ".env.local");
const envExamplePath = path.join(process.cwd(), ".env.local.example");

let envExists = false;
let envExampleExists = false;

try {
  fs.accessSync(envPath);
  envExists = true;
  console.log(`${colors.green}✓${colors.reset} Archivo .env.local encontrado`);

  // Cargar variables del archivo
  const envContent = fs.readFileSync(envPath, "utf8");
  const lines = envContent.split("\n");

  lines.forEach((line) => {
    const match = line.match(/^([A-Z_]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
} catch (error) {
  console.log(`${colors.red}✗${colors.reset} Archivo .env.local NO encontrado`);
}

try {
  fs.accessSync(envExamplePath);
  envExampleExists = true;
  console.log(
    `${colors.green}✓${colors.reset} Archivo .env.local.example encontrado`,
  );
} catch (error) {
  console.log(
    `${colors.yellow}⚠${colors.reset} Archivo .env.local.example NO encontrado`,
  );
}

console.log("─".repeat(60));

// Verificar variables requeridas
console.log(
  `\n${colors.magenta}📋 VARIABLES REQUERIDAS (Críticas)${colors.reset}\n`,
);

let missingRequired = 0;
REQUIRED_VARS.forEach((varName) => {
  const value = process.env[varName];
  if (
    !value ||
    value.trim() === "" ||
    value.includes("xxxxx") ||
    value.includes("XXXXX")
  ) {
    console.log(
      `${colors.red}✗${colors.reset} ${varName} - FALTA O VALOR DE EJEMPLO`,
    );
    missingRequired++;
  } else {
    // Ocultar parte del valor por seguridad
    const maskedValue =
      value.length > 20
        ? value.substring(0, 10) + "..." + value.substring(value.length - 5)
        : value.substring(0, 5) + "...";
    console.log(`${colors.green}✓${colors.reset} ${varName} - ${maskedValue}`);
  }
});

// Verificar variables opcionales
console.log(
  `\n${colors.magenta}📋 VARIABLES OPCIONALES (Recomendadas)${colors.reset}\n`,
);

let missingOptional = 0;
OPTIONAL_VARS.forEach((varName) => {
  const value = process.env[varName];
  if (
    !value ||
    value.trim() === "" ||
    value.includes("xxxxx") ||
    value.includes("XXXXX")
  ) {
    console.log(`${colors.yellow}⚠${colors.reset} ${varName} - No configurada`);
    missingOptional++;
  } else {
    const maskedValue =
      value.length > 20
        ? value.substring(0, 10) + "..." + value.substring(value.length - 5)
        : value.substring(0, 5) + "...";
    console.log(`${colors.green}✓${colors.reset} ${varName} - ${maskedValue}`);
  }
});

// Verificar variables privadas (sin mostrar valor)
console.log(
  `\n${colors.magenta}🔒 VARIABLES PRIVADAS (Solo Servidor)${colors.reset}\n`,
);

PRIVATE_VARS.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value.trim() === "") {
    console.log(`${colors.yellow}⚠${colors.reset} ${varName} - No configurada`);
  } else {
    console.log(
      `${colors.green}✓${colors.reset} ${varName} - Configurada (valor oculto)`,
    );
  }
});

// Resumen final
console.log("\n" + "─".repeat(60));
console.log(`\n${colors.blue}📊 RESUMEN${colors.reset}\n`);

const totalRequired = REQUIRED_VARS.length;
const configuredRequired = totalRequired - missingRequired;
const percentageRequired = Math.round(
  (configuredRequired / totalRequired) * 100,
);

console.log(
  `Variables Requeridas: ${configuredRequired}/${totalRequired} (${percentageRequired}%)`,
);
console.log(
  `Variables Opcionales: ${OPTIONAL_VARS.length - missingOptional}/${OPTIONAL_VARS.length}`,
);

console.log("\n" + "─".repeat(60));

// Estado final
if (!envExists) {
  console.log(
    `\n${colors.red}❌ ERROR: No se encontró .env.local${colors.reset}`,
  );
  console.log(`\n${colors.yellow}SOLUCIÓN:${colors.reset}`);
  console.log("1. Copia el archivo de ejemplo:");
  console.log(
    `   ${colors.green}cp .env.local.example .env.local${colors.reset}`,
  );
  console.log("2. Edita .env.local con tus credenciales reales");
  console.log("3. Reinicia el servidor: npm run dev\n");
  process.exit(1);
}

if (missingRequired > 0) {
  console.log(`\n${colors.red}❌ CONFIGURACIÓN INCOMPLETA${colors.reset}`);
  console.log(`\nFaltan ${missingRequired} variables REQUERIDAS.`);
  console.log(`\n${colors.yellow}PRÓXIMOS PASOS:${colors.reset}`);
  console.log("1. Abre .env.local");
  console.log("2. Completa las variables marcadas con ✗");
  console.log("3. Obtén las credenciales de:");
  console.log("   - Firebase: https://console.firebase.google.com");
  console.log("   - EmailJS: https://dashboard.emailjs.com");
  console.log("   - Stripe: https://dashboard.stripe.com/apikeys");
  console.log("4. Reinicia el servidor\n");
  process.exit(1);
}

console.log(`\n${colors.green}✅ CONFIGURACIÓN COMPLETA${colors.reset}\n`);
console.log("Todas las variables requeridas están configuradas.");
console.log("La aplicación debería funcionar correctamente.\n");

if (missingOptional > 0) {
  console.log(
    `${colors.yellow}ℹ${colors.reset} Hay ${missingOptional} variables opcionales sin configurar.`,
  );
  console.log("Considera configurarlas para funcionalidad completa.\n");
}

process.exit(0);
