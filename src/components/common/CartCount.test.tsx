import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../../redux/slices/cartSlice";
import CartCount from "./CartCount";

describe("CartCount Component", () => {
  it("does not render when cart is empty", () => {
    const store = configureStore({
      reducer: {
        cart: cartReducer,
      },
      preloadedState: {
        cart: [],
      },
    });

    render(
      <Provider store={store}>
        <CartCount />
      </Provider>
    );

    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument();
  });

  it("renders total quantity when cart has items", () => {
    const store = configureStore({
      reducer: {
        cart: cartReducer,
      },
      preloadedState: {
        cart: [
          {
            id: "prod-1",
            title: "Producto Test",
            price: 1000,
            image: "/test.webp",
            qty: 2,
          },
          {
            id: "prod-2",
            title: "Producto Test 2",
            price: 500,
            image: "/test2.webp",
            qty: 1,
          },
        ],
      },
    });

    const { container } = render(
      <Provider store={store}>
        <CartCount />
      </Provider>
    );

    expect(container.querySelector("span")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
