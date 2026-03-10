import type { ReactElement } from "react";
import styles from "./Preloader.module.css";

export default function Preloader(): ReactElement {
  return (
    <div
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-label="Cargando contenido"
    >
      <div className={styles.spinner} aria-hidden="true" />
      <span className="visually-hidden">Cargando contenido</span>
    </div>
  );
}
