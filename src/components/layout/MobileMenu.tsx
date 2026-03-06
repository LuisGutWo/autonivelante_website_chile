"use client";
import Link from "next/link";
import { useCallback, useState } from "react";
import { Image } from "react-bootstrap";
import { ShoppingBag } from "lucide-react";
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

  const handleToggle = useCallback(
    (key: string) => setIsActive((prev) => (prev === key ? false : key)),
    [],
  );

  return (
    <>
      <div className="mobile-menu">
        <div className="menu-backdrop" onClick={handleMobileMenu} />
        <div className="close-btn" onClick={handleMobileMenu}>
          <span className="far fa-times" />
        </div>

        <nav className="menu-box">
          <div className="nav-logo">
            <Link href="/">
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
              <Link href="/cart" onClick={handleMobileMenu}>
                <ShoppingBag color="white" size={30} className="cart-icon" />
                <div className="count-products-mobile">
                  <span id="contador-productos-mobile">
                    <CartCount />
                  </span>
                </div>
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
                <Link href="https://web.facebook.com/profile.php?id=100088723373843">
                  <span className="fab fa-facebook-square" />
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/autonivelante_cl/">
                  <span className="fab fa-instagram" />
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div
        className="nav-overlay"
        style={{ display: isSidebar ? "block" : "none" }}
        onClick={handleSidebar}
      />
    </>
  );
}
