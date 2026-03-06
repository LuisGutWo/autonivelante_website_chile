"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?:
    | ReactNode
    | ((props: { error: Error | null; reset: () => void }) => ReactNode);
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary Component
 * Captura errores en componentes hijos y muestra UI de fallback
 *
 * Uso:
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <ChildComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
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

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
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
              Reintentar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
  },
  content: {
    maxWidth: "600px",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center" as const,
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "16px",
    color: "#dc3545",
  },
  message: {
    fontSize: "16px",
    marginBottom: "24px",
    color: "#6c757d",
  },
  details: {
    textAlign: "left" as const,
    marginTop: "20px",
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    fontSize: "14px",
  },
  summary: {
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  pre: {
    overflow: "auto",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    fontSize: "12px",
    color: "#dc3545",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};

export default ErrorBoundary;
