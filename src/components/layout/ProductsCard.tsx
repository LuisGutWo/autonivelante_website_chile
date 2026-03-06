"use client";

import { Container } from "react-bootstrap";
import MainHomeCard from "../elements/cards/MainHomeCard";
import CustomLoader from "../elements/CustomLoader";
import { useHomeProducts } from "../../hooks/useProducts";
import type { Product } from "../../types";

interface ProductsQueryResult {
  data?: Product[];
  isLoading: boolean;
  error: Error | null;
}

export default function ProductsCard(): React.ReactElement {
  // useHomeProducts aun proviene de JS; hacemos cast local para tipado seguro en TSX.
  const { data: products, isLoading, error } =
    useHomeProducts() as ProductsQueryResult;

  if (isLoading) {
    return (
      <section
        id="products"
        className="products__card-section p_relative pt-3 centred sec-pad"
      >
        <Container fluid>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <CustomLoader />
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
