"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Menu from "./Menu";
import MobileMenu from "./MobileMenu";
import { Image } from "react-bootstrap";
import { ShoppingBag } from "lucide-react";
import { useAppSelector } from "../../hooks/useRedux";
import CartCount from "../common/CartCount";

type HeaderVariant = "main" | "aux";

interface HeaderGenericProps {
  scroll?: number | boolean;
  isMobileMenu?: boolean;
  handleMobileMenu: () => void;
  isSidebar?: boolean;
  variant?: HeaderVariant;
}

/**
 * Header genérico - reemplaza Header.jsx y HeaderAux.jsx
 */
export default function HeaderGeneric({
  scroll = 0,
  isMobileMenu = false,
  handleMobileMenu,
  isSidebar = false,
  variant = "main",
}: HeaderGenericProps): React.ReactElement {
  const [isHydrated, setIsHydrated] = useState(false);
  const isScrolled = typeof scroll === "boolean" ? scroll : scroll > 0;
  const cart = useAppSelector((state) => state.cart);
  const hasItems = cart && cart.length > 0;
  const hydratedHasItems = isHydrated && hasItems;
  const cartAriaLabel = hydratedHasItems
    ? `Ver carrito con ${cart.length} producto${cart.length > 1 ? "s" : ""}`
    : "Ver carrito";

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const headerClassName =
    variant === "aux"
      ? "main-header header-style_aux"
      : "main-header header-style";

  const cartIconColor = variant === "aux" ? undefined : "#fff";

  return (
    <>
      <header
        className={`${headerClassName} ${isScrolled ? "fixed-header" : ""}`}
      >
        <div className="header-lower">
          <div className="outer-container">
            <div className="outer-box">
              <div className="logo-box">
                <Link href="/" prefetch={false}>
                  <figure className="logo">
                    <Image
                      src="/assets/images/logo_horizontal_clear.webp"
                      className="img-fluid"
                      width={120}
                      height={120}
                      alt="Autonivelante main navbar Logo"
                    />
                  </figure>
                </Link>
              </div>

              <div className="menu-area clearfix">
                 <button
                   className="mobile-nav-toggler"
                   onClick={handleMobileMenu}
                   aria-label="Abrir menú de navegación"
                  {...(isMobileMenu && { "aria-expanded": "true" })}
                   type="button"
                 >
                   <i className="icon-bar" aria-hidden="true"></i>
                   <i className="icon-bar" aria-hidden="true"></i>
                   <i className="icon-bar" aria-hidden="true"></i>
                 </button>

                <nav className="main-menu navbar-expand-md navbar-light">
                  <div
                    className="collapse navbar-collapse show clearfix"
                    id="navbarSupportedContent"
                  >
                    <Menu />
                  </div>
                </nav>
              </div>

              <ul className="menu-right-content">
                <li className="cart-box">
                   <Link
                     href="/cart"
                     prefetch={false}
                     aria-label={cartAriaLabel}
                   >
                    <ShoppingBag
                      color={cartIconColor}
                      size={23}
                      className="cart-icon"
                    />
                    {hydratedHasItems && (
                      <div className="count-products">
                        <span id="contador-productos">
                          <CartCount />
                        </span>
                      </div>
                    )}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className={`sticky-header ${isScrolled ? "animated slideInDown" : ""}`}
        >
          <div className="outer-container">
            <div className="outer-box">
              <div className="logo-box">
                <Link href="/" prefetch={false}>
                  <figure className="logo">
                    <Image
                      src="/assets/images/logo_horizontal_clear.webp"
                      className="img-fluid"
                      width={200}
                      height={50}
                      alt="Autonivelante Navbar Logo"
                    />
                  </figure>
                </Link>
              </div>

              <div className="menu-area menu-area2 clearfix">
                 <button
                   className="mobile-nav-toggler"
                   onClick={handleMobileMenu}
                   aria-label="Abrir menú de navegación"
                  {...(isMobileMenu && { "aria-expanded": "true" })}
                   type="button"
                 >
                   <i className="icon-bar" aria-hidden="true"></i>
                   <i className="icon-bar" aria-hidden="true"></i>
                   <i className="icon-bar" aria-hidden="true"></i>
                 </button>

                <nav className="main-menu navbar-expand-md navbar-light clearfix">
                  <div
                    className="collapse navbar-collapse show clearfix"
                    id="navbarSupportedContent2"
                  >
                    <Menu />
                  </div>
                </nav>
              </div>

              <ul className="menu-right-content">
                <li className="cart-box">
                   <Link
                     href="/cart"
                     prefetch={false}
                     aria-label={cartAriaLabel}
                   >
                    <ShoppingBag
                      color={cartIconColor}
                      size={23}
                      className="cart-icon"
                    />
                    {hydratedHasItems && (
                      <div className="count-products">
                        <span id="contador-productos">
                          <CartCount />
                        </span>
                      </div>
                    )}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenu && (
        <MobileMenu
          isSidebar={isMobileMenu || isSidebar}
          handleMobileMenu={handleMobileMenu}
          handleSidebar={handleMobileMenu}
        />
      )}
    </>
  );
}
