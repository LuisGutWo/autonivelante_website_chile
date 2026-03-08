"use client";
import Link from "next/link";
import { Button } from "react-bootstrap";
import {
  playVideoSvg,
  arrowRightSvgDark,
  pointCharacteristicSvg,
} from "../../lib/icons";

const caracteristicas = [
  { id: 0, name: "Suelos industriales." },
  { id: 1, name: "Zonas de alto tráfico." },
  { id: 2, name: "Oficinas, Plantas Abiertas." },
  { id: 3, name: "Galpones, Hangares y Bodegas." },
  { id: 4, name: "Estacionamientos." },
];

export default function About() {
  const renderCaracteristicas = caracteristicas.map((caracteristica) => (
    <li key={caracteristica.id}>
      {pointCharacteristicSvg}
      {caracteristica.name}
    </li>
  ));

  return (
    <section id="about-section" className="about__section p_relative">
      <div className="outer-container">
        <div className="row clearfix">
          <div className="col-lg-6 col-md-12 col-sm-13 image-column ml_0 about__main-column">
            <div className="image_block">
              <div className="image-box p_relative">
                <div
                  className="aboutcard__text bg-light wow fadeInUp animated"
                  data-wow-delay="05ms"
                  data-wow-duration="1500ms"
                >
                  <div className="aboutcard__text-inner">
                    <h2 className="postcard__title blue text-dark text-start fs-3 fw-bold">
                      ¿Qué es el autonivelante?
                    </h2>
                    <div className="aboutcard__bar"></div>
                    <div className="aboutcard__preview-txt">
                      El Autonivelante crea una superficie plana, lisa y con
                      resistencia a la compresión; similar o superior a la del
                      concreto tradicional.
                      <br />
                      <br />
                      Se puede utilizar en exterior e interior, como por ejemplo
                      en:
                      <br />
                      <br />
                      <ul>{renderCaracteristicas}</ul>
                    </div>
                  </div>

                  <section className="aboutcard__buttons">
                    <div className="aboutcard__buttons-btn-video">
                      <Link href="/modalvideo" prefetch={false}>
                        <Button size="lg" className="theme-btn-one w-100">
                          <p>Reproducir video</p>
                          {playVideoSvg}
                        </Button>
                      </Link>
                    </div>
                    <div className="aboutcard__buttons-btn-contact">
                      <Link href="/contact-page" prefetch={false}>
                        <Button size="lg" className="theme-btn-tree">
                          <p className="text-dark">Contáctanos</p>
                          {arrowRightSvgDark}
                        </Button>{" "}
                      </Link>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
