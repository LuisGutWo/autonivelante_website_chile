"use client";
import React, { useState, CSSProperties } from "react";
import Image from "next/image";
import ImageSkeleton from "./ImageSkeleton";
import "./OptimizedImage.css";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataUrl?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  sizes?: string;
  objectFit?: "fill" | "contain" | "cover" | "scale-down" | "none";
  objectPosition?: string;
  onLoadingComplete?: () => void;
}

/**
 * OptimizedImage - Componente de imagen optimizada con carga progresiva
 * Soporta blur-up effect y skeleton loader
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  blurDataUrl,
  priority = false,
  className = "",
  containerClassName = "",
  sizes = "(max-width: 600px) 100vw, 300px",
  objectFit = "cover",
  objectPosition = "center",
  onLoadingComplete,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(!priority);
  const [hasError, setHasError] = useState<boolean>(false);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    onLoadingComplete?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const imageStyle: CSSProperties = {
    objectFit: objectFit as any,
    objectPosition: objectPosition,
    opacity: isLoading ? 0.7 : 1,
    transition: "opacity 0.3s ease-in-out",
  };

  return (
    <div className={`optimized-image-container ${containerClassName}`}>
      {isLoading && !hasError && (
        <div className="optimized-image-placeholder">
          <ImageSkeleton width="100%" height="100%" variant="rectangular" />
        </div>
      )}

      {hasError ? (
        <div
          className="optimized-image-error"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <p>Error al cargar imagen</p>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`optimized-image ${className}`}
          style={imageStyle}
          placeholder={blurDataUrl ? "blur" : "empty"}
          blurDataURL={blurDataUrl}
          onLoadingComplete={handleLoadingComplete}
          onError={handleError}
          priority={priority}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
