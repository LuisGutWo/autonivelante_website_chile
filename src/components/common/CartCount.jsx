"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export default function CartCount() {
  const cart = useSelector((state) => state.cart);
  const [cartLength, setCartLength] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  React.useEffect(() => {
    setCartLength(cart.length);
  }, [cart]);

  React.useEffect(() => {
    const quantitySum = cart.reduce((acc, cartItem) => acc + cartItem.qty, 0);
    setTotalQuantity(quantitySum);
  }, [cart]);

  if (cartLength > 0) {
    return <span>{totalQuantity}</span>;
  }

  return <span>0</span>;
}
