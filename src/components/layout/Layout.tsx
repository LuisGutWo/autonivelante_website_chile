"use client";
import React, { useState, useEffect, useCallback, ReactNode } from "react";
import BackToTop from "../elements/BackToTop";
import DataBg from "../elements/DataBg";
import Footer from "./Footer";
import Header from "./Header";
import HeaderAux from "./HeaderAux";
import WhatsAppButton from "../elements/WhatsAppButton";
import ErrorBoundary from "../common/ErrorBoundary";

interface LayoutProps {
  headerStyle?: number;
  footerStyle?: number;
  children: ReactNode;
  wrapperCls?: string;
}

export default function Layout({
  headerStyle,
  footerStyle,
  children,
  wrapperCls,
}: LayoutProps): React.ReactElement {
  const [scroll, setScroll] = useState<boolean>(false);
  const [isMobileMenu, setMobileMenu] = useState<boolean>(false);

  const handleMobileMenu = useCallback(() => {
    setMobileMenu(!isMobileMenu);
    !isMobileMenu
      ? document.body.classList.add("mobile-menu-visible")
      : document.body.classList.remove("mobile-menu-visible");
  }, [isMobileMenu]);

  useEffect(() => {
    let isMounted = true;

    const initWow = async (): Promise<void> => {
      try {
        const wowModule = await import("wowjs");
        if (!isMounted) return;

        (window as any).wow = new wowModule.WOW({ live: false });
        (window as any).wow.init();
      } catch {
        // Avoid blocking layout if WOW fails to load.
      }
    };

    initWow();

    const scrollEffect = (): void => {
      setScroll(window.scrollY > 100);
    };

    document.addEventListener("scroll", scrollEffect);
    return () => {
      isMounted = false;
      document.removeEventListener("scroll", scrollEffect);
    };
  }, []);

  return (
    <>
      <DataBg />

      <div className={`page-wrapper ${wrapperCls ? wrapperCls : ""}`} id="#top">
        {!headerStyle || headerStyle === 1 ? (
          <Header
            scroll={scroll}
            isMobileMenu={isMobileMenu}
            handleMobileMenu={handleMobileMenu}
          />
        ) : null}
        {!headerStyle || headerStyle === 2 ? (
          <HeaderAux
            scroll={scroll}
            isMobileMenu={isMobileMenu}
            handleMobileMenu={handleMobileMenu}
          />
        ) : null}

        <ErrorBoundary>{children}</ErrorBoundary>

        {!footerStyle ? <Footer /> : null}
        {footerStyle === 1 ? <Footer /> : null}
      </div>

      <WhatsAppButton />

      {scroll ? <BackToTop /> : null}
    </>
  );
}
