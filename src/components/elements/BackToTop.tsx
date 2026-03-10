import styles from "./BackToTop.module.css";
import { ChevronUp } from "lucide-react";

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
      <ChevronUp aria-hidden="true" size={18} />
    </a>
  );
};

export default BackToTop;
