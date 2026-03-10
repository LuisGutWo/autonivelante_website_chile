import styles from "./BackToTop.module.css";

export const BackToTop: React.FC = () => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a
      className={styles.scrollToTarget}
      href="#top"
      title="Volver arriba"
      aria-label="Volver arriba"
      onClick={handleClick}
    >
      <i className="fas fa-angle-up" aria-hidden="true"></i>
    </a>
  );
};

export default BackToTop;
