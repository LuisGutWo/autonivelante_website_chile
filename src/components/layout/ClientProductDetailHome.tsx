"use client";
// Description: This component is responsible for rendering the product detail page.
// It fetches the product data based on the ID from the URL parameters and displays the product details.
import React, { Suspense } from "react";
import Preloader from '../elements/Preloader';
import MainCardDetail from "../elements/cards/MainCardDetail";
import { logger, LogCategory } from '../../lib/logger';

const ClientProductDetailHome = ({ product }) => {
  if (!product || !product.id) {
    logger.error(
      "ClientProductDetailHome: product is null or undefined or missing id",
      undefined,
      { product },
      LogCategory.PRODUCT
    );
    return null;
  }

  return (
    <div>
      <Suspense fallback={<Preloader />}>
        <MainCardDetail product={product} key={product?.id} />
      </Suspense>
    </div>
  );
};

export default ClientProductDetailHome;
