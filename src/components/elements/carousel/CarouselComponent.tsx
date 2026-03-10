"use client";
import React from "react";
import CarouselPage from "./CarouselPage";
import CardSkeleton from "../CardSkeleton";
import { useProductsPage } from "../../../hooks/useProducts";

export default function CarouselComponent(): React.ReactElement {
  // ✨ Usar React Query hook - Caching automático + stale-while-revalidate
  const { data, isLoading, error } = useProductsPage();

  if (isLoading) {
    return (
      <div className="carousel__container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
          }}
        >
          <CardSkeleton variant="product" count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="carousel__container text-center p-4">
        <p className="text-danger">Error al cargar productos del carousel</p>
        <small className="text-muted">{error.message}</small>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="carousel__container text-center p-4">
        <p className="text-muted">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="carousel__container">
      <CarouselPage products={data} />
    </div>
  );
}
