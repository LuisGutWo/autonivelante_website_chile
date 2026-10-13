"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { arrowRightSvg } from "../../lib/icons";

/*
 * El video del hero se sirve desde public/. Antes salía de Firebase Storage,
 * que hoy responde 402 Payment Required porque la facturación de ese proyecto
 * está cerrada. Esa era la causa del cartel congelado: el <source> fallaba,
 * saltaba onError y el componente cambiaba a una imagen fija que ya no se
 * quitaba nunca.
 *
 * Ahora la imagen es el `poster` del propio <video>, que es para lo que
 * existe: se ve mientras el video carga, y se queda si el video no llega a
 * cargar. No hay una imagen aparte compitiendo con el video, así que no hay
 * estado en el que uno tape al otro de forma permanente.
 *
 * Dos formatos porque Safari no reproduce WebM antes de la versión 16: el
 * navegador se queda con el primer <source> que sabe leer. Si solo existe el
 * .webm, Safari viejo muestra el póster, que es un degradado correcto.
 */
const VIDEO_WEBM = "/assets/video/banner-autonivelante.webm";
const VIDEO_MP4 = "/assets/video/banner-autonivelante.mp4";
const BANNER_POSTER = "/assets/images/banner/autonivelante_banner_img.webp";

export default function Banner(): React.ReactElement {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isClient, setIsClient] = useState<boolean>(false);
  const [sinMovimiento, setSinMovimiento] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  /* Quien pidió menos movimiento en su sistema no debería recibir un video en
     bucle de fondo. Se queda con el póster, que comunica lo mismo. */
  useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = (): void => setSinMovimiento(consulta.matches);
    aplicar();
    consulta.addEventListener("change", aplicar);
    return () => consulta.removeEventListener("change", aplicar);
  }, []);

  /* En teléfono tampoco se reproduce: es decoración de fondo y no justifica
     gastarle los datos a nadie. Sin <source> el archivo ni siquiera se pide,
     así que la portada móvil no paga el ancho de banda del video. */
  const reproduce = isClient && !isMobile && !sinMovimiento;

  return (
    <section className="banner-style alternat-2 p_relative">
      <video
        className="banner-video"
        poster={BANNER_POSTER}
        autoPlay={reproduce}
        loop
        muted
        playsInline
        preload={reproduce ? "metadata" : "none"}
        aria-hidden="true"
        tabIndex={-1}
      >
        {reproduce ? (
          <>
            <source src={VIDEO_WEBM} type="video/webm" />
            <source src={VIDEO_MP4} type="video/mp4" />
          </>
        ) : null}
      </video>

      <div className="banner__container">
        <div className="container-item p_relative">
          <div className="content-box">
            <h1
              className={`fs_40 fw_sbold mb-5 mt-5 text-light ${isClient ? "wow fadeInLeft animated" : ""}`}
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
              className={`btn-box ${isClient ? "wow fadeInLeft animated" : ""}`}
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
