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
      if (confirm(`Desea agregar ${product.title} al carrito?`)) {
        dispatch(addToCart(product));
        toast.success(
          `Se agrego satisfactoriamente ${product.title} al carrito!`
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
      toast.error("Ocurrió un error al agregar el producto al carrito");
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
            <h2 className="fw-bold pb-3">{product.title ?? "Product Name"}</h2>
            <h5 className="fw-bold mb_25">{product.subtitle ?? ""}</h5>
            {product.desc ? (
              <>
                <p className="text-dark">{product.desc}</p>
              </>
            ) : (
              <p className="fs_16 mt-2 mb-2 fw-bold"></p>
            )}
            {product.details ? (
              <>
                <p className="fs_16 mt-2 mb-2 fw-bold">Caracteristicas :</p>
                <ul className="text-dark list-style-one">
                  {product.details.map((detail, index) => (
                    <li key={index}>
                      {pointCharacteristicSvg} {detail}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="fs_16 mt-2 mb-2 fw-bold"></p>
            )}

            <div className="detailcard-price fw-bold">
              {product.price ? formatPrice(product.price) : "Sin precio"}
            </div>
            <div className="buttons__card d-flex flex-column w-75">
              <Button
                onClick={handleAddItemToCart}
                className="btn btn-primary btn-lg w-100 d-flex justify-content-evenly align-content-center"
                             aria-label={`Agregar ${product?.title || 'producto'} al carrito`}
              >
                <b>Agregar al carro</b>
                 <ShoppingBag aria-hidden="true" />
              </Button>
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
