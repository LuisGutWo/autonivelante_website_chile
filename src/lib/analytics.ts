import { logger, LogCategory } from "./logger";

type JsonPrimitive = string | number | boolean | null | undefined;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type EventPayload = Record<string, JsonValue>;

type AnalyticsWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: Array<Record<string, unknown>>;
};

export type ContactMethod = "whatsapp" | "phone" | "contact_form";
export type ContactSource = "floating_panel" | "contact_page";

export interface AnalyticsProduct {
  id: string;
  title: string;
  price: number;
  category?: string;
}

export interface AnalyticsCartItem extends AnalyticsProduct {
  qty: number;
}

const mapItemsForGa4 = (items: AnalyticsCartItem[]) =>
  items.map((item) => ({
    item_id: item.id,
    item_name: item.title,
    price: item.price,
    quantity: item.qty,
    item_category: item.category ?? "Productos",
  }));

const getDeviceType = (): "mobile" | "desktop" => {
  if (typeof window === "undefined") {
    return "desktop";
  }

  return window.innerWidth <= 768 ? "mobile" : "desktop";
};

export const trackEvent = (
  eventName: string,
  payload: EventPayload = {}
): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const analyticsWindow = window as AnalyticsWindow;

    if (typeof analyticsWindow.gtag === "function") {
      analyticsWindow.gtag("event", eventName, payload);
    }

    if (Array.isArray(analyticsWindow.dataLayer)) {
      analyticsWindow.dataLayer.push({
        event: eventName,
        ...payload,
      });
    }
  } catch (error) {
    logger.warn(
      "Analytics event tracking failed",
      { eventName, payload, error },
      LogCategory.PERFORMANCE
    );
  }
};

export const trackContactClick = (
  method: ContactMethod,
  source: ContactSource
): void => {
  trackEvent("contact_click", {
    method,
    source,
    device_type: getDeviceType(),
  });
};

export const trackViewItem = (product: AnalyticsProduct): void => {
  trackEvent("view_item", {
    product_id: product.id,
    product_name: product.title,
    price: product.price,
    category: product.category ?? "Productos",
  });
};

export const trackAddToCart = (
  product: AnalyticsProduct,
  quantity: number
): void => {
  trackEvent("add_to_cart", {
    product_id: product.id,
    product_name: product.title,
    price: product.price,
    quantity,
    category: product.category ?? "Productos",
  });
};

export const trackPageView = (pagePath: string, pageTitle?: string): void => {
  trackEvent("page_view", {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

export const trackBeginCheckout = (
  items: AnalyticsCartItem[],
  totalValue: number,
  shipping = 0,
  currency = "CLP"
): void => {
  trackEvent("begin_checkout", {
    currency,
    value: totalValue,
    shipping,
    items: mapItemsForGa4(items),
  });
};

export const trackPurchase = (
  orderId: string,
  items: AnalyticsCartItem[],
  totalValue: number,
  shipping = 0,
  currency = "CLP"
): void => {
  trackEvent("purchase", {
    transaction_id: orderId,
    currency,
    value: totalValue,
    shipping,
    items: mapItemsForGa4(items),
  });
};
