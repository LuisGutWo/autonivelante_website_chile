/**
 * StructuredData Component
 * 
 * Renders JSON-LD structured data for SEO optimization.
 * Supports Organization, LocalBusiness, Product, and BreadcrumbList schemas.
 * 
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
 */

import React from "react";

interface StructuredDataProps {
  data: Record<string, unknown>;
}

/**
 * Renders JSON-LD structured data in a script tag
 */
export default function StructuredData({ data }: StructuredDataProps): React.ReactElement {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Organization Schema
 * Used for company/brand information
 */
export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Autonivelante Chile",
  url: "https://autonivelante.cl",
  logo: "https://autonivelante.cl/assets/images/logo/logo.webp",
  description: "Empresa chilena especializada en productos de nivelación de pisos, autonivelantes, adhesivos y acabados innovadores.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Libertador Bernardo O'Higgins",
    addressLocality: "Santiago",
    addressRegion: "Región Metropolitana",
    addressCountry: "CL",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+56-9-1234-5678",
    contactType: "customer service",
    areaServed: "CL",
    availableLanguage: ["Spanish"],
  },
  sameAs: [
    "https://www.facebook.com/autonivelante",
    "https://www.instagram.com/autonivelante",
  ],
});

/**
 * LocalBusiness Schema
 * Used for local business pages (contact, about)
 */
export const createLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Autonivelante Chile",
  image: "https://autonivelante.cl/assets/images/logo/logo.webp",
  "@id": "https://autonivelante.cl",
  url: "https://autonivelante.cl",
  telephone: "+56-9-1234-5678",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Libertador Bernardo O'Higgins",
    addressLocality: "Santiago",
    addressRegion: "Región Metropolitana",
    postalCode: "8320000",
    addressCountry: "CL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -33.4489,
    longitude: -70.6693,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
    opens: "09:00",
    closes: "18:00",
  },
  areaServed: {
    "@type": "Country",
    name: "Chile",
  },
});

/**
 * Product Schema
 * Used for individual product pages
 */
export const createProductSchema = (product: {
  id: string;
  title: string;
  price: number;
  description?: string;
  image?: string;
  category?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.title,
  image: product.image || "https://autonivelante.cl/assets/images/products/default.webp",
  description: product.description || `${product.title} - Productos de nivelación de pisos de alta calidad`,
  sku: product.id,
  brand: {
    "@type": "Brand",
    name: "Autonivelante Chile",
  },
  offers: {
    "@type": "Offer",
    url: `https://autonivelante.cl/products/${product.id}`,
    priceCurrency: "CLP",
    price: product.price,
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "Autonivelante Chile",
    },
  },
  category: product.category || "Construcción y Acabados",
});

/**
 * BreadcrumbList Schema
 * Used for breadcrumb navigation
 */
export const createBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * WebSite Schema
 * Used for the main website/homepage
 */
export const createWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Autonivelante Chile",
  url: "https://autonivelante.cl",
  description: "Especialistas en productos de nivelación de pisos, autonivelantes, adhesivos y acabados innovadores para la construcción.",
  publisher: {
    "@type": "Organization",
    name: "Autonivelante Chile",
    logo: {
      "@type": "ImageObject",
      url: "https://autonivelante.cl/assets/images/logo/logo.webp",
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "https://autonivelante.cl/products?search={search_term_string}",
    "query-input": "required name=search_term_string",
  },
});
