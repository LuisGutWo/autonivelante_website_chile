"use client";

import { useEffect } from "react";
import { Container } from "react-bootstrap";
import APIError from '../src/components/common/APIError';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("❌ Global Error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <Container className="mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <APIError
                error={error}
                onRetry={reset}
                title="Algo salió mal"
                message="Se produjo un error inesperado. Por favor, intenta recargar la página."
                showDetails={process.env.NODE_ENV === "development"}
              />
            </div>
          </div>
        </Container>
      </body>
    </html>
  );
}
