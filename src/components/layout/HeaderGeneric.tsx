"use client";

import Link from "next/link";
import Menu from "./Menu";
import MobileMenu from "./MobileMenu";
import { Image } from "react-bootstrap";
import { ShoppingBag } from "lucide-react";
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
 * Header generico - reemplaza Header.jsx y HeaderAux.jsx
 */
export default function HeaderGeneric({
  scroll = 0,
  isMobileMenu = false,
  handleMobileMenu,
  isSidebar = false,
  variant = "main",
}: HeaderGenericProps): React.ReactElement {
  const isScrolled = typeof scroll === "boolean" ? scroll : scroll > 0;

  const headerClassName =
    variant === "aux"
      ? "main-header header-style_aux"
      : "main-header header-style";

  const cartIconColor = variant === "aux" ? undefined : "#fff";

  return (
    <>
      <header className={`${headerClassName} ${isScrolled ? "fixed-header" : ""}`}>
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
                <div className="mobile-nav-toggler" onClick={handleMobileMenu}>
                  <i className="icon-bar"></i>
                  <i className="icon-bar"></i>
                  <i className="icon-bar"></i>
                </div>

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
                  <Link href="/cart" prefetch={false}>
                    <ShoppingBag
                      color={cartIconColor}
                      size={23}
                      className="cart-icon"
                    />
                    <div className="count-products">
                      <span id="contador-productos">
                        <CartCount />
                      </span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={`sticky-header ${isScrolled ? "animated slideInDown" : ""}`}>
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
                <div className="mobile-nav-toggler" onClick={handleMobileMenu}>
                  <i className="icon-bar"></i>
                  <i className="icon-bar"></i>
                  <i className="icon-bar"></i>
                </div>

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
                  <Link href="/cart" prefetch={false}>
                    <ShoppingBag
                      color={cartIconColor}
                      size={23}
                      className="cart-icon"
                    />
                    <div className="count-products">
                      <span id="contador-productos">
                        <CartCount />
                      </span>
                    </div>
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