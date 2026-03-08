import Button from "react-bootstrap/Button";
import { Container, Image } from "react-bootstrap";
import Link from "next/link";
import { rightArrowSvg } from "../../lib/icons";

export default function FeaturesBanner() {
  return (
    <section className="feature-section sec-pad centred">
      <Container>
        <div className="content-box">
          <div className="feature-block">
            <div
              className="feature-block wow fadeIn animated"
              data-wow-delay="00ms"
              data-wow-duration="2000ms"
            >
              <div className="inner-box">
                <figure className="image-box">
                  <Image
                    src="/assets/images/banner/banner-productos.webp"
                    alt="Autonivelante Chile Productos"
                    className="img-fluid"
                  />
                  <Link href="/products" className="overlay-box" prefetch={false}>
                    <Button variant="outline-light">
                      Ver productos
                      {rightArrowSvg}
                    </Button>{" "}
                  </Link>
                </figure>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
