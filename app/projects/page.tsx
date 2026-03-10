"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { Container } from "react-bootstrap";
import Layout from "../../src/components/layout/Layout";
import { Image, Modal } from "react-bootstrap";
import styles from "./projects.module.css";

import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation, Keyboard } from "swiper/modules";

import Breadcrumb from "../../src/components/common/Breadcrumb/Breadcrumb";
import CardSkeleton from "../../src/components/elements/CardSkeleton";
import { projects as projectsData, type Project } from "../../src/config/proyectsList";

interface SlideNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const SlideNavigation = (props: SlideNavigationProps) => {
  const { className, ...otherProps } = props;
  return (
    <div
      {...otherProps}
      className={`${className} ${styles.project__item__gallery}`}
    />
  );
};

interface GalleryProps {
  selectedProject: string;
  gallery: string[];
}

const Gallery = (props: GalleryProps) => {
  const { selectedProject, gallery = [] } = props;
  const sliderRef = useRef<{ swiper: SwiperType } | null>(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

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

        {gallery.map((image: string, i: number) => (
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
  const [gallery, setGallery] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simular carga de proyectos con skeleton loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setProjects(projectsData);
      setIsLoading(false);
    }, 600); // Simula latencia de red

    return () => clearTimeout(timer);
  }, []);

  const openGallery = (project: Project) => {
    setGallery(project.images);
    setSelectedProject(project.name);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Layout headerStyle={2} footerStyle={1}>
      <Container className="mt_150">
        <Breadcrumb items={[{ name: "Proyectos", href: "projects" }]} />

        <section className="py-5">
          {isLoading ? (
            <CardSkeleton variant="project" count={3} />
          ) : (
            projects.map((item, i) => (
              <div key={i} className={styles.projects__item}>
                <div className="row align-items-center proyects__card">
                  <div
                    className={`col-12 col-sm-6 ${i % 2 ? "order-sm-2" : ""}`}
                  >
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

                  <div
                    className={`col-12 col-sm-6 ${i % 2 ? "order-sm-1" : ""}`}
                  >
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
            ))
          )}
        </section>

        <Modal show={modalOpen} onHide={handleCloseModal} size="lg" centered>
          <Modal.Body>
            <Gallery {...{ selectedProject, gallery }} />
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
}
