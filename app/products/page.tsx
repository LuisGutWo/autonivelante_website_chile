import { Container } from "react-bootstrap";
import type { Metadata } from "next";
import Layout from '../../src/components/layout/Layout';
import Breadcrumb from '../../src/components/common/Breadcrumb/Breadcrumb';
import ProductsList from '../../src/components/products/ProductsList';
import React from "react";
import StructuredData, {
  createBreadcrumbSchema,
} from '../../src/components/common/StructuredData';

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Catalogo de productos autonivelantes, promotores de adherencia y soluciones para preparacion de superficies en Chile.",
  alternates: {
    canonical: "/products",
  },
};

/**
 * MainProductsPage - Server Component para página de productos
 *
 * 🎯 Estrategia de Arquitectura:
 * - Esta página es Server Component (mejor SEO, metadata, initial load)
 * - El fetching de datos se delega a ProductsList (Client Component)
 * - ProductsList usa React Query para caching automático
 *
 * ✨ Beneficios:
 * - Server-side rendering del shell (Layout, Breadcrumb)
 * - Client-side caching con React Query (stale-while-revalidate)
 * - Deduplicación automática de requests
 * - Mejor performance: caché + optimistic UI
 */
export default async function MainProductsPage() {
  const breadcrumbItems = [{ name: "Productos", href: "products" }];

  const structuredBreadcrumbItems = [
    { name: "Inicio", url: "https://autonivelante.cl" },
    { name: "Productos", url: "https://autonivelante.cl/products" },
  ];

  return (
    <Layout headerStyle={2} footerStyle={1}>
      <StructuredData data={createBreadcrumbSchema(structuredBreadcrumbItems)} />
      <Container className="mt_150 px-4">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header Section */}
        <div className="text-center mb-5 mt-4">
          <h1 className="mb-3" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 600, color: 'var(--theme-color-one, #1a1a2e)' }}>
            Nuestro Catálogo de Productos
          </h1>
          <p className="mb-0" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.125rem)', color: '#6c757d', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
            Soluciones profesionales en autonivelantes, promotores de adherencia y acabados innovadores. 
            Calidad certificada para tus proyectos de construcción.
          </p>
        </div>

        <div className="d-flex justify-content-center align-items-center">
          <section
            id="products"
            className="products__card-section p_relative pt-3 centred sec-pad"
          >
            {/* Client Component con React Query caching */}
            <ProductsList />
          </section>
        </div>
      </Container>
    </Layout>
  );
}
