"use client";
import Link from "next/link";
import { useCallback, useState, useEffect, useRef } from "react";
import { Image } from "react-bootstrap";
import { ShoppingBag, X, Facebook, Instagram } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import CartCount from "../common/CartCount";
import Menu from "./Menu";

interface MobileMenuProps {
  isSidebar: boolean;
  handleMobileMenu: () => void;
  handleSidebar: () => void;
}

/**
 * MobileMenu component - Menu responsivo para dispositivos móviles
 * Optimizado para reutilizar componente Menu para evitar duplicación de lógica
 */
export default function MobileMenu({
  isSidebar,
  handleMobileMenu,
  handleSidebar,
}: MobileMenuProps): React.ReactElement {
  const [isActive, setIsActive] = useState<string | boolean>(false);
  const cart = useAppSelector((state) => state.cart);
  const hasItems = cart && cart.length > 0;
  const menuRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback(
    (key: string) => setIsActive((prev) => (prev === key ? false : key)),
    [],
  );

  // Keyboard navigation: ESC para cerrar el menú
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        handleMobileMenu();
      }

      if (event.key !== "Tab" || !menuRef.current) {
        return;
      }

      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length === 0) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    // Solo agregar el listener cuando el menú está visible
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [handleMobileMenu]);

  useEffect(() => {
    if (!isSidebar) {
      return;
    }

    closeButtonRef.current?.focus();
  }, [isSidebar]);

  return (
    <>
      <div className="mobile-menu" id="mobile-menu">
        <button
          className="menu-backdrop"
          onClick={handleMobileMenu}
          aria-label="Cerrar menú de navegación"
          type="button"
        />
        <button
          className="close-btn"
          onClick={handleMobileMenu}
          aria-label="Cerrar menú"
          type="button"
          ref={closeButtonRef}
        >
          <X aria-hidden="true" size={20} />
        </button>

        <nav
          className="menu-box"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación móvil"
          ref={menuRef}
        >
          <div className="nav-logo">
            <Link href="/" prefetch={false}>
              <Image
                src="/assets/images/logo_horizontal.webp"
                className="img-fluid"
                height={50}
                width={150}
                alt="autonivelante Mobile Navbar Logo"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/assets/images/logo_horizontal.png";
                }}
              />
            </Link>
          </div>

          <div>
            <div className="mb-4 text-center">
              <Link
                href="/cart"
                onClick={handleMobileMenu}
                prefetch={false}
                aria-label={hasItems ? `Ver carrito con ${cart.length} producto${cart.length > 1 ? 's' : ''}` : "Ver carrito"}
              >
                <ShoppingBag color="white" size={30} className="cart-icon" />
                {hasItems && (
                  <div className="count-products-mobile">
                    <span id="contador-productos-mobile">
                      <CartCount />
                    </span>
                  </div>
                )}
              </Link>
            </div>
          </div>

          <div className="menu-outer">
            <div
              className="collapse navbar-collapse show clearfix"
              id="navbarSupportedContent"
            >
              {/* Reutilizar componente Menu para evitar duplicación de lógica menuList */}
              <Menu />
            </div>
          </div>

          <div className="social-links">
            <ul className="clearfix">
              <li>
                <Link
                  href="https://web.facebook.com/profile.php?id=100088723373843"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visitar página de Facebook"
                >
                  <Facebook aria-hidden="true" size={20} />
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/autonivelante_cl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visitar perfil de Instagram"
                >
                  <Instagram aria-hidden="true" size={20} />
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <button
        className="nav-overlay"
        style={{ display: isSidebar ? "block" : "none" }}
        onClick={handleSidebar}
        aria-label="Cerrar menú lateral"
        type="button"
      />
    </>
  );
}
