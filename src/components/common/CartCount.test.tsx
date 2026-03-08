import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../../redux/slices/cartSlice";
import CartCount from "./CartCount";

describe("CartCount Component", () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    });
  });

  it("should render without crashing with empty cart", () => {
    render(
      <Provider store={store}>
        <CartCount />
      </Provider>
    );

    // Component should render a span with initial quantity
    const span = screen.getByText(/^\d+$/);
    expect(span).toBeInTheDocument();
  });

  it("should render inside Redux Provider", () => {
    const { container } = render(
      <Provider store={store}>
        <CartCount />
      </Provider>
    );

    expect(container.querySelector("span")).toBeInTheDocument();
  });
});
