import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  trackEvent,
  trackContactClick,
  trackViewItem,
  trackAddToCart,
  trackBeginCheckout,
  trackPurchase,
} from "./analytics";

describe("analytics helper", () => {
  beforeEach(() => {
    (window as any).gtag = vi.fn();
    (window as any).dataLayer = [];
  });

  it("sends events to gtag and dataLayer", () => {
    trackEvent("custom_event", { value: 1, source: "test" });

    expect((window as any).gtag).toHaveBeenCalledWith("event", "custom_event", {
      value: 1,
      source: "test",
    });
    expect((window as any).dataLayer).toContainEqual({
      event: "custom_event",
      value: 1,
      source: "test",
    });
  });

  it("tracks contact_click with normalized payload", () => {
    trackContactClick("whatsapp", "floating_panel");

    expect((window as any).gtag).toHaveBeenCalledWith(
      "event",
      "contact_click",
      expect.objectContaining({
        method: "whatsapp",
        source: "floating_panel",
      })
    );
  });

  it("tracks view_item and add_to_cart", () => {
    trackViewItem({
      id: "P001",
      title: "Producto test",
      price: 9900,
      category: "Cementicios",
    });

    trackAddToCart(
      {
        id: "P001",
        title: "Producto test",
        price: 9900,
      },
      2
    );

    expect((window as any).dataLayer).toContainEqual(
      expect.objectContaining({
        event: "view_item",
        product_id: "P001",
      })
    );

    expect((window as any).dataLayer).toContainEqual(
      expect.objectContaining({
        event: "add_to_cart",
        product_id: "P001",
        quantity: 2,
      })
    );
  });

  it("tracks begin_checkout and purchase with GA4 items", () => {
    const items = [
      {
        id: "P001",
        title: "Producto test",
        price: 9900,
        qty: 2,
        category: "Cementicios",
      },
    ];

    trackBeginCheckout(items, 24800, 5000);
    trackPurchase("ORD-123", items, 24800, 5000);

    expect((window as any).dataLayer).toContainEqual(
      expect.objectContaining({
        event: "begin_checkout",
        currency: "CLP",
        value: 24800,
        shipping: 5000,
      })
    );

    expect((window as any).dataLayer).toContainEqual(
      expect.objectContaining({
        event: "purchase",
        transaction_id: "ORD-123",
        currency: "CLP",
        value: 24800,
        shipping: 5000,
      })
    );
  });
});
