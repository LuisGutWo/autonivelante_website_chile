"use client";
// Description: This component is responsible for rendering the product detail page.
// It fetches the product data based on the ID from the URL parameters and displays the product details.
import React, { Suspense } from "react";
import Preloader from '../elements/Preloader';
import MainCardDetail from "../elements/cards/MainCardDetail";
import CarouselComponent from "../elements/carousel/CarouselComponent";

const ClientProductDetail = ({ product }) => {
  if (!product || !product?.id) {
    console.error(
      "ClientProductDetail: product is null or undefined or missing id",
      product
    );
    return null;
  }

  try {
    return (
      <div>
        <Suspense fallback={<Preloader />}>
          <MainCardDetail product={product} key={product?.id} />
          <CarouselComponent product={product} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("ClientProductDetail: an error occurred", error);
    return null;
  }
};

export default ClientProductDetail;
