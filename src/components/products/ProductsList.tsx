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
        <div className="alert alert-danger text-center" role="alert" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h4 className="alert-heading mb-3">No pudimos cargar los productos</h4>
          <p className="mb-3">{error.message}</p>
          <hr />
          <p className="mb-3">
            Verifica tu conexión a internet e intenta recargar la página.
          </p>
          <button 
            className="btn theme-btn-one" 
            onClick={() => window.location.reload()}
          >
            Recargar página
          </button>
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
        <div className="text-center py-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 className="mb-3" style={{ color: '#6c757d' }}>No hay productos disponibles</h3>
          <p className="mb-4" style={{ fontSize: '1rem', color: '#6c757d' }}>
            Estamos actualizando nuestro catálogo. Vuelve pronto para ver nuestras soluciones.
          </p>
          <a href="/contact-page" className="btn theme-btn-one">
            Contactar con ventas
          </a>
        </div>
      </Container>
    );
  }

  // Success - Render products
  return (
    <Container fluid>
      {/* Product count indicator */}
      {/* <div className="text-center mb-4">
        <p className="mb-0" style={{ fontSize: '0.95rem', color: '#6c757d', fontWeight: 500 }}>
          {products.length} {products.length === 1 ? 'producto disponible' : 'productos disponibles'}
        </p>
      </div> */}

      <div className="products__card-container productcard__text">
        <div className="outer-container d-flex flex-row flex-wrap justify-content-center gap-4 align-items-center">
          {products.map((product, index) => {
            if (!product) {
              logger.warn(
                "ProductsList: A product is null or undefined",
                { message: "Please check your API response" },
                LogCategory.PRODUCT
              );
              return null;
            }

            return <MainCard key={product.id} product={product} index={index} />;
          })}
        </div>
      </div>
    </Container>
  );
}
