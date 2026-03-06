"use client";
// ⚠️ DEPRECATED: Use ProductCard component instead
// Este archivo ahora es un wrapper que usa ProductCard genérico

import ProductCard from "../../common/ProductCard";
import { PRODUCT_CARD_IMAGE_SIZE } from "../../../config/productCard";

/**
 * @deprecated Usar ProductCard en /src/components/common/ProductCard en su lugar
 * Este componente ahora es simplemente un wrapper del nuevo ProductCard genérico
 * para mantener compatibilidad hacia atrás.
 */
export default function MainCard({ product, index }) {
  return (
    <ProductCard
      variant="grid"
      product={product}
      index={index}
      href={`/products/${product?.id}`}
      imageHeight={PRODUCT_CARD_IMAGE_SIZE.height}
      imageWidth={PRODUCT_CARD_IMAGE_SIZE.width}
    />
  );
}
