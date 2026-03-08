import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CartItem, Product } from "../../src/types";
import type { RootState } from "../store";

// Define el state type
type CartState = CartItem[];

/**
 * Carga el state desde localStorage
 */
const loadState = (): CartState | undefined => {
    if (typeof window === "undefined") {
        return undefined;
    }

    try {
        const serializedState = window.localStorage.getItem("cart");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState) as CartState;
    } catch (err) {
        console.error("Error loading cart state:", err);
        return undefined;
    }
};

/**
 * Guarda el state en localStorage
 */
const saveState = (store: CartState): void => {
    if (typeof window === "undefined") {
        return;
    }

    try {
        const serializedState = JSON.stringify(store);
        window.localStorage.setItem("cart", serializedState);
    } catch (err) {
        console.error("Error saving cart state:", err);
    }
};

// Load initial state from localStorage
const initialState: CartState = loadState() || [];

/**
 * Cart Slice - Manejo del carrito de compras con Redux Toolkit
 */
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        /**
         * Agregar producto al carrito
         * Si ya existe, incrementa la cantidad
         */
        addToCart: (store, action: PayloadAction<Product>) => {
            if (!action?.payload) {
                console.warn("addToCart called without payload");
                return;
            }

            const { id, title, price, image } = action.payload;

            if (!id || !title || typeof price !== "number" || !image) {
                console.warn("addToCart received invalid product payload", action.payload);
                return;
            }

            // Check if the item already exists in the cart
            const existingItem = store.find((item) => item.id === id);

            if (existingItem) {
                // If the item exists, update the quantity
                existingItem.qty += 1;
            } else {
                // If the item doesn't exist, add it to the cart
                store.push({
                    id,
                    title,
                    price,
                    image,
                    qty: 1
                });
            }

            saveState(store);
        },

        /**
         * Remover producto del carrito completamente
         */
        removeFromCart: (store, action: PayloadAction<string>) => {
            if (!action?.payload) {
                return;
            }

            const cartId = action.payload;
            const index = store.findIndex((item) => item.id === cartId);

            if (index !== -1) {
                store.splice(index, 1);
                saveState(store);
            }
        },

        /**
         * Incrementar cantidad de un producto
         */
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

        /**
         * Decrementar cantidad de un producto
         * Si la cantidad es 1, no hace nada (usar removeFromCart para eliminar)
         */
        decrementQty: (store, action: PayloadAction<string>) => {
            if (!action?.payload) {
                return;
            }

            const cartId = action.payload;
            const cartItem = store.find((item) => item.id === cartId);

            if (cartItem && cartItem.qty > 1) {
                cartItem.qty -= 1;
                saveState(store);
            }
        },

        /**
         * Limpiar todo el carrito
         */
        clearCart: (store) => {
            store.length = 0;
            saveState(store);
        },
    },
});

// Export the reducers (actions)
export const {
    addToCart,
    removeFromCart,
    incrementQty,
    decrementQty,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartItems = (state: RootState): CartItem[] => state.cart;
export const selectCartTotal = (state: RootState): number =>
    state.cart.reduce((total, item) => total + item.price * item.qty, 0);
export const selectCartItemCount = (state: RootState): number =>
    state.cart.reduce((count, item) => count + item.qty, 0);
