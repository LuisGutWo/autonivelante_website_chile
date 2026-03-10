import { Image } from "react-bootstrap";

export default function Footer(): React.ReactElement | null {
  const currentYear = new Intl.DateTimeFormat("es-CL", {
    year: "numeric",
    timeZone: "America/Santiago",
  }).format(new Date());

  return (
    <footer className="main-footer">
      <div className="footer-bottom">
        <div className="container">
          <div className="copyright text-center">
            <figure className="footer-logo">
              <Image
                src="/assets/images/logo_horizontal.webp"
                className="img-fluid"
                width={200}
                height={50}
                alt="Autonivelante footer logo"
                loading="lazy"
              />
            </figure>
            <div style={{ marginTop: "1rem", fontSize: "0.95rem" }}>
              &copy; {currentYear} LAG media - Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
