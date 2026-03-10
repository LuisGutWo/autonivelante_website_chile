"use client";
import React from "react";
import { useEffect } from "react";
import { store } from "./store";
import { Provider } from "react-redux";
import { hydrateCart } from "./slices/cartSlice";
import type { CartItem } from "../src/types";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps): React.ReactElement {
  useEffect(() => {
    try {
      const serializedState = window.localStorage.getItem("cart");

      if (!serializedState) {
        return;
      }

      const parsedState = JSON.parse(serializedState) as unknown;

      if (!Array.isArray(parsedState)) {
        return;
      }

      store.dispatch(hydrateCart(parsedState as CartItem[]));
    } catch (error) {
      console.error("Error hydrating cart state:", error);
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
