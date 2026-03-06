"use client";
import React, { useState } from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
} from '../../../../redux/slices/cartSlice';
import { ShoppingBag, Files, Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from '../../../config/formatPrice';
import "./ProductCard.css";

/**
 * ProductCard - Componente genérico para mostrar productos en diferentes contextos
 *
 * @component
 * @example
 * ```jsx
 * // Grid view (productos)
 * <ProductCard
 *   product={product}
 *   variant="grid"
 *   onViewDetails={handleViewDetails}
 * />
 *
 * // Cart view
 * <ProductCard
 *   product={cartItem}
 *   variant="cart"
 *   onRemove={handleRemove}
 * />
 * ```
 */
const ProductCard = ({
  product,
  variant = "grid",
  index,
  href,
  imageHeight = 200,
  imageWidth = 100,
  onViewDetails,
  onAddToCart: onAddToCartProp,
  onRemove,
  onQtyChange,
  disableAddToCart = false,
  showQuantityControls = false,
  className = "",
  ...props
}) => {
  const dispatch = useDispatch();
  const [imgLoading, setImgLoading] = useState(true);

  // Validación del producto
  if (!product) {
    console.warn(
      "ProductCard: No se encontró información del producto",
      "El prop 'product' es requerido",
    );
    return null;
  }

  // Handlers
  const handleAddToCart = () => {
    try {
      dispatch(addToCart(product));
      toast.success(`${product?.title} se agregó al carrito`);
      onAddToCartProp?.(product);
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      toast.error("Error al agregar el producto al carrito");
    }
  };

  const handleRemoveFromCart = () => {
    try {
      dispatch(removeFromCart(product.id));
      toast.success(`${product?.title} se removió del carrito`);
      onRemove?.(product.id);
    } catch (error) {
      console.error("Error al remover del carrito:", error);
      toast.error("Error al remover el producto");
    }
  };

  const handleIncrementQty = () => {
    dispatch(incrementQty(product.id));
    onQtyChange?.(product.id, product.qty + 1);
  };

  const handleDecrementQty = () => {
    if (product.qty === 1) {
      if (
        typeof window !== "undefined" &&
        window.confirm("¿Desea eliminar este producto?")
      ) {
        handleRemoveFromCart();
      }
    } else {
      dispatch(decrementQty(product.id));
      onQtyChange?.(product.id, product.qty - 1);
    }
  };

  // ==========================================
  // GRID VIEW (Productos - Home y Products)
  // ==========================================
  if (variant === "grid") {
    const linkHref = href || `/products/${product?.id}`;
    const viewDetailsUrl = href || `/products/${product?.id}`;

    return (
      <div
        key={index}
        className={`product-card product-card-grid ${className}`}
      >
        <div className="product-card-container">
          {/* Image with hover effect */}
          <div className="product-card-image">
            <Link
              href={viewDetailsUrl}
              aria-label={`Ver detalles de ${product?.title}`}
              className="product-card-image-wrapper-link"
            >
              <div className="product-card-image-wrapper">
                {imgLoading && (
                  <div className="product-card-image-loading">
                    <div className="spinner" />
                  </div>
                )}
                <Image
                  src={product?.image}
                  alt={product?.title || "Product"}
                  height={imageHeight}
                  width={imageWidth}
                  onLoad={() => setImgLoading(false)}
                  onError={() => setImgLoading(false)}
                  style={{
                    visibility: imgLoading ? "hidden" : "visible",
                    objectFit: "cover",
                  }}
                  sizes="(max-width: 600px) 100vw, 300px"
                  loading="lazy"
                />
              </div>
            </Link>

            {/* Action buttons overlay - appear on hover */}
            <div className="product-card-actions">
              <Link
                href={viewDetailsUrl}
                className="product-card-btn"
                title={`Ver detalles de ${product?.title}`}
              >
                <Files size={18} />
              </Link>
            </div>

            {/* Add to cart button - slides up on hover */}
            <div className="product-card-add-to-cart-hover">
              <button
                onClick={handleAddToCart}
                disabled={disableAddToCart}
                aria-label={`Agregar ${product?.title} al carrito`}
              >
                Agregar al carro
              </button>
            </div>
          </div>

          {/* Content Section - Title and Price */}
          <div className="product-card-content">
            {product?.title && (
              <h3 className="product-card-title">
                <Link href={viewDetailsUrl}>{product?.title}</Link>
              </h3>
            )}

            {product?.price && (
              <div className="product-card-price">
                {formatPrice(product?.price)}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CART VIEW (Carrito)
  // ==========================================
  if (variant === "cart") {
    const totalPrice = (product?.price || 0) * (product?.qty || 1);

    return (
      <tr className={`product-card product-card-cart ${className}`} {...props}>
        {/* Delete Button */}
        <td className="product-card-cart-delete">
          <button
            onClick={() => {
              if (
                product.qty === 1 ||
                (typeof window !== "undefined" &&
                  window.confirm("¿Desea eliminar este producto?"))
              ) {
                handleRemoveFromCart();
              }
            }}
            className="product-card-btn-delete"
            aria-label={`Eliminar ${product?.title}`}
            title="Eliminar producto"
          >
            <Trash2 size={20} />
          </button>
        </td>

        {/* Image and Info */}
        <td colSpan="4" className="product-card-cart-info">
          <div className="product-card-cart-content">
            <Image
              src={product?.image}
              alt={product?.title || "Product"}
              width={100}
              height={100}
              priority
              unoptimized
              style={{ objectFit: "cover" }}
              sizes="100px"
            />

            <div className="product-card-cart-details">
              {product?.title && <h3>{product?.title}</h3>}
            </div>
          </div>
        </td>

        {/* Price */}
        <td className="product-card-cart-price">
          <span className="product-card-cart-total">
            {formatPrice(totalPrice)}
          </span>
          <span className="product-card-cart-qty-label">x{product?.qty}</span>
        </td>

        {/* Quantity Controls */}
        <td className="product-card-cart-qty">
          <div className="product-card-qty-controls">
            <button
              onClick={handleDecrementQty}
              className="product-card-qty-btn"
              aria-label="Disminuir cantidad"
              title="Disminuir"
            >
              <Minus size={16} />
            </button>

            <span className="product-card-qty-value">{product?.qty}</span>

            <button
              onClick={handleIncrementQty}
              className="product-card-qty-btn"
              aria-label="Aumentar cantidad"
              title="Aumentar"
            >
              <Plus size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // Unknown variant
  console.warn(`ProductCard: Variante '${variant}' no reconocida`);
  return null;
};

ProductCard.propTypes = {
  /** Objeto del producto (requerido) */
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number,
    image: PropTypes.string,
    imageHeight: PropTypes.number,
    imageWidth: PropTypes.number,
    qty: PropTypes.number,
  }).isRequired,

  /** Tipo de vista: 'grid' (productos) o 'cart' (carrito) */
  variant: PropTypes.oneOf(["grid", "cart"]),

  /** Índice para key en listas */
  index: PropTypes.number,

  /** URL de destino cuando se clickea en "Ver detalles" */
  href: PropTypes.string,

  /** Altura de imagen */
  imageHeight: PropTypes.number,

  /** Ancho de imagen */
  imageWidth: PropTypes.number,

  /** Callback cuando se hace click en "Ver detalles" */
  onViewDetails: PropTypes.func,

  /** Callback cuando se agrega al carrito */
  onAddToCart: PropTypes.func,

  /** Callback cuando se remueve del carrito */
  onRemove: PropTypes.func,

  /** Callback cuando cambia cantidad */
  onQtyChange: PropTypes.func,

  /** Desabilitar botón "Agregar al carrito" */
  disableAddToCart: PropTypes.bool,

  /** Mostrar controles de cantidad */
  showQuantityControls: PropTypes.bool,

  /** Clases CSS adicionales */
  className: PropTypes.string,
};

export default ProductCard;
