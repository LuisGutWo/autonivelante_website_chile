"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import Layout from "../../src/components/layout/Layout";
import Image from "next/image";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { exitButtonSvg } from "../../src/lib/icons";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => <div className="text-light mt-4">Cargando video...</div>,
});

const ModalVideoPage = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [hasPlayerError, setHasPlayerError] = useState(false);

  const imageSrc = "./assets/images/background/autonivelante_contact_bg.webp";

  return (
    <Layout headerStyle={2} footerStyle={1}>
      <section className="modalvideo__section">
        <div className="modalvideo__section-bg">
          {imageSrc && (
            <Image
              src={imageSrc}
              layout="fill"
              style={{ width: "100%", height: "100%" }}
              alt="Background Autonivelante Image"
              onError={(e) => console.error("Error loading image:", e)}
            />
          )}
        </div>
        <div className="modalvideo__section-inner">
          {!hasPlayerError && (
            <ReactPlayer
              url="https://youtu.be/tBoRtfl5Kfk?si=MC9GvXxcMg9sVwZ8"
              controls={false}
              width={isMobile ? "100%" : "60%"}
              height={isMobile ? "40%" : "80%"}
              loop
              onError={() => setHasPlayerError(true)}
            />
          )}
          {hasPlayerError && (
            <p className="text-light">
              No se pudo cargar el video en este momento.
            </p>
          )}
          <div className="exit__button-card">
            <Link href="#about-section" title="Exit Button Link Icon">
              {exitButtonSvg}
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ModalVideoPage;
