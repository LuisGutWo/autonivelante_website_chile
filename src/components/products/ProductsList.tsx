"use client";
import { Container } from "react-bootstrap";
import MainCard from "../elements/cards/MainCard";
import CardSkeleton from "../elements/CardSkeleton";
import { useMainProducts } from "../../hooks/useProducts";
import { logger, LogCategory } from "../../lib/logger";
import React from "react";

/**
 * ProductsList - Client Component para mostrar productos principales
 *
 * ✨ Características:
 * - Usa React Query para caching automático
 * - Stale-while-revalidate (5 min stale, 10 min cache)
 * - Deduplicación automática de requests
 * - Loading states y error handling
 *
 * 🔄 Se usa en app/products/page.jsx (Server Component wrapper)
 */
export default function ProductsList(): React.ReactElement {
  const { data: mainProducts, isLoading, error } = useMainProducts();

  // Loading state
  if (isLoading) {
    return (
      <Container fluid>
        <div className="products__card-container productcard__text">
          <CardSkeleton variant="product" count={6} />
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container fluid>
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Error al cargar productos</h4>
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
  if (!Array.isArray(mainProducts)) {
    return (
      <Container fluid>
        <div className="alert alert-warning text-center" role="alert">
          La respuesta de productos no es válida. Verifica tu configuración de
          Firebase.
        </div>
      </Container>
    );
  }

  const products = mainProducts.filter(
    (product) => product !== null && product !== undefined,
  );

  // Empty state
  if (products.length === 0) {
    return (
      <Container fluid>
        <div className="text-center py-5">
          <h3 className="text-muted">No se encontraron productos</h3>
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
                "ProductsList: A product is null or undefined",
                { message: "Please check your API response" },
                LogCategory.PRODUCT
              );
              return null;
            }

            return <MainCard key={product.id} product={product} />;
          })}
        </div>
      </div>
    </Container>
  );
}
