"use client";
import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { checkSvg } from "../../lib/icons";

interface FeatureItem {
  id: number;
  name: string;
}

const caracteristicas: FeatureItem[] = [
  { id: 0, name: "Fácil preparacion y colocación." },
  { id: 1, name: "Solo necesita 4 horas de secado." },
  {
    id: 2,
    name: "Instala revestimientos entre 24 y 48 horas después de su aplicación.",
  },
  { id: 3, name: "Alta estabilidad dimensional y durabilidad." },
  { id: 4, name: "Acabado liso y fino acompañado de alta resistencia final." },
];

export default function MainFeatures() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Container className="mainfeat-section p_relative p-0 ms-auto me-auto">
      <div
        className={`bg-layer ${isClient ? "wow fadeIn animated" : ""}`}
        data-wow-delay="00ms"
        data-wow-duration="1000ms"
        style={{ backgroundColor: "#015c93" }}
      >
        <h2 className="text-light fw-bold">Campos de Aplicación</h2>
        <div className="mainfeat__bar-2"></div>
        <p className="text-light">
          El autonivelante esta diseñado para la instalación de recubrimientos
          de alfombras, pisos vinilicos, de madera, flotantes, y de goma.
          <br />
          <br />
          Es utilizado principalmente para la nivelación reparación y afinado de
          losas, sobrelosas, radieres y pisos de concreto.
        </p>
      </div>
      <div
        className={`auto-container ${isClient ? "wow fadeIn animated" : ""}`}
        data-wow-delay="00ms"
        data-wow-duration="1000ms"
      >
        <div className="row clearfix">
          <div className="col-lg-12 col-md-12 col-sm-12 content-column p-0">
            <div className="content_block_two">
              <div className="content-box p_relative ps-5">
                <div className="featcard__text">
                  <h2 className="featcard__title blue text-dark text-start fw-bold">
                    Caracteristicas
                    <br />
                    Principales
                  </h2>
                  <div className="mainfeat__bar"></div>
                  <ul className="featcard__content">
                    {caracteristicas.map(({ id, name }) => (
                      <li key={id}>
                        {checkSvg || <span>*</span>}
                        <p>{name || "Informacion no disponible"}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`outer-box ${isClient ? "wow fadeIn animated" : ""}`}
        data-wow-delay="00ms"
        data-wow-duration="1000ms"
      >
        <h2>Espesor aplicable</h2>
        <div className="mainfeat__bar"></div>
        <p className="text-dark">
          Cargas desde 3 mm hasta 30 mm de espesor en una sola aplicación;
          tomando en cuenta las especificaciones de cada producto.
        </p>
      </div>
    </Container>
  );
}
