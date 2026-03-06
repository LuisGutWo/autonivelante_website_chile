"use client";

import React from "react";

/**
 * ErrorBoundary Component
 * Captura errores en componentes hijos y muestra UI de fallback
 *
 * Uso:
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <ChildComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Loguear error en desarrollo
    console.error("❌ ErrorBoundary caught:", error, errorInfo);

    // En producción, aquí se podría enviar a servicio de logging
    if (process.env.NODE_ENV === "production") {
      // Ejemplo: sendErrorToLoggingService(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Si hay fallback custom, usarlo
      if (this.props.fallback) {
        return typeof this.props.fallback === "function"
          ? this.props.fallback({
              error: this.state.error,
              reset: this.handleReset,
            })
          : this.props.fallback;
      }

      // Fallback por defecto
      return (
        <div style={styles.container}>
          <div style={styles.content}>
            <h2 style={styles.title}>⚠️ Algo salió mal</h2>
            <p style={styles.message}>
              Hubo un error inesperado. Por favor, intenta recargar la página.
            </p>

            {process.env.NODE_ENV === "development" && (
              <details style={styles.details}>
                <summary style={styles.summary}>Detalles del error</summary>
                <pre style={styles.pre}>
                  {this.state.error && this.state.error.toString()}
                  {"\n\n"}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <button onClick={this.handleReset} style={styles.button}>
              Intentar de nuevo
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
  },
  content: {
    maxWidth: "500px",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#333",
  },
  message: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "15px",
    lineHeight: "1.5",
  },
  details: {
    marginTop: "20px",
    textAlign: "left",
    backgroundColor: "#f5f5f5",
    padding: "10px",
    borderRadius: "4px",
    cursor: "pointer",
  },
  summary: {
    fontWeight: "bold",
    color: "#0066cc",
    cursor: "pointer",
  },
  pre: {
    marginTop: "10px",
    fontSize: "12px",
    overflowX: "auto",
    color: "#c33",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default ErrorBoundary;
