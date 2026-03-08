"use client";

import React, { useMemo, useRef } from "react";
import Link from "next/link";
import { Button, Col, Container, Image, Row, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { formatPrice } from "../../config/formatPrice";
import type { RootState } from "../../../redux/store";
import type { CartItem } from "../../types";
import {
  arrowRightSvg,
  clockSvg,
  addressSvg,
  phoneSvg,
  facebookSvg,
  instagramSvg,
} from "../../lib/icons";

export default function Contact(): React.ReactElement {
  const form = useRef<HTMLFormElement | null>(null);
  const cart = useSelector<RootState, CartItem[]>((state) => state.cart);

  const selectedProductsMessage = useMemo(() => {
    if (!cart.length) {
      return "Sin productos seleccionados";
    }

    return cart
      .map(
        (cartItem) =>
          `${cartItem.qty} - ${cartItem.title} - (${formatPrice(cartItem.price)}) = ${formatPrice(cartItem.price * cartItem.qty)}`,
      )
      .join("\n");
  }, [cart]);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!form.current) {
      toast.error("No se pudo enviar el formulario.");
      return;
    }

    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "",
        process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID ||
          process.env.NEXT_EMAILJS_ORDER_TEMPLATE_ID ||
          "",
        form.current,
        {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        },
      )
      .then(
        () => {
          toast.success("Enviado con exito.");
          console.log("SUCCESS!");
        },
        (error: { text?: string }) => {
          toast.error("Algo salio mal.");
          console.log("FAILED...", error.text);
        },
      );
  };

  return (
    <section id="contact" className="contact__section p_relative">
      <Container>
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-13 image-column ml_0 contact__main-column">
            <div className="contact_block_one d-flex justify-content-center align-items-center">
              <div className="contactcard image-box p_relative d-flex flex-wrap flex-row">
                <div className="contactcard__text">
                  <div className="contactcard__text-inner">
                    <div className="logo-box">
                      <figure className="logo">
                        <Link href="/" prefetch={false}>
                          <Image
                            src="/assets/images/autonivelante_logo_contact.webp"
                            className="img-fluid"
                            alt="Autonivelante Logo"
                          />
                        </Link>
                      </figure>
                    </div>

                    <Container
                      fluid
                      className="mb-5 text-start pt-0 pe-3 pb-0 ps-3"
                    >
                      <Row>
                        <Col>
                          <div className="contactcard__content d-flex flex-row align-items-start">
                            {phoneSvg}

                            <p className="text-light">
                              <b>Numero de contacto</b>
                              <br />
                              +56 9 7528 0836
                              <br />
                              +56 9 7144 7333
                            </p>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="contactcard__content d-flex flex-row align-items-start">
                            {addressSvg}

                            <p className="text-light">
                              <b>Direccion</b>
                              <br />
                              Av. La Dehesa 1822 - Of. 430,
                              <br />
                              Lo Barnechea.
                            </p>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="contactcard__content-tree d-flex flex-row align-items-start">
                            {clockSvg}
                            <p className="text-light pt-3">
                              <b>Horario</b>
                              <br />
                              Lunes a Domingo.
                            </p>
                          </div>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </div>

                <div className="contactcard__text-two">
                  <section className="contact-style">
                    <div className="auto-container">
                      <div className="row clearfix">
                        <div className="col-lg-6 col-md-12 col-sm-12 content-column">
                          <div className="form__contact content-box mr_70">
                            <div className="sec-title mb_35 ms-1">
                              <h2 className="postcard__title blue text-dark text-start fw-bold fs-2">
                                Contactanos
                              </h2>
                              <div className="contactcard__bar"></div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-10 col-md-12 col-sm-12 form-column">
                          <div className="form-inner">
                            <Form
                              ref={form}
                              onSubmit={sendEmail}
                              id="contact-form"
                            >
                              <Form.Group
                                className="mb-3"
                                controlId="formBasicName"
                              >
                                <Form.Control
                                  name="user_name"
                                  type="text"
                                  placeholder="Nombre y Apellido"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                className="mb-3"
                                controlId="formBasicPhone"
                              >
                                <Form.Control
                                  name="user_phone"
                                  type="tel"
                                  placeholder="Telefono"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                className="mb-3"
                                controlId="formBasicEmail"
                              >
                                <Form.Control
                                  name="user_email"
                                  type="email"
                                  placeholder="Correo electronico"
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                className="mb-3"
                                controlId="formBasicCurrentMessage"
                              >
                                <Form.Control
                                  name="user_message"
                                  as="textarea"
                                  placeholder="Motivo de contacto"
                                  rows={3}
                                  required
                                />
                              </Form.Group>
                              <Form.Group
                                className="mb-3"
                                controlId="formBasicMessage"
                              >
                                <Form.Control
                                  name="message"
                                  as="textarea"
                                  placeholder="Productos seleccionados"
                                  rows={4}
                                  value={selectedProductsMessage}
                                  readOnly
                                />
                              </Form.Group>

                              <Button
                                className="theme-btn theme-btn-one"
                                style={{ width: "100%", marginTop: "1rem" }}
                                value="Send"
                                type="submit"
                                name="submit-form"
                              >
                                Enviar mensaje
                                {arrowRightSvg}
                              </Button>
                            </Form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
                <section className="social__icons">
                  <Link
                    href="https://www.instagram.com/autonivelante_cl/"
                    className="contact__links mb-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                  >
                    <div className="social__icons-inner d-flex justify-content-center align-items-center">
                      {instagramSvg}
                    </div>
                  </Link>
                  <Link
                    href="https://web.facebook.com/profile.php?id=100088723373843"
                    className="contact__links"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Facebook"
                    aria-label="Facebook"
                  >
                    <div className="social__icons-inner d-flex justify-content-center align-items-center">
                      {facebookSvg}
                    </div>
                  </Link>
                </section>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}