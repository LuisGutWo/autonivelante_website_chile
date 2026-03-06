import { createSlice } from "@reduxjs/toolkit";

// Define the initial state from localStorage
const loadState = () => {
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
const saveState = (store) => {
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

// Load initial state from localStorage
const initialState = loadState() || [];

//Create the slice with Reducers
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Slice to add to cart
    addToCart: (store, action) => {
      const { id, title, price, image } = action.payload;
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
    removeFromCart: (store, action) => {
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
    incrementQty: (store, action) => {
      const cartId = action.payload;
      const cartItem = store.find((item) => item.id === cartId);
      if (cartItem) {
        cartItem.qty += 1;
        saveState(store);
      }
    },
    decrementQty: (store, action) => {
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
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
