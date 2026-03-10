"use client";
import { Container } from "react-bootstrap";
import MainHomeCard from "../elements/cards/MainHomeCard";
import CardSkeleton from "../elements/CardSkeleton";
import { useHomeProducts } from "../../hooks/useProducts";
import { logger, LogCategory } from "../../lib/logger";
import React from "react";

/**
 * HomeProductsList - Client Component para mostrar productos destacados
 *
 * ✨ Características:
 * - Usa React Query para caching automático
 * - Stale-while-revalidate (5 min stale, 10 min cache)
 * - Deduplicación automática de requests
 * - Loading states y error handling
 *
 * 🔄 Se usa en app/homeproducts/page.jsx (Server Component wrapper)
 */
export default function HomeProductsList(): React.ReactElement {
  const { data: homeProducts, isLoading, error } = useHomeProducts();

  // Loading state
  if (isLoading) {
    return (
      <Container fluid>
        <div className="products__card-container productcard__text">
          <CardSkeleton variant="product" count={4} />
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container fluid>
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">
            Error al cargar productos destacados
          </h4>
          <p>{error.message}</p>
          <hr />
          <p className="mb-0">
            Por favor, intenta recargar la página o contacta con soporte.
          </p>
        </div>
      </Container>
    );
  }

  // Validar y filtrar productos
  if (!Array.isArray(homeProducts)) {
    return (
      <Container fluid>
        <div className="alert alert-warning text-center" role="alert">
          La respuesta de productos destacados no es válida. Verifica tu
          configuración de Firebase.
        </div>
      </Container>
    );
  }

  const products = homeProducts.filter(
    (product) => product !== null && product !== undefined,
  );

  // Empty state
  if (products.length === 0) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <h3 className="text-muted">No se encontraron productos destacados</h3>
          <p>Por favor, verifica tu base de datos o vuelve más tarde.</p>
        </div>
      </Container>
    );
  }

  // Success - Render products
  return (
    <Container fluid>
      <div className="products__card-container productcard__text">
        <div className="outer-container d-flex flex-row flex-wrap justify-content-center gap-4 align-items-center">
          {products.map((product) => {
            if (!product) {
              logger.warn(
                "HomeProductsList: A product is null or undefined",
                { message: "Please check your API response" },
                LogCategory.PRODUCT
              );
              return null;
            }

            return <MainHomeCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </Container>
  );
}
