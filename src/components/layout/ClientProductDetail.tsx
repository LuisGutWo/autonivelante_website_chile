"use client";
// Description: This component is responsible for rendering the product detail page.
// It fetches the product data based on the ID from the URL parameters and displays the product details.
import React, { Suspense, useEffect } from "react";
import Preloader from '../elements/Preloader';
import MainCardDetail from "../elements/cards/MainCardDetail";
import CarouselComponent from "../elements/carousel/CarouselComponent";
import { logger, LogCategory } from '../../lib/logger';
import { trackViewItem } from "../../lib/analytics";
import type { Product } from "../../types";

type ProductWithExtras = Product & {
  subtitle?: string;
  desc?: string | string[];
  details?: string[];
};

interface ClientProductDetailProps {
  product: ProductWithExtras;
}

const ClientProductDetail = ({ product }: ClientProductDetailProps) => {
  useEffect(() => {
    if (!product?.id || !product?.title || typeof product?.price !== "number") {
      return;
    }

    trackViewItem({
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
    });
  }, [product?.id, product?.title, product?.price, product?.category]);

  if (!product || !product?.id) {
    logger.error(
      "ClientProductDetail: product is null or undefined or missing id",
      undefined,
      { product },
      LogCategory.PRODUCT
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
    logger.error(
      "ClientProductDetail: an error occurred",
      error,
      { productId: product?.id },
      LogCategory.PRODUCT
    );
    return null;
  }
};

export default ClientProductDetail;
