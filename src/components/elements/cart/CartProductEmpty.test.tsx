import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CartProductEmpty from "./CartProductEmpty";

describe("CartProductEmpty Component", () => {
  it("renders empty cart message and products link", () => {
    render(
      <table>
        <tbody>
          <CartProductEmpty />
        </tbody>
      </table>
    );

    expect(screen.getByText("No hay productos en tu carrito")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "Ir a la página de productos" });
    expect(link).toHaveAttribute("href", "/products");
  });

  it("applies accessibility attributes for live updates", () => {
    const { container } = render(
      <table>
        <tbody>
          <CartProductEmpty />
        </tbody>
      </table>
    );

    const row = container.querySelector("tr");
    const cell = container.querySelector("td");

    expect(row).toHaveAttribute("role", "row");
    expect(row).toHaveAttribute("aria-live", "polite");
    expect(cell).toHaveAttribute("role", "cell");
  });
});
