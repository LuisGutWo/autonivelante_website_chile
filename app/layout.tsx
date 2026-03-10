import "../public/assets/css/style.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Metadata } from "next";
import Providers from "../redux/Providers";
import QueryProvider from "../src/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { inter, jost } from "../src/lib/font";
import ErrorBoundary from "../src/components/common/ErrorBoundary";
import StructuredData, {
  createOrganizationSchema,
  createWebSiteSchema,
} from "../src/components/common/StructuredData";
import GoogleAnalytics from "../src/components/common/GoogleAnalytics";

export const metadata: Metadata = {
  title: {
    default:
      "Autonivelante Chile | Instalacion Profesional para Hogar e Industria",
    template: "%s | Autonivelante Chile",
  },
  applicationName: "Autonivelante Chile",
  metadataBase: new URL("https://autonivelante.cl"),
  description:
    "Pisos autonivelantes en Chile para hogar e industria. Instalacion profesional, productos especializados y proyectos ejecutados.",
  keywords: [
    "autonivelante",
    "autonivelante chile",
    "autonivelante en chile",
    "piso autonivelante",
    "piso autonivelante Chile",
    "piso autonivelante en Chile",
    "piso autonivelante precio",
    "pisos autonivelantes",
    "pisos autonivelantes Chile",
    "pisos autonivelantes en Chile",
    "piso Vinílico",
    "piso Vinílico Chile",
    "piso Vinílico en Chile",
    "Vinílico",
  ],
  authors: [{ name: "LAG media" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://autonivelante.cl",
    siteName: "Autonivelante Chile",
    title: "Autonivelante Chile",
    description:
      "Pisos autonivelantes en Chile para hogar e industria. Instalacion profesional y productos de alta calidad.",
    images: [
      {
        url: "/assets/images/logo_horizontal_clear.webp",
        width: 1200,
        height: 630,
        alt: "Autonivelante Chile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Autonivelante Chile",
    description:
      "Soluciones de pisos autonivelantes en Chile para hogar e industria.",
    images: ["/assets/images/logo_horizontal_clear.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

import React, { ReactNode } from "react";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="es"
      className={`${inter.variable} ${jost.variable}`}
      suppressHydrationWarning={true}
    >
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for Firebase domains */}
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://autonivelante-new-products.firebasestorage.app" />
        
        {/* Structured Data */}
        <StructuredData data={createOrganizationSchema()} />
        <StructuredData data={createWebSiteSchema()} />
      </head>
      <body>
        <GoogleAnalytics measurementId={gaMeasurementId} />
        <QueryProvider>
          <Providers>
            <Toaster position="top-center" reverseOrder={false} />
            <ErrorBoundary>{children}</ErrorBoundary>
          </Providers>
        </QueryProvider>
      </body>
    </html>
  );
}
