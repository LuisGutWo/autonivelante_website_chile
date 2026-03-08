"use client";

import Link from "next/link";
import { Button, Col, Container, Row } from "react-bootstrap";
import { rightArrowSvg, serviceSvg } from "../../lib/icons";

import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Autoplay } from "swiper/modules";

const serviceSlides: string[] = [
  "/assets/images/banner/services-banner-image.webp",
  "/assets/images/banner/patio-foster-banner.webp",
  "/assets/images/carousel_services/carrusel-home_01.webp",
  "/assets/images/carousel_services/carrusel-home_02.webp",
  "/assets/images/carousel_services/carrusel-home_04.webp",
  "/assets/images/carousel_services/carrusel-home_05.webp",
  "/assets/images/carousel_services/carrusel-home_06.webp",
  "/assets/images/carousel_services/carrusel-home_08.webp",
];

const servicePoints: string[][] = [
  ["Autonivelantes Cementicios", "Autonivelacion"],
  ["Preparacion de Superficies", "Sobrelosas"],
  ["Afinado de Losas", "Retape"],
  ["Reparacion de Fisuras"],
];

export default function Services(): React.ReactElement {
  return (
    <section
      id="services-section"
      className="service-section p_relative centred sec-pad"
    >
      <Container
        fluid
        className="d-flex justify-content-center wow fadeInUp animated"
        data-wow-delay="00ms"
        data-wow-duration="1000ms"
      >
        <article className="postcard">
          <Swiper
            modules={[Autoplay, Navigation, Pagination, Keyboard]}
            slidesPerView={1}
            spaceBetween={0}
            loop
            pagination={{
              clickable: true,
              type: "progressbar",
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            navigation
            className="mySwiper"
            keyboard
          >
            {serviceSlides.map((imagePath) => (
              <SwiperSlide
                key={imagePath}
                className="postcard__img"
                style={{ backgroundImage: `url(${imagePath})` }}
              />
            ))}
          </Swiper>

          <div className="postcard__text">
            <h2 className="postcard__title blue text-light text-start">
              <Link href="/projects" prefetch={false}>
                Conoce Nuestros
                <br />
                Servicios
              </Link>
            </h2>
            <div className="postcard__bar"></div>
            <div className="postcard__preview-txt">
              Expertos en superficies, al igual que en aplicacion de
              autonivelantes cementicios, nivelacion y afinado de losa,
              sobrelosas, retape, reparacion de fisuras y superficies.
              <br />
              <br />
              Deja tu proyecto en nuestras manos; somos los referentes en
              instalacion y reparacion de toda la gama de pisos vinilicos en
              rollos y en palmetas. Especialistas en instalacion y reparacion en
              toda la gama de pisos vinilicos en rollos y en palmetas.
            </div>
            <Container fluid className="mb-5 text-center">
              {servicePoints.map((row, index) => (
                <Row key={`service-row-${index}`}>
                  {row.map((label) => (
                    <Col key={label}>
                      <div className="postcard__content">
                        {serviceSvg}
                        <p className="text-light">{label}</p>
                      </div>
                    </Col>
                  ))}
                </Row>
              ))}
            </Container>
            <Container className="buttons__container">
              <Link href="/projects" prefetch={false}>
                <Button variant="light" className="service-button">
                  Servicios
                  {rightArrowSvg}
                </Button>{" "}
              </Link>
              <Link href="/contact-page" prefetch={false}>
                <Button variant="outline-light" className="service-button">
                  Contactanos
                  {rightArrowSvg}
                </Button>{" "}
              </Link>
            </Container>
          </div>
        </article>
      </Container>
    </section>
  );
}
