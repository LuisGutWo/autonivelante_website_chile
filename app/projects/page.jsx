"use client";
import React, { useRef, useState, useCallback } from "react";
import { Container } from "react-bootstrap";
import Layout from '../../src/components/layout/Layout';
import { Image, Modal } from "react-bootstrap";
import styles from "./projects.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";

import Breadcrumb from '../../src/components/common/Breadcrumb/Breadcrumb';
import { projects } from '../../src/config/proyectsList';

const SlideNavigation = (props) => {
  const { className, ...otherProps } = props;
  return (
    <div
      {...otherProps}
      className={`${className} ${styles.project__item__gallery}`}
    />
  );
};

const Gallery = (props) => {
  const { selectedProject, gallery = [] } = props;
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, [sliderRef]);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, [sliderRef]);

  return (
    <div>
      <h6 className="text-dark fw-bold mb-3">{selectedProject}</h6>

      <Swiper
        ref={sliderRef}
        modules={[Navigation, Keyboard]}
        slidesPerView={1}
        spaceBetween={0}
        navigation={false}
        loop
        keyboard
      >
        <SlideNavigation
          className={styles["project__item__gallery--prev"]}
          onClick={handlePrev}
        />

        {gallery.map((image, i) => (
          <SwiperSlide key={i}>
            <Image src={image} alt="" />
          </SwiperSlide>
        ))}

        <SlideNavigation
          className={styles["project__item__gallery--next"]}
          onClick={handleNext}
        />
      </Swiper>
    </div>
  );
};

export default function MainProjectsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const openGallery = (project) => {
    setGallery(project.images);
    setSelectedProject(project.name);
    setModalOpen(true);
  };

  return (
    <Layout headerStyle={2} footerStyle={1}>
      <Container className="mt_150">
        <Breadcrumb items={[{ name: "Proyectos", href: "projects" }]} />

        <section className="py-5">
          {projects.map((item, i) => (
            <div key={i} className={styles.projects__item}>
              <div className="row align-items-center proyects__card">
                <div className={`col-12 col-sm-6 ${i % 2 ? "order-sm-2" : ""}`}>
                  <h2 className="postcard__title blue text-dark text-start fs-3 fw-bold">
                    Proyecto {item.name}
                  </h2>
                  <div className="aboutcard__bar"></div>

                  <div className="mt-5">
                    <p>
                      <strong>Nombre proyecto:</strong> {item.name}
                    </p>
                    <p>
                      <strong>Metros cuadrados:</strong> {item.mt2} m2
                    </p>
                    <p>
                      <strong>Tiempo ejecución:</strong> {item.duration}
                    </p>
                    <p>
                      <strong>Año:</strong> {item.year}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {item.description}
                    </p>
                  </div>
                </div>

                <div className={`col-12 col-sm-6 ${i % 2 ? "order-sm-1" : ""}`}>
                  <figure onClick={() => openGallery(item)}>
                    <Image
                      src={item.thumbnail}
                      alt={item.name}
                      className={styles.projects__img}
                    />
                  </figure>
                </div>
              </div>
            </div>
          ))}
        </section>

        <Modal show={modalOpen} onHide={setModalOpen} size="lg" centered>
          <Modal.Body>
            <Gallery {...{ selectedProject, gallery }} />
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
}
