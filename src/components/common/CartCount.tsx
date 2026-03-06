"use client";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

export default function CartCount(): React.ReactElement | null {
  const cart = useSelector((state: RootState) => state.cart);
  const [cartLength, setCartLength] = useState<number>(0);
  const [totalQuantity, setTotalQuantity] = useState<number>(0);

  useEffect(() => {
    setCartLength(cart.length);
  }, [cart]);

  useEffect(() => {
    const quantitySum = cart.reduce((acc, cartItem) => acc + cartItem.qty, 0);
    setTotalQuantity(quantitySum);
  }, [cart]);

  if (cartLength > 0) {
    return <span>{totalQuantity}</span>;
  }

  return null;
}
