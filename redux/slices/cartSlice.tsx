import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartStateArray } from "../../src/types";

// Re-export CartItem for backward compatibility
export type { CartItem };
export type CartState = CartStateArray;

// Define the initial state from localStorage
const loadState = (): CartState | undefined => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const serializedState = window.localStorage.getItem("cart");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save the state in localStorage
const saveState = (store: CartState): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const serializedState = JSON.stringify(store);
    window.localStorage.setItem("cart", serializedState);
  } catch (err) {
    console.error(err);
  }
};

// Initial state is empty array on both server and client
// Cart will be hydrated from localStorage in the Providers component
const initialState: CartState = [];

//Create the slice with Reducers
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Hydrate cart with data from localStorage (client-side only)
    hydrateCart: (store, action: PayloadAction<CartState>) => {
      // Replace the entire cart state with the hydrated data
      store.length = 0;
      store.push(...action.payload);
    },
    // Slice to add to cart
    addToCart: (store, action: PayloadAction<Omit<CartItem, 'qty'>>) => {
      if (!action?.payload) {
        console.warn("addToCart called without payload");
        return;
      }

      const { id, title, price, image } = action.payload;

      if (!id || !title || typeof price !== "number" || !image) {
        console.warn(
          "addToCart received invalid product payload",
          action.payload,
        );
        return;
      }

      // Check if the item already exists in the cart
      const existingItem = store.find((item) => item.id === id);

      if (existingItem) {
        // If the item exists, update the quantity
        existingItem.qty += 1;
      } else {
        // If the item doesn't exist, add it to the cart
        store.push({ id, title, price, qty: 1, image });
      }

      saveState(store);
    },
    removeFromCart: (store, action: PayloadAction<string>) => {
      if (!action?.payload) {
        return;
      }

      const cartId = action.payload;
      const existingItem = store.find((item) => item.id === cartId);
      if (existingItem) {
        if (existingItem.qty > 1) {
          existingItem.qty -= 1;
        } else {
          const index = store.findIndex((item) => item.id === cartId);
          if (index !== -1) {
            store.splice(index, 1);
          }
        }
        saveState(store);
      }
    },
    incrementQty: (store, action: PayloadAction<string>) => {
      if (!action?.payload) {
        return;
      }

      const cartId = action.payload;
      const cartItem = store.find((item) => item.id === cartId);
      if (cartItem) {
        cartItem.qty += 1;
        saveState(store);
      }
    },
    decrementQty: (store, action: PayloadAction<string>) => {
      if (!action?.payload) {
        return;
      }

      const cartId = action.payload;
      const cartItem = store.find((item) => item.id === cartId);
      if (cartItem && cartItem.qty > 1) {
        cartItem.qty -= 1;
      }

      saveState(store);
    },
    clearCart: (store) => {
      store.length = 0;
      saveState(store);
    },
  },
});
//export the reducers(actions)
export const {
  hydrateCart,
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
