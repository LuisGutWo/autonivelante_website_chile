const nextConfig = {
  // NOTE: output: "export" está deshabilitado para permitir rutas de API dinámicas (Stripe webhooks)
  // Si necesitas exportación estática, estas rutas API deben ser removidas o convertidas a Edge Functions
  // output: "export",

  typescript: {
    tsconfigPath: "./tsconfig.json",
    ignoreBuildErrors: true,
  },

  // ===============================================
  // OPTIMIZACIÓN DE PERFORMANCE
  // ===============================================

  compiler: {
    // Remover console.logs en producción
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // Comprimir respuestas
  compress: true,

  // Optimización de imágenes
  images: {
    unoptimized: false, // Habilitado para optimización
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
    formats: ["image/avif", "image/webp"], // Formatos modernos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 año
  },

  // Headers para caché y seguridad
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        // Cache para assets estáticos
        source: "/assets/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache para imágenes
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Configuración experimental para mejor performance
  experimental: {
    optimizePackageImports: [
      "react-bootstrap",
      "lucide-react",
      "@reduxjs/toolkit",
    ],
  },

  // Logging para debugging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },

  env: {
    // ⚠️ Solo variables PÚBLICAS aquí (sin información sensible)
    // Las variables privadas van en .env.local y se usan solo en servidor

    // ===============================================
    // FIREBASE - Base de Datos y Almacenamiento
    // ===============================================
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_DATABASE_URL:
      process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,

    // ===============================================
    // EMAILJS - Servicio de Email
    // ===============================================
    NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID:
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID:
      process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID,

    // ===============================================
    // STRIPE - Pasarela de Pago
    // ===============================================
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,

    // ===============================================
    // PRODUCTOS - URLs de Firebase
    // ===============================================
    NEXT_PUBLIC_HOME_PRODUCTS_URL: process.env.NEXT_PUBLIC_HOME_PRODUCTS_URL,
    NEXT_PUBLIC_MAIN_PRODUCTS_URL: process.env.NEXT_PUBLIC_MAIN_PRODUCTS_URL,
    NEXT_PUBLIC_PRODUCTS_PAGE_URL: process.env.NEXT_PUBLIC_PRODUCTS_PAGE_URL,

    // ===============================================
    // CONFIGURACIÓN DEL SITIO
    // ===============================================
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL || "https://autonivelante.cl",
    NEXT_PUBLIC_SITE_NAME:
      process.env.NEXT_PUBLIC_SITE_NAME || "Autonivelante Chile",
    NEXT_PUBLIC_SITE_DESCRIPTION:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      "Productos y servicios de nivelación de pisos",
    NEXT_PUBLIC_CONTACT_EMAIL:
      process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contacto@autonivelante.cl",
    NEXT_PUBLIC_CONTACT_PHONE:
      process.env.NEXT_PUBLIC_CONTACT_PHONE || "+56912345678",
    NEXT_PUBLIC_WHATSAPP_NUMBER:
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "56912345678",

    // ===============================================
    // ANALYTICS & TRACKING (Opcional)
    // ===============================================
    NEXT_PUBLIC_GA_MEASUREMENT_ID:
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    NEXT_PUBLIC_FACEBOOK_PIXEL_ID:
      process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || "",
    NEXT_PUBLIC_GTM_ID: process.env.NEXT_PUBLIC_GTM_ID || "",
  },
};

export default nextConfig;
// const withPWA = require("next-pwa")({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
// });

// module.exports = withPWA(nextConfig);
