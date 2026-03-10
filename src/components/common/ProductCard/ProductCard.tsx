"use client";
import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../../hooks/useRedux";
import {
  addToCart,
  removeFromCart,
  incrementQty,
  decrementQty,
} from "../../../../redux/slices/cartSlice";
import { Files, Minus, Plus, Trash2 } from "lucide-react";
import { formatPrice } from "../../../config/formatPrice";
import { logger, LogCategory } from "../../../lib/logger";
import type { ProductCardProps, Product, CartItem } from "../../../types";
import ImageSkeleton from "../../elements/ImageSkeleton";
import "./ProductCard.css";

/**
 * ProductCard - Componente genérico para mostrar productos en diferentes contextos
 * 
 * OPTIMIZADO con React.memo y useCallback para evitar re-renders innecesarios.
 * Se renderiza frecuentemente en listas, por lo que la performance es crítica.
 *
 * @component
 * @example
 * ```tsx
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
const ProductCard: React.FC<ProductCardProps> = ({
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
  const dispatch = useAppDispatch();
  const [imgLoading, setImgLoading] = useState<boolean>(true);

  // Validación del producto
  if (!product) {
    logger.warn(
      "ProductCard: No se encontró información del producto",
      { message: "El prop 'product' es requerido" },
      LogCategory.PRODUCT
    );
    return null;
  }

  // Type guard para CartItem
  const isCartItem = (prod: Product | CartItem): prod is CartItem => {
    return 'qty' in prod;
  };

  // ==========================================
  // HANDLERS OPTIMIZADOS CON useCallback
  // ==========================================
  
  const handleAddToCart = useCallback((): void => {
    try {
      dispatch(addToCart(product));
      toast.success(`${product.title} se agregó al carrito`);
      onAddToCartProp?.(product);
    } catch (error) {
      logger.error(
        "Error al agregar al carrito",
        error,
        { productId: product.id },
        LogCategory.CART
      );
      toast.error("Error al agregar el producto al carrito");
    }
  }, [dispatch, product, onAddToCartProp]);

  const handleRemoveFromCart = useCallback((): void => {
    try {
      dispatch(removeFromCart(product.id));
      toast.success(`${product.title} se removió del carrito`);
      onRemove?.(product.id);
    } catch (error) {
      logger.error(
        "Error al remover del carrito",
        error,
        { productId: product.id },
        LogCategory.CART
      );
      toast.error("Error al remover el producto");
    }
  }, [dispatch, product.id, product.title, onRemove]);

  const handleIncrementQty = useCallback((): void => {
    if (isCartItem(product)) {
      dispatch(incrementQty(product.id));
      onQtyChange?.(product.id, product.qty + 1);
    }
  }, [dispatch, product, onQtyChange]);

  const handleDecrementQty = useCallback((): void => {
    if (isCartItem(product)) {
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
    }
  }, [dispatch, product, onQtyChange, handleRemoveFromCart]);

  // ==========================================
  // GRID VIEW (Productos - Home y Products)
  // ==========================================
  if (variant === "grid") {
    const viewDetailsUrl = href || `/products/${product.id}`;

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
              prefetch={false}
              aria-label={`Ver detalles de ${product.title}`}
              className="product-card-image-wrapper-link"
            >
              <div className="product-card-image-wrapper">
                {imgLoading && (
                  <div className="product-card-image-loading">
                    <ImageSkeleton width="100%" height={imageHeight} variant="rectangular" />
                  </div>
                )}
                <Image
                  src={product.image}
                  alt={product.title || "Product"}
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
                prefetch={false}
                className="product-card-btn"
                title={`Ver detalles de ${product.title}`}
              >
                <Files size={18} />
              </Link>
            </div>

            {/* Add to cart button - slides up on hover */}
            <div className="product-card-add-to-cart-hover">
              <button
                onClick={handleAddToCart}
                disabled={disableAddToCart}
                aria-label={`Agregar ${product.title} al carrito`}
              >
                Agregar al carro
              </button>
            </div>
          </div>

          {/* Content Section - Title and Price */}
          <div className="product-card-content">
            {product.title && (
              <h3 className="product-card-title">
                <Link href={viewDetailsUrl} prefetch={false}>
                  {product.title}
                </Link>
              </h3>
            )}

            {product.price && (
              <div className="product-card-price">
                {formatPrice(product.price)}
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
  if (variant === "cart" && isCartItem(product)) {
    const totalPrice = product.price * product.qty;

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
            aria-label={`Eliminar ${product.title}`}
            title="Eliminar producto"
          >
            <Trash2 size={20} />
          </button>
        </td>

        {/* Image and Info */}
        <td colSpan={4} className="product-card-cart-info">
          <div className="product-card-cart-content">
            <Image
              src={product.image}
              alt={product.title || "Product"}
              width={100}
              height={100}
              priority
              unoptimized
              style={{ objectFit: "cover" }}
              sizes="100px"
            />

            <div className="product-card-cart-details">
              {product.title && <h3>{product.title}</h3>}
            </div>
          </div>
        </td>

        {/* Price */}
        <td className="product-card-cart-price">
          <span className="product-card-cart-total">
            {formatPrice(totalPrice)}
          </span>
          <span className="product-card-cart-qty-label">x{product.qty}</span>
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

            <span className="product-card-qty-value">{product.qty}</span>

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
  logger.warn(
    `ProductCard: Variante no reconocida`,
    { variant, receivedVariant: variant },
    LogCategory.UI
  );
  return null;
};

/**
 * Función de comparación personalizada para React.memo
 * Solo re-renderiza si cambian props relevantes
 */
const arePropsEqual = (
  prevProps: ProductCardProps,
  nextProps: ProductCardProps
): boolean => {
  return (
    prevProps.product?.id === nextProps.product?.id &&
    prevProps.variant === nextProps.variant &&
    prevProps.product?.qty === nextProps.product?.qty &&
    prevProps.product?.price === nextProps.product?.price &&
    prevProps.disableAddToCart === nextProps.disableAddToCart &&
    prevProps.showQuantityControls === nextProps.showQuantityControls
  );
};

// Exportar componente memoizado
export default React.memo(ProductCard, arePropsEqual);
