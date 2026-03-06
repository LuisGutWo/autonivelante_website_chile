"use client";

import React from "react";
import { Container } from "react-bootstrap";
import Carousel from "react-multi-carousel";
import MainCard from "../cards/MainCard";
import "react-multi-carousel/lib/styles.css";
const CarouselPage = ({ products }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 767, min: 464 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <section id="carousel" className="carousel__page">
      <div className="grey__square"></div>

      <Container className="carousel__main-section">
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          responsive={responsive}
          shouldResetAutoplay={false}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          customTransition="1000ms ease-in-out"
          transitionDuration={1000}
          containerClass="carousel__content"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          dotListClass="custom-dot-list-style"
        >
          {products.map((product) => (
            <MainCard key={product.id} product={product} />
          ))}
        </Carousel>
      </Container>
    </section>
  );
};
export default CarouselPage;
