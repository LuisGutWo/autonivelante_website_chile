"use client";
// ⚠️ DEPRECATED: Use ProductCard component instead
// Este archivo ahora es un wrapper que usa ProductCard genérico

import ProductCard from '../../common/ProductCard';

/**
 * @deprecated Usar ProductCard en /src/components/common/ProductCard en su lugar
 * Este componente ahora es simplemente un wrapper del nuevo ProductCard genérico
 * para mantener compatibilidad hacia atrás.
 */
export default function CartProduct({ cartItem }) {
  return <ProductCard variant="cart" product={cartItem} />;
}

/* Archivo completamente refactorizado - ver ProductCard.jsx en /src/components/common/ProductCard */
