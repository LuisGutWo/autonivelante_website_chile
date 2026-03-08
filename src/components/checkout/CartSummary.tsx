"use client";
import { Card, ListGroup, Image } from "react-bootstrap";
import { formatPrice } from '../../config/formatPrice';
import type { CartItem } from "../../types";

interface CartSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

const CartSummary = ({ items, subtotal, shipping, total }: CartSummaryProps): React.ReactElement => {
  return (
    <Card className="sticky-top" style={{ top: "100px" }}>
      <Card.Header className="bg-light">
        <h5 className="mb-0">Resumen de Orden</h5>
      </Card.Header>

      <ListGroup variant="flush">
        {/* Productos */}
        <div className="p-3">
          <h6 className="mb-3">Productos ({items.length})</h6>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {items.map((item) => (
              <div
                key={item.id}
                className="d-flex gap-3 mb-3 pb-3 border-bottom"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover", borderRadius: "4px" }}
                  />
                )}
                <div className="grow">
                  <p className="mb-2 small">
                    <strong>{item.title}</strong>
                  </p>
                  <p className="mb-0 text-muted small">
                    {formatPrice(item.price)} x {item.qty}
                  </p>
                  <p className="mb-0">
                    <strong>{formatPrice(item.price * item.qty)}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtotal */}
        <ListGroup.Item className="d-flex justify-content-between">
          <span>Subtotal:</span>
          <strong>{formatPrice(subtotal)}</strong>
        </ListGroup.Item>

        {/* Envío */}
        <ListGroup.Item className="d-flex justify-content-between">
          <span>
            Envío:
            {shipping === 0 && (
              <span
                className="badge bg-success ms-2"
                style={{ fontSize: "0.8rem" }}
              >
                ¡Gratis!
              </span>
            )}
          </span>
          <strong>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</strong>
        </ListGroup.Item>

        {/* Total */}
        <ListGroup.Item
          className="d-flex justify-content-between bg-light"
          style={{ fontSize: "1.1rem" }}
        >
          <span>
            <strong>Total:</strong>
          </span>
          <strong style={{ color: "#015c93" }}>{formatPrice(total)}</strong>
        </ListGroup.Item>

        {/* Info de Envío Gratis */}
        {shipping > 0 && subtotal + shipping < 50000 && (
          <div className="p-3 bg-info bg-opacity-10">
            <small className="text-muted">
              📦 ¡Envío gratis al alcanzar ${formatPrice(50000 - subtotal)} más!
            </small>
          </div>
        )}
      </ListGroup>
    </Card>
  );
};

export default CartSummary;
