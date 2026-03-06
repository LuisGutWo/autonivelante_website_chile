"use client";

import { useEffect } from "react";
import { Container } from "react-bootstrap";
import Layout from '../../src/components/layout/Layout';
import APIError from '../../src/components/common/APIError';

export default function ProductsError({ error, reset }) {
  useEffect(() => {
    console.error("❌ Productos Error:", error);
  }, [error]);

  return (
    <Layout headerStyle={2} footerStyle={1}>
      <Container className="mt_150 px-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <APIError
              error={error}
              onRetry={reset}
              title="Error al cargar productos"
              message="No pudimos cargar los productos. Por favor, intenta nuevamente."
              showDetails={process.env.NODE_ENV === "development"}
            />
          </div>
        </div>
      </Container>
    </Layout>
  );
}
