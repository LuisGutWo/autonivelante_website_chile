"use client";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { rightArrowSvg } from "../../lib/icons";

export default function FeaturesBanner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <section className="feature-section sec-pad centred">
      <Container>
        <div className="content-box">
          <div className="feature-block">
            <div
              className={`feature-block ${isClient ? "wow fadeIn animated" : ""}`}
              data-wow-delay="00ms"
              data-wow-duration="2000ms"
            >
              <div className="inner-box">
                <figure className="image-box">
                  <Image
                    src="/assets/images/banner/banner-productos.webp"
                    alt="Autonivelante Chile Productos"
                    width={1200}
                    height={800}
                    priority
                    quality={85}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
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
