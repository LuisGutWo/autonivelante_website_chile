"use client";
import React, { useMemo } from "react";
import { useAppSelector } from "../../hooks/useRedux";

/**
 * CartCount - Muestra la cantidad total de items en el carrito
 * 
 * Optimizado con useMemo para evitar cálculos innecesarios en cada render.
 * Solo recalcula cuando el carrito cambia realmente.
 */
const CartCount = React.memo((): React.ReactElement | null => {
  const cart = useAppSelector((state) => state.cart);

  // Memoizar el cálculo de cantidad total
  const totalQuantity = useMemo(() => {
    return cart.reduce((acc, cartItem) => acc + cartItem.qty, 0);
  }, [cart]);

  // Si no hay items, no renderizar nada
  if (totalQuantity === 0) {
    return null;
  }

  return <span>{totalQuantity}</span>;
});

CartCount.displayName = "CartCount";

export default CartCount;
