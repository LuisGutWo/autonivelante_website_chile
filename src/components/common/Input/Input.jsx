"use client";
import React, { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import "./Input.css";

/**
 * Input - Campo de entrada genérico con label, validación y estados
 *
 * @component
 * @example
 * ```jsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="tu@email.com"
 *   error="El email es requerido"
 * />
 * ```
 */
const Input = forwardRef(
  (
    {
      // Basic props
      id,
      name,
      type = "text",
      value,
      defaultValue,
      placeholder,

      // Labels and helpers
      label,
      helperText,
      error,

      // States
      disabled = false,
      required = false,
      readOnly = false,

      // Icons
      leftIcon,
      rightIcon,

      // Sizing
      size = "md",
      fullWidth = false,

      // Textarea specific
      rows = 4,
      resize = "vertical",

      // Styling
      className = "",

      // Events
      onChange,
      onBlur,
      onFocus,

      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // Generate ID if not provided
    const inputId =
      id || `input-${name || Math.random().toString(36).substr(2, 9)}`;

    // Determine if this should be a textarea
    const isTextarea = type === "textarea";

    // Build input classes
    const inputClasses = [
      "input-field",
      `input-size-${size}`,
      leftIcon && "input-has-left-icon",
      rightIcon && "input-has-right-icon",
      error && "input-error",
      disabled && "input-disabled",
      readOnly && "input-readonly",
      isFocused && "input-focused",
      fullWidth && "input-full-width",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Textarea classes
    const textareaClasses = [inputClasses, `input-resize-${resize}`].join(" ");

    // Handle focus
    const handleFocus = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    // Handle blur
    const handleBlur = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Common input props
    const commonProps = {
      id: inputId,
      name,
      value,
      defaultValue,
      placeholder,
      disabled,
      required,
      readOnly,
      "aria-invalid": !!error,
      "aria-describedby": error
        ? `${inputId}-error`
        : helperText
          ? `${inputId}-helper`
          : undefined,
      onChange,
      onFocus: handleFocus,
      onBlur: handleBlur,
      ...props,
    };

    return (
      <div
        className={`input-wrapper ${fullWidth ? "input-wrapper-full-width" : ""}`}
      >
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
            {required && <span className="input-required">*</span>}
          </label>
        )}

        {/* Input Container */}
        <div className="input-container">
          {/* Left Icon */}
          {leftIcon && (
            <div className="input-icon input-icon-left">{leftIcon}</div>
          )}

          {/* Input or Textarea */}
          {isTextarea ? (
            <textarea
              ref={ref}
              className={textareaClasses}
              rows={rows}
              {...commonProps}
            />
          ) : (
            <input
              ref={ref}
              type={type}
              className={inputClasses}
              {...commonProps}
            />
          )}

          {/* Right Icon */}
          {rightIcon && (
            <div className="input-icon input-icon-right">{rightIcon}</div>
          )}
        </div>

        {/* Helper Text or Error */}
        {error ? (
          <p
            id={`${inputId}-error`}
            className="input-message input-error-message"
          >
            {error}
          </p>
        ) : helperText ? (
          <p
            id={`${inputId}-helper`}
            className="input-message input-helper-text"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";

Input.propTypes = {
  /** ID único del input (generado automáticamente si no se provee) */
  id: PropTypes.string,

  /** Nombre del input para formularios */
  name: PropTypes.string,

  /** Tipo de input HTML o "textarea" */
  type: PropTypes.oneOf([
    "text",
    "email",
    "password",
    "number",
    "tel",
    "url",
    "search",
    "date",
    "time",
    "datetime-local",
    "textarea",
  ]),

  /** Valor controlado del input */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Valor por defecto (uncontrolled) */
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /** Texto placeholder */
  placeholder: PropTypes.string,

  /** Label descriptivo del input */
  label: PropTypes.string,

  /** Texto de ayuda debajo del input */
  helperText: PropTypes.string,

  /** Mensaje de error (si existe, muestra estado error) */
  error: PropTypes.string,

  /** Input deshabilitado */
  disabled: PropTypes.bool,

  /** Campo requerido (muestra asterisco) */
  required: PropTypes.bool,

  /** Input de solo lectura */
  readOnly: PropTypes.bool,

  /** Ícono a la izquierda */
  leftIcon: PropTypes.node,

  /** Ícono a la derecha */
  rightIcon: PropTypes.node,

  /** Tamaño del input */
  size: PropTypes.oneOf(["sm", "md", "lg"]),

  /** Input ocupa todo el ancho disponible */
  fullWidth: PropTypes.bool,

  /** Número de filas (solo para textarea) */
  rows: PropTypes.number,

  /** Control de resize (solo para textarea) */
  resize: PropTypes.oneOf(["none", "vertical", "horizontal", "both"]),

  /** Clases CSS adicionales */
  className: PropTypes.string,

  /** Callback al cambiar el valor */
  onChange: PropTypes.func,

  /** Callback al perder el foco */
  onBlur: PropTypes.func,

  /** Callback al ganar el foco */
  onFocus: PropTypes.func,
};

/**
 * PasswordInput - Variante de Input con toggle para mostrar/ocultar contraseña
 */
export const PasswordInput = forwardRef((props, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  const eyeIcon = showPassword ? (
    // Eye Slash Icon (hide)
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 16 16"
      style={{ cursor: "pointer" }}
      onClick={togglePassword}
    >
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
    </svg>
  ) : (
    // Eye Icon (show)
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentColor"
      viewBox="0 0 16 16"
      style={{ cursor: "pointer" }}
      onClick={togglePassword}
    >
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
    </svg>
  );

  return (
    <Input
      {...props}
      ref={ref}
      type={showPassword ? "text" : "password"}
      rightIcon={eyeIcon}
    />
  );
});

PasswordInput.displayName = "PasswordInput";

export default Input;
