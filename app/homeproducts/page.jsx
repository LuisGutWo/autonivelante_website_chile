import { Container } from "react-bootstrap";
import Layout from '../../src/components/layout/Layout';
import Breadcrumb from '../../src/components/common/Breadcrumb/Breadcrumb';
import HomeProductsList from '../../src/components/products/HomeProductsList';

/**
 * HomeProductsPage - Server Component para página de productos destacados
 *
 * 🎯 Estrategia de Arquitectura:
 * - Esta página es Server Component (mejor SEO, metadata, initial load)
 * - El fetching de datos se delega a HomeProductsList (Client Component)
 * - HomeProductsList usa React Query para caching automático
 *
 * ✨ Beneficios:
 * - Server-side rendering del shell (Layout, Breadcrumb)
 * - Client-side caching con React Query (stale-while-revalidate)
 * - Deduplicación automática de requests
 * - Mejor performance: caché + optimistic UI
 */
export default async function HomeProducts() {
  const breadcrumbItems = [{ name: "Productos", href: "products" }];

  return (
    <Layout headerStyle={2} footerStyle={1}>
      <Container className="mt_150">
        <Breadcrumb items={breadcrumbItems} />
        <div className="d-flex justify-content-center align-items-center">
          <section
            id="products"
            className="products__card-section p_relative pt-3 centred sec-pad"
          >
            {/* Client Component con React Query caching */}
            <HomeProductsList />
          </section>
        </div>
      </Container>
    </Layout>
  );
}
