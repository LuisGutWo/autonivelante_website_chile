"use client";
import React from "react";
import PropTypes from "prop-types";
import "./Button.css";

/**
 * Button - Componente base de botón reutilizable
 *
 * @component
 * @example
 * ```jsx
 * <Button variant="primary" size="md" onClick={() => console.log('clicked')}>
 *   Click Me
 * </Button>
 * ```
 */
const Button = React.forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      disabled = false,
      loading = false,
      type = "button",
      onClick,
      className = "",
      leftIcon,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const baseClass = "btn-component";
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;
    const fullWidthClass = fullWidth ? "btn-full-width" : "";
    const loadingClass = loading ? "btn-loading" : "";

    const classes = [
      baseClass,
      variantClass,
      sizeClass,
      fullWidthClass,
      loadingClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleClick = (e) => {
      if (!disabled && !loading && onClick) {
        onClick(e);
      }
    };

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span className="btn-spinner" aria-hidden="true">
            <svg
              className="btn-spinner-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="btn-spinner-circle"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="btn-spinner-path"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        )}

        {!loading && leftIcon && (
          <span className="btn-icon btn-icon-left">{leftIcon}</span>
        )}

        <span className="btn-content">{children}</span>

        {!loading && rightIcon && (
          <span className="btn-icon btn-icon-right">{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

Button.propTypes = {
  /** Contenido del botón */
  children: PropTypes.node.isRequired,

  /** Variante visual del botón */
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "ghost",
    "danger",
    "success",
    "link",
  ]),

  /** Tamaño del botón */
  size: PropTypes.oneOf(["sm", "md", "lg", "xl"]),

  /** Si el botón ocupa todo el ancho del contenedor */
  fullWidth: PropTypes.bool,

  /** Si el botón está deshabilitado */
  disabled: PropTypes.bool,

  /** Si el botón está en estado de carga */
  loading: PropTypes.bool,

  /** Tipo de botón HTML */
  type: PropTypes.oneOf(["button", "submit", "reset"]),

  /** Callback cuando se hace click */
  onClick: PropTypes.func,

  /** Clases CSS adicionales */
  className: PropTypes.string,

  /** Ícono a la izquierda */
  leftIcon: PropTypes.node,

  /** Ícono a la derecha */
  rightIcon: PropTypes.node,
};

export default Button;
