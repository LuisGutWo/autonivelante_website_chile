import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import Menu from "./Menu";
import { menuList } from "../../config/menu";

describe("Menu Component", () => {
  it("renders all navigation links from menuList", () => {
    render(<Menu />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(menuList.length);

    for (const item of menuList) {
      expect(screen.getByRole("link", { name: item.name })).toBeInTheDocument();
    }
  });

  it("sets aria-current=page on active route", () => {
    render(<Menu />);

    const homeLink = screen.getByRole("link", { name: "Home" });
    const productsLink = screen.getByRole("link", { name: "Productos" });

    expect(homeLink).toHaveAttribute("aria-current", "page");
    expect(productsLink).not.toHaveAttribute("aria-current", "page");
  });

  it("has no critical accessibility violations", async () => {
    const { container } = render(<Menu />);
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});
