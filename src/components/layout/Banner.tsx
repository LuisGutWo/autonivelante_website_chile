"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { arrowRightSvg } from "../../lib/icons";

// URL del video hero
const VIDEO_URL =
  "https://firebasestorage.googleapis.com/v0/b/login-huellitas.appspot.com/o/Untitled%20(700%20x%20840%20px)%20(520%20x%20642%20px).webm?alt=media&token=7e7001d5-0216-450f-a1e3-db8ee3c3259a";

// Imagen local cacheable para poster/fallback del hero
const BANNER_POSTER = "/assets/images/banner/autonivelante_banner_img.webp";

export default function Banner(): React.ReactElement {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Precargar video después de que la página esté lista
  useEffect(() => {
    // Pequeño delay para no bloquear la carga inicial
    const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
      setVideoLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="banner-style alternat-2 p_relative">
      {/* Imagen fallback mientras se carga el video */}
      {!videoLoaded || videoError ? (
        <img
          src={BANNER_POSTER}
          alt="Banner de películas autonivelante"
          className="banner-video"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
      ) : null}

      {/* Video optimizado */}
      {videoLoaded && !videoError && (
        <video
          className="banner-video"
          autoPlay={!isMobile} // Desactivar autoplay en móvil para ahorrar datos
          width="100%"
          height="100%"
          loop
          muted
          preload="metadata"
          poster={BANNER_POSTER}
          onError={() => setVideoError(true)}
          playsInline // Para mejor compatibilidad en iOS
        >
          <source src={VIDEO_URL} type="video/webm" />
          {/* Fallback para navegadores sin soporte WebM */}
          <img
            src={BANNER_POSTER}
            alt="Banner de películas autonivelante"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
          Tu navegador no soporta video HTML5. Por favor, usa una versión más
          reciente.
        </video>
      )}
      <div className="banner__container">
        <div className="container-item p_relative">
          <div className="content-box">
            <h1
              className="wow fadeInLeft animated fs_40 fw_sbold mb-5 mt-5 text-light"
              data-wow-delay="00ms"
              data-wow-duration="1000ms"
            >
              Somos expertos
              <br />
              en nivelar superficies
              <br />
              industriales y
              <br />
              residenciales
            </h1>
            <div
              className="btn-box wow fadeInLeft animated"
              data-wow-delay="00ms"
              data-wow-duration="1500ms"
            >
              <Link
                href="/contact-page"
                prefetch={false}
                className="theme-btn-one bg-theme-color border-0"
              >
                Contáctanos
                {arrowRightSvg}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
