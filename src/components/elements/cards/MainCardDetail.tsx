"use client";
import React, { useCallback } from "react";
import { Button, Container, Image } from "react-bootstrap";
import { useAppDispatch } from "../../../hooks/useRedux";
import { addToCart } from '../../../../redux/slices/cartSlice';
import "swiper/css/thumbs";
import "react-multi-carousel/lib/styles.css";
import PropTypes from "prop-types";
import { formatPrice } from '../../../config/formatPrice';
import toast from "react-hot-toast";
import { ShoppingBag } from "lucide-react";
import { pointCharacteristicSvg } from '../../../lib/icons';
import { logger, LogCategory } from '../../../lib/logger';

/**
 * MainCardDetail - Detalles del producto con imagen y descripción
 * 
 * OPTIMIZADO con useCallback para evitar re-renders innecesarios.
 */
const MainCardDetail = React.memo(({ product }) => {
  const dispatch = useAppDispatch();

  const handleAddItemToCart = useCallback(() => {
    if (
      !product ||
      !product.id ||
      !product.title ||
      !product.price ||
      !product.image
    ) {
      logger.error(
        "No product information available",
        undefined,
        { product },
        LogCategory.PRODUCT
      );
      toast.error("No se encontró información del producto");
      return;
    }

    try {
      if (confirm(`¿Agregar "${product.title}" al carrito de compras?`)) {
        dispatch(addToCart(product));
        toast.success(
          `"${product.title}" se agregó correctamente al carrito`
        );
        logger.info(
          "Product added to cart",
          { productId: product.id, title: product.title },
          LogCategory.CART
        );
      }
    } catch (error) {
      logger.error(
        "Error adding product to cart",
        error,
        { productId: product?.id },
        LogCategory.CART
      );
      toast.error("No se pudo agregar el producto. Intenta nuevamente.");
    }
  }, [dispatch, product]);

  if (!product) {
    logger.warn(
      "Product not provided to MainCardDetail",
      undefined,
      LogCategory.PRODUCT
    );
    return <div>Error: No product information available</div>;
  }

  return (
    <section className="detailproducts__card-box">
      <Container fluid className="detailproducts__card-maincontent">
        <div
          className="card detailmain__img-box text-center"
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: "url(/assets/images/shape/white_circle_bg.webp)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "27rem",
          }}
        >
          <Image
            src={product.image}
            className="card-img-top"
            alt="Card Detail Image"
          />
        </div>
        <div className="card detailmain__card">
          <div className="detailcard-body">
            {/* Product Header */}
            <div className="mb-4">
              <h1 className="fw-bold mb-2" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', lineHeight: 1.2 }}>
                {product.title ?? "Product Name"}
              </h1>
              {product.subtitle && (
                <h2 className="fw-normal mb-3" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#6c757d' }}>
                  {product.subtitle}
                </h2>
              )}
              {product.price && (
                <span 
                  className="badge bg-success" 
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', fontWeight: 500 }}
                >
                  ✓ Producto disponible
                </span>
              )}
            </div>

            {/* Product Description */}
            {product.desc && (
              <div className="mb-4">
                <p className="text-dark" style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                  {product.desc}
                </p>
              </div>
            )}

            {/* Product Details */}
            {product.details && product.details.length > 0 && (
              <div className="mb-4">
                <h3 className="fs_16 fw-bold mb-3" style={{ fontSize: '1.1rem', color: '#212529' }}>
                  Características del producto:
                </h3>
                <ul className="text-dark list-style-one" style={{ lineHeight: 1.8 }}>
                  {product.details.map((detail, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>
                      {pointCharacteristicSvg} {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price Section */}
            <div className="mb-4 pb-3" style={{ borderTop: '2px solid #e9ecef', paddingTop: '1.5rem' }}>
              <p className="text-muted mb-2" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                Precio:
              </p>
              <div className="detailcard-price fw-bold" style={{ fontSize: '1.75rem', color: 'var(--theme-color-one, #1a1a2e)' }}>
                {product.price ? formatPrice(product.price) : "Consultar precio"}
              </div>
              <p className="text-muted mt-1" style={{ fontSize: '0.85rem' }}>
                * Precio no incluye IVA ni despacho
              </p>
            </div>

            {/* Action Buttons */}
            <div className="buttons__card d-flex flex-column gap-3">
              <Button
                onClick={handleAddItemToCart}
                className="btn btn-primary btn-lg w-100 d-flex justify-content-center align-items-center gap-2"
                style={{ padding: '0.875rem 1.5rem', fontSize: '1.05rem', fontWeight: 600 }}
                aria-label={`Agregar ${product?.title || 'producto'} al carrito`}
              >
                <ShoppingBag size={20} aria-hidden="true" />
                Agregar al carrito
              </Button>
              <a 
                href="/contact-page" 
                className="btn btn-outline-secondary btn-lg w-100"
                style={{ padding: '0.875rem 1.5rem', fontSize: '1rem' }}
              >
                ¿Consultas? Contáctanos
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
});

MainCardDetail.displayName = "MainCardDetail";

MainCardDetail.propTypes = {
  product: PropTypes.object.isRequired,
};

export default MainCardDetail;
