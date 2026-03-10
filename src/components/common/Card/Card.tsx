"use client";
import React from "react";
import PropTypes from "prop-types";
import "./Card.css";

/**
 * Card - Contenedor genérico flexible para agrupar contenido relacionado
 *
 * @component
 * @example
 * ```jsx
 * <Card variant="elevated" padding="lg">
 *   <h3>Título</h3>
 *   <p>Contenido de la tarjeta</p>
 * </Card>
 * ```
 */
const Card = React.forwardRef(
  (
    {
      children,
      variant = "default",
      padding = "md",
      noPadding = false,
      hoverable = false,
      clickable = false,
      onClick,
      as: Component = "div",
      className = "",
      ...props
    },
    ref,
  ) => {
    const variantClass = `card-${variant}`;
    const paddingClass = noPadding
      ? "card-no-padding"
      : `card-padding-${padding}`;
    const hoverableClass = hoverable ? "card-hoverable" : "";
    const clickableClass = clickable || onClick ? "card-clickable" : "";

    const combinedClasses = [
      "card",
      variantClass,
      paddingClass,
      hoverableClass,
      clickableClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleClick = (e) => {
      if (onClick && !props.disabled) {
        onClick(e);
      }
    };

    const handleKeyDown = (e) => {
      if ((clickable || onClick) && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        handleClick(e);
      }
    };

    const cardProps = {
      ref,
      className: combinedClasses,
      onClick: onClick ? handleClick : undefined,
      onKeyDown: clickable || onClick ? handleKeyDown : undefined,
      tabIndex: clickable || onClick ? 0 : undefined,
      role: clickable || onClick ? "button" : undefined,
      "aria-disabled": props.disabled || undefined,
      ...props,
    };

    return <Component {...cardProps}>{children}</Component>;
  },
);

Card.displayName = "Card";

Card.propTypes = {
  /** Contenido de la tarjeta */
  children: PropTypes.node.isRequired,

  /** Variante visual de la tarjeta */
  variant: PropTypes.oneOf([
    "default",
    "elevated",
    "outlined",
    "filled",
    "ghost",
  ]),

  /** Tamaño de padding interno */
  padding: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),

  /** Elimina todo el padding (alias de padding="none") */
  noPadding: PropTypes.bool,

  /** Agrega efecto hover (elevación) */
  hoverable: PropTypes.bool,

  /** Hace la tarjeta clickeable (cursor pointer + accesible) */
  clickable: PropTypes.bool,

  /** Callback cuando se hace click en la tarjeta */
  onClick: PropTypes.func,

  /** Elemento HTML a renderizar (default: div) */
  as: PropTypes.elementType,

  /** Clases CSS adicionales */
  className: PropTypes.string,

  /** Estado deshabilitado (para tarjetas clickeables) */
  disabled: PropTypes.bool,
};

/**
 * CardHeader - Header opcional para la tarjeta
 */
export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`card-header ${className}`} {...props}>
      {children}
    </div>
  );
};

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * CardBody - Body principal de la tarjeta
 */
export const CardBody = ({
  children,
  className = "",
  noPadding = false,
  ...props
}) => {
  const paddingClass = noPadding ? "card-body-no-padding" : "";
  return (
    <div className={`card-body ${paddingClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

CardBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  noPadding: PropTypes.bool,
};

/**
 * CardFooter - Footer opcional para la tarjeta
 */
export const CardFooter = ({ children, className = "", ...props }) => {
  return (
    <div className={`card-footer ${className}`} {...props}>
      {children}
    </div>
  );
};

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * CardImage - Imagen para la tarjeta (típicamente en el top)
 */
export const CardImage = ({
  src,
  alt,
  aspectRatio = "16/9",
  className = "",
  ...props
}) => {
  return (
    <div
      className={`card-image ${className}`}
      style={{ aspectRatio }}
      {...props}
    >
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
};

CardImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  aspectRatio: PropTypes.string,
  className: PropTypes.string,
};

export default Card;
