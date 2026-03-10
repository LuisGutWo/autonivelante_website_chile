import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MobileMenu from "./MobileMenu";

vi.mock("../../hooks/useRedux", () => ({
  useAppSelector: vi.fn(),
}));

vi.mock("../common/CartCount", () => ({
  default: () => <span data-testid="cart-count">2</span>,
}));

vi.mock("./Menu", () => ({
  default: () => <ul data-testid="mobile-menu-links"><li>Menu Item</li></ul>,
}));

const { useAppSelector } = await import("../../hooks/useRedux");

describe("MobileMenu Component", () => {
  const handleMobileMenu = vi.fn();
  const handleSidebar = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders as accessible dialog with overlay when sidebar is active", () => {
    vi.mocked(useAppSelector).mockReturnValue([
      { id: "p1", title: "Producto", price: 1000, image: "/x.webp", qty: 2 },
    ]);

    render(
      <MobileMenu
        isSidebar
        handleMobileMenu={handleMobileMenu}
        handleSidebar={handleSidebar}
      />,
    );

    expect(
      screen.getByRole("dialog", { name: "Menú de navegación móvil" }),
    ).toBeInTheDocument();

    const overlayButton = screen.getByRole("button", {
      name: "Cerrar menú lateral",
    });
    expect(overlayButton).toHaveStyle({ display: "block" });
  });

  it("closes menu when pressing Escape key", () => {
    vi.mocked(useAppSelector).mockReturnValue([]);

    render(
      <MobileMenu
        isSidebar={false}
        handleMobileMenu={handleMobileMenu}
        handleSidebar={handleSidebar}
      />,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(handleMobileMenu).toHaveBeenCalledTimes(1);
  });

  it("calls handlers from close and overlay buttons", () => {
    vi.mocked(useAppSelector).mockReturnValue([]);

    render(
      <MobileMenu
        isSidebar
        handleMobileMenu={handleMobileMenu}
        handleSidebar={handleSidebar}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Cerrar menú de navegación" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Cerrar menú" }));
    fireEvent.click(screen.getByRole("button", { name: "Cerrar menú lateral" }));

    expect(handleMobileMenu).toHaveBeenCalledTimes(2);
    expect(handleSidebar).toHaveBeenCalledTimes(1);
  });

  it("uses dynamic aria-label for cart link when items exist", () => {
    vi.mocked(useAppSelector).mockReturnValue([
      { id: "p1", title: "A", price: 1000, image: "/a.webp", qty: 1 },
      { id: "p2", title: "B", price: 1500, image: "/b.webp", qty: 1 },
    ]);

    render(
      <MobileMenu
        isSidebar={false}
        handleMobileMenu={handleMobileMenu}
        handleSidebar={handleSidebar}
      />,
    );

    expect(
      screen.getByRole("link", { name: "Ver carrito con 2 productos" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("cart-count")).toBeInTheDocument();
  });

  it("moves focus to close button when menu opens", () => {
    vi.mocked(useAppSelector).mockReturnValue([]);

    render(
      <MobileMenu
        isSidebar
        handleMobileMenu={handleMobileMenu}
        handleSidebar={handleSidebar}
      />,
    );

    const closeButton = screen.getByRole("button", { name: "Cerrar menú" });
    expect(document.activeElement).toBe(closeButton);
  });

  it("traps focus inside menu dialog when tabbing", async () => {
    const user = userEvent.setup();
    vi.mocked(useAppSelector).mockReturnValue([]);

    render(
      <MobileMenu
        isSidebar
        handleMobileMenu={handleMobileMenu}
        handleSidebar={handleSidebar}
      />,
    );

    const logoLink = screen.getByRole("link", {
      name: "autonivelante Mobile Navbar Logo",
    });
    const instagramLink = screen.getByRole("link", {
      name: "Visitar perfil de Instagram",
    });

    instagramLink.focus();
    await user.tab();
    expect(document.activeElement).toBe(logoLink);

    logoLink.focus();
    await user.tab({ shift: true });
    expect(document.activeElement).toBe(instagramLink);
  });
});
