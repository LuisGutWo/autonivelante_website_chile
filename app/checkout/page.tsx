"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Container, Row, Col, Button } from "react-bootstrap";
import Layout from '../../src/components/layout/Layout';
import Breadcrumb from '../../src/components/common/Breadcrumb/Breadcrumb';
import CheckoutForm from '../../src/components/checkout/CheckoutForm';
import CartSummary from '../../src/components/checkout/CartSummary';
import type { RootState } from "../../redux/store";
import type { CartItem } from "../../src/types";

export default function CheckoutPage(): React.ReactElement {
  const router = useRouter();
  const cartItems = useSelector((store: RootState) => store.cart as CartItem[]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirigir si no hay items en el carrito
  if (!cartItems || cartItems.length === 0) {
    return (
      <Layout headerStyle={2} footerStyle={1}>
        <Container className="mt_150 mb_200">
          <Breadcrumb
            items={[
              { name: "Productos", href: "/products" },
              { name: "Carrito", href: "/cart" },
              { name: "Checkout", href: "/checkout" },
            ]}
          />
          <div className="text-center py-5">
            <h2>Tu carrito está vacío</h2>
            <p className="text-muted mb-4">
              Agrega productos antes de procederan al pago
            </p>
            <Button
              onClick={() => router.push("/products")}
              className="theme-btn-one"
            >
              Volver a Productos
            </Button>
          </div>
        </Container>
      </Layout>
    );
  }

  const subtotal = cartItems.reduce(
    (acc: number, item: CartItem) => acc + item.price * item.qty,
    0,
  );
  const shipping = subtotal > 50000 ? 0 : 5000; // Envío gratis sobre $50k
  const total = subtotal + shipping;

  return (
    <Layout headerStyle={2} footerStyle={1}>
      <Container className="mt_150 mb_200">
        <Breadcrumb
          items={[
            { name: "Productos", href: "/products" },
            { name: "Carrito", href: "/cart" },
            { name: "Checkout", href: "/checkout" },
          ]}
        />

        <h2 className="py-2 mt-5 mb-4">Completar Compra</h2>
        <div className="mainfeat__bar mb-5"></div>

        <Row className="g-4">
          {/* Formulario de Checkout */}
          <Col lg={8}>
            <CheckoutForm
              isProcessing={isProcessing}
              setIsProcessing={setIsProcessing}
            />
          </Col>

          {/* Resumen de Orden */}
          <Col lg={4}>
            <CartSummary
              items={cartItems}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}
