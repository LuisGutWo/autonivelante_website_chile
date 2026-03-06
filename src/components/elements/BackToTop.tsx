export const BackToTop: React.FC = () => {
  return (
    <a
      className="scroll-to-target d-block"
      href="#top"
      title="Volver arriba"
      aria-label="Volver arriba"
    >
      <i className="fas fa-angle-up" aria-hidden="true"></i>
    </a>
  );
};

export default BackToTop;
