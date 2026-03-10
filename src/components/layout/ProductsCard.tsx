"use client";

import { Container } from "react-bootstrap";
import MainHomeCard from "../elements/cards/MainHomeCard";
import CardSkeleton from "../elements/CardSkeleton";
import { useHomeProducts } from "../../hooks/useProducts";

export default function ProductsCard(): React.ReactElement {
  const { data: products, isLoading, error } = useHomeProducts();

  if (isLoading) {
    return (
      <section
        id="products"
        className="products__card-section p_relative pt-3 centred sec-pad"
      >
        <Container fluid>
          <div className="products__card-container productcard__text">
            <CardSkeleton variant="product" count={4} />
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="products"
        className="products__card-section p_relative pt-3 centred sec-pad"
      >
        <Container fluid>
          <div className="text-center">
            <p className="text-danger">Error al cargar productos</p>
            <small className="text-muted">{error.message}</small>
          </div>
        </Container>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section
        id="products"
        className="products__card-section p_relative pt-3 centred sec-pad"
      >
        <Container fluid>
          <div className="text-center">
            <p className="text-muted">No hay productos disponibles</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      id="products"
      className="products__card-section p_relative pt-3 centred sec-pad"
    >
      <Container fluid>
        <div className="products__card-container productcard__text">
          <div
            className="product__card-title wow fadeIn animated"
            data-wow-delay="01ms"
            data-wow-duration="1000ms"
          >
            <h2 className="productcard__title blue text-dark text-center fw-bold">
              Nuestros Productos
            </h2>
            <div className="productcard__bar"></div>
          </div>

          <div className="products__card-box d-flex flex-row flex-wrap justify-content-center gap-4  align-items-center">
            {products.map((product, index) => (
              <MainHomeCard key={product.id} product={product} id={index} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
