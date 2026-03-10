import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import HeaderGeneric from "./HeaderGeneric";

vi.mock("../../hooks/useRedux", () => ({
  useAppSelector: vi.fn(),
}));

vi.mock("./Menu", () => ({
  default: () => <ul data-testid="desktop-menu"><li>Menu</li></ul>,
}));

vi.mock("../common/CartCount", () => ({
  default: () => <span data-testid="header-cart-count">1</span>,
}));

vi.mock("./MobileMenu", () => ({
  default: () => <div data-testid="mobile-menu-component">Mobile Menu</div>,
}));

const { useAppSelector } = await import("../../hooks/useRedux");

describe("HeaderGeneric Component", () => {
  const handleMobileMenu = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("applies fixed-header class when scroll is greater than zero", () => {
    vi.mocked(useAppSelector).mockReturnValue([]);

    const { container } = render(
      <HeaderGeneric handleMobileMenu={handleMobileMenu} scroll={5} />,
    );

    expect(container.querySelector("header")?.className).toContain("fixed-header");
  });

  it("opens mobile navigation from toggler buttons", () => {
    vi.mocked(useAppSelector).mockReturnValue([]);

    render(<HeaderGeneric handleMobileMenu={handleMobileMenu} scroll={0} />);

    const togglers = screen.getAllByRole("button", {
      name: "Abrir menú de navegación",
    });

    fireEvent.click(togglers[0]);
    fireEvent.click(togglers[1]);

    expect(handleMobileMenu).toHaveBeenCalledTimes(2);
  });

  it("renders mobile menu and aria-expanded when menu is open", () => {
    vi.mocked(useAppSelector).mockReturnValue([]);

    render(<HeaderGeneric handleMobileMenu={handleMobileMenu} isMobileMenu />);

    expect(screen.getByTestId("mobile-menu-component")).toBeInTheDocument();

    const togglers = screen.getAllByRole("button", {
      name: "Abrir menú de navegación",
    });

    for (const toggler of togglers) {
      expect(toggler).toHaveAttribute("aria-expanded", "true");
    }
  });

  it("sets dynamic cart aria-label when cart has items", () => {
    vi.mocked(useAppSelector).mockReturnValue([
      { id: "p1", title: "Producto", price: 1000, image: "/img.webp", qty: 1 },
    ]);

    render(<HeaderGeneric handleMobileMenu={handleMobileMenu} />);

    const cartLinks = screen.getAllByRole("link", {
      name: "Ver carrito con 1 producto",
    });

    expect(cartLinks).toHaveLength(2);
    expect(screen.getAllByTestId("header-cart-count")).toHaveLength(2);
  });
});
