"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * APIError Component
 * Muestra errores de API con opción de reintentar
 *
 * Uso:
 * <APIError
 *   error={error}
 *   onRetry={handleRetry}
 *   title="Error al cargar productos"
 * />
 */
export default function APIError({
  error,
  onRetry,
  title = "Error",
  message = "Hubo un error al procesar tu solicitud",
  showDetails = false,
}) {
  const isNetworkError =
    error?.message?.includes("conexión") || error?.status === 0;
  const isTimeoutError = error?.message?.includes("timeout");
  const isServerError = error?.status >= 500;

  let helpText = message;
  if (isNetworkError) {
    helpText =
      "Parece que hay un problema de conexión. Verifica tu internet y intenta de nuevo.";
  } else if (isTimeoutError) {
    helpText = "La solicitud tardó demasiado. Por favor intenta de nuevo.";
  } else if (isServerError) {
    helpText =
      "Nuestros servidores están experimentando problemas. Intenta en unos momentos.";
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <AlertCircle size={32} style={styles.icon} />
          <h3 style={styles.title}>{title}</h3>
        </div>

        <p style={styles.message}>{helpText}</p>

        {showDetails && error && (
          <details style={styles.details}>
            <summary style={styles.summary}>Ver detalles</summary>
            <div style={styles.errorContent}>
              <strong>Tipo:</strong> {error.name || "Error"}
              <br />
              {error.status && (
                <>
                  <strong>Estado:</strong> {error.status}
                  <br />
                </>
              )}
              <strong>Mensaje:</strong> {error.message}
            </div>
          </details>
        )}

        {onRetry && (
          <button onClick={onRetry} style={styles.button}>
            <RefreshCw size={16} style={styles.buttonIcon} />
            Intentar de nuevo
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    minHeight: "200px",
    backgroundColor: "#f8f9fa",
  },
  card: {
    maxWidth: "500px",
    width: "100%",
    padding: "24px",
    backgroundColor: "white",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  icon: {
    color: "#d32f2f",
    flexShrink: 0,
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
    color: "#333",
  },
  message: {
    margin: "12px 0",
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.5",
  },
  details: {
    marginTop: "12px",
    padding: "12px",
    backgroundColor: "#f5f5f5",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "13px",
  },
  summary: {
    fontWeight: "500",
    color: "#0066cc",
    cursor: "pointer",
  },
  errorContent: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#666",
    fontFamily: "monospace",
  },
  button: {
    marginTop: "16px",
    padding: "10px 16px",
    backgroundColor: "#0066cc",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
    justifyContent: "center",
    transition: "background-color 0.3s ease",
  },
  buttonIcon: {
    marginRight: "4px",
  },
};
