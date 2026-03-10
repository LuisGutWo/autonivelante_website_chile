"use client";
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Container,
  Card,
  Alert,
  Button,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import Link from "next/link";
import Layout from '../../src/components/layout/Layout';
import Breadcrumb from '../../src/components/common/Breadcrumb/Breadcrumb';
import { useOrder } from '../../src/hooks/useProducts';
import { formatPrice } from '../../src/config/formatPrice';
import { CheckCircle, AlertTriangle } from "lucide-react";

const formatOrderDate = (dateValue: string): string => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "America/Santiago",
  }).format(date);
};

const formatOrderDateOnly = (dateValue: string): string => {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-CL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "America/Santiago",
  }).format(date);
};

/**
 * OrderConfirmationPage - Página de confirmación de orden
 *
 * ✨ Características:
 * - Usa React Query hook (useOrder) para caching automático
 * - Stale-while-revalidate (1 min stale, 5 min cache)
 * - Retry automático en caso de error
 * - Loading states y error handling mejorados
 */
export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  // ✨ Usar React Query hook - Caching automático + retry
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <Layout headerStyle={2} footerStyle={1}>
        <Container className="mt_150 mb_200 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-3">Cargando confirmación de tu orden...</p>
        </Container>
      </Layout>
    );
  }

  if (!orderId) {
    return (
      <Layout headerStyle={2} footerStyle={1}>
        <Container className="mt_150 mb_200">
          <Breadcrumb
            items={[{ name: "Confirmación", href: "/order-confirmation" }]}
          />
          <Alert variant="danger" className="mt-5">
            <AlertTriangle className="me-2" />
            No se encontró el identificador de la orden
          </Alert>
          <div className="text-center mt-4">
            <p>Por favor, intenta nuevamente o contacta al soporte.</p>
            <Button
              onClick={() => router.push("/cart")}
              className="theme-btn-one"
            >
              Volver al Carrito
            </Button>
          </div>
        </Container>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout headerStyle={2} footerStyle={1}>
        <Container className="mt_150 mb_200">
          <Breadcrumb
            items={[{ name: "Confirmación", href: "/order-confirmation" }]}
          />
          <Alert variant="danger" className="mt-5">
            <AlertTriangle className="me-2" />
            {error?.message || "No pudimos cargar los detalles de tu orden"}
          </Alert>
          <div className="text-center mt-4">
            <p>Por favor, intenta nuevamente o contacta al soporte.</p>
            <Button
              onClick={() => router.push("/cart")}
              className="theme-btn-one"
            >
              Volver al Carrito
            </Button>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout headerStyle={2} footerStyle={1}>
      <Container className="mt_150 mb_200">
        <Breadcrumb
          items={[{ name: "Confirmación", href: "/order-confirmation" }]}
        />

        {/* Mensaje de Éxito */}
        <div className="text-center mb-5">
          <CheckCircle size={64} color="#28a745" className="mb-3" />
          <h1 className="mt-3 mb-3">¡Gracias por tu Compra!</h1>
          <p className="text-muted">
            Hemos recibido tu orden y pronto comenzaremos a procesarla
          </p>
        </div>

        {/* Detalles de la Orden */}
        <Row className="g-4">
          <Col lg={8}>
            <Card>
              <Card.Header className="bg-light">
                <h5 className="mb-0">Detalles de tu Orden</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-4">
                  <Col md={6}>
                    <p className="text-muted small">NÚMERO DE ORDEN</p>
                    <p className="h6">{order.orderId}</p>
                  </Col>
                  <Col md={6}>
                    <p className="text-muted small">FECHA</p>
                    <p className="h6">{formatOrderDateOnly(order.createdAt)}</p>
                  </Col>
                </Row>

                <hr />

                <h6 className="mb-3">Productos</h6>
                <div className="mb-3">
                  {order.items &&
                    order.items.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex justify-content-between mb-2"
                      >
                        <span>
                          {item.title}{" "}
                          <small className="text-muted">x{item.qty}</small>
                        </span>
                        <span>{formatPrice(item.price * item.qty)}</span>
                      </div>
                    ))}
                </div>

                <hr />

                <Row className="mb-3">
                  <Col md={6}>
                    <p className="text-muted small mb-1">SUBTOTAL</p>
                    <p className="h6">
                      {order.summary?.subtotal
                        ? formatPrice(order.summary.subtotal)
                        : "—"}
                    </p>
                  </Col>
                  <Col md={6}>
                    <p className="text-muted small mb-1">ENVÍO</p>
                    <p className="h6">
                      {order.summary?.shipping === 0
                        ? "Gratis"
                        : formatPrice(order.summary?.shipping || 0)}
                    </p>
                  </Col>
                </Row>

                <Card className="bg-light border-0">
                  <Card.Body>
                    <div className="d-flex justify-content-between">
                      <strong>TOTAL:</strong>
                      <strong style={{ fontSize: "1.3rem", color: "#015c93" }}>
                        {order.summary?.total
                          ? formatPrice(order.summary.total)
                          : "—"}
                      </strong>
                    </div>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>

            {/* Información de Envío */}
            <Card className="mt-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Información de Envío</h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-1">
                  <strong>
                    {order.customerInfo?.firstName}{" "}
                    {order.customerInfo?.lastName}
                  </strong>
                </p>
                <p className="mb-1 text-muted small">
                  {order.shippingInfo?.street}{" "}
                  {order.shippingInfo?.streetNumber}
                  {order.shippingInfo?.apartment &&
                    ` Apto ${order.shippingInfo.apartment}`}
                </p>
                <p className="mb-1 text-muted small">
                  {order.shippingInfo?.city}, {order.shippingInfo?.region}{" "}
                  {order.shippingInfo?.postalCode}
                </p>
              </Card.Body>
            </Card>

            {/* Información de Contacto */}
            <Card className="mt-4">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Información de Contacto</h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-2">
                  <small className="text-muted">EMAIL</small> <br />
                  {order.customerInfo?.email}
                </p>
                <p>
                  <small className="text-muted">TELÉFONO</small> <br />
                  {order.customerInfo?.phone}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <Card>
              <Card.Header className="bg-light">
                <h5 className="mb-0">Estado de tu Orden</h5>
              </Card.Header>
              <Card.Body>
                <Alert variant="info">
                  <strong>Pendiente de Pago</strong>
                </Alert>
                <p className="small text-muted mb-3">
                  Tu orden está en espera de confirmación de pago. Te enviaremos
                  un email cuando confirmemos el pago.
                </p>

                <div className="timeline">
                  <div className="timeline-item mb-3">
                    <div className="timeline-marker bg-success"></div>
                    <div>
                      <p className="small mb-1">
                        <strong>Orden Confirmada</strong>
                      </p>
                      <p className="small text-muted">{formatOrderDate(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="timeline-item mb-3">
                    <div className="timeline-marker bg-warning"></div>
                    <div>
                      <p className="small mb-1">
                        <strong>Pendiente: Pago</strong>
                      </p>
                      <p className="small text-muted">Esperando confirmación</p>
                    </div>
                  </div>

                  <div className="timeline-item">
                    <div className="timeline-marker bg-secondary"></div>
                    <div>
                      <p className="small mb-1">
                        <strong>Envío</strong>
                      </p>
                      <p className="small text-muted">
                        Será procesado próximamente
                      </p>
                    </div>
                  </div>
                </div>

                <hr />

                <p className="small text-muted">
                  📧 Hemos enviado un email de confirmación a{" "}
                  <strong>{order.customerInfo?.email}</strong>
                </p>
              </Card.Body>
            </Card>

            {/* Botones */}
            <div className="mt-4 d-grid gap-2">
              <Link href="/">
                <Button variant="outline-primary" className="w-100">
                  Volver a Inicio
                </Button>
              </Link>
              <Link href="/products">
                <Button className="theme-btn-one w-100">
                  Continuar Comprando
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </Container>

      <style>{`
        .timeline-item {
          position: relative;
          padding-left: 30px;
        }

        .timeline-marker {
          position: absolute;
          left: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 2px solid white;
        }
      `}</style>
    </Layout>
  );
}
