export default function Preloader(): React.ReactElement {
  return (
    <div>
      <div className="loader-wrap">
        <div className="spinner-border" role="status">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    </div>
  );
}
