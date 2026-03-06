import "../public/assets/css/style.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Providers from "../redux/Providers";
import QueryProvider from "../src/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { inter, jost } from "../src/lib/font";
import ErrorBoundary from "../src/components/common/ErrorBoundary";

export const metadata = {
  title: "Autonivelante Chile | Instalación Profesional para Hogar e Industria",
  metadataBase: new URL("https://autonivelante.cl"),
  description:
    "Pisos Autonivelantes en Chile: Instalación Profesional para Hogar e Industria.",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

import React from "react";

export default function RootLayout({ children }) {
  if (!children) {
    throw new Error(
      "RootLayout expects 'children' to be a valid React node, but received " +
        children,
    );
  }

  if (!React.isValidElement(children)) {
    throw new Error(
      "RootLayout expects 'children' to be a valid React element, but received " +
        children,
    );
  }

  return (
    <html
      lang="es"
      className={`${inter.variable} ${jost.variable}`}
      suppressHydrationWarning={true}
    >
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
        <link
          rel="dns-prefetch"
          href="https://firebasestorage.googleapis.com"
        />
        <meta name="author" content="LAG media" />
      </head>
      <body>
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
