"use client";
import React from "react";
import "./ImageSkeleton.css";

interface ImageSkeletonProps {
  width?: number | string;
  height?: number | string;
  variant?: "rectangular" | "circular";
  className?: string;
}

/**
 * ImageSkeleton - Componente de skeleton loader para imágenes
 * Proporciona un placeholder animado mientras se carga la imagen
 */
const ImageSkeleton: React.FC<ImageSkeletonProps> = ({
  width = "100%",
  height = 200,
  variant = "rectangular",
  className = "",
}) => {
  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  return (
    <div
      className={`image-skeleton image-skeleton-${variant} ${className}`}
      style={style}
      role="status"
      aria-label="Cargando imagen"
    >
      <div className="image-skeleton-shimmer" />
    </div>
  );
};

export default ImageSkeleton;
