import { httpClient } from "./httpClient";
import { logger, LogCategory } from "./logger";
import type { CheckoutOrder, OrderStatus, Product, ProductList } from "../types";
import localProducts from "../data/products.json";

type FirebaseOrdersMap = Record<string, CheckoutOrder>;

type LocalProductsData = {
  mainProducts: unknown[];
  homeProducts: unknown[];
  productsPage: unknown[];
  allProducts: unknown[];
};

const productsData = localProducts as LocalProductsData;

const normalizeDescription = (value: unknown): string | undefined => {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value
      .filter((entry): entry is string => typeof entry === "string")
      .join(" ")
      .trim();
  }

  return undefined;
};

const normalizeProducts = (items: unknown[]): ProductList => {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter(
      (item): item is Record<string, unknown> =>
        typeof item === "object" && item !== null,
    )
    .map((item) => {
      const description =
        normalizeDescription(item.description) ?? normalizeDescription(item.desc);

      return {
        ...item,
        id: String(item.id ?? ""),
        title: String(item.title ?? ""),
        price: Number(item.price ?? 0),
        image: String(item.image ?? ""),
        description,
      } as Product;
    })
    .filter((item) => item.id && item.title && item.image);
};

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : "Error desconocido";

const getFirebaseDatabaseUrl = (): string => {
  const url =
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    process.env.NEXT_FIREBASE_DATABASE_URL;

  if (!url) {
    throw new Error(
      "Firebase database URL not configured. Define NEXT_PUBLIC_FIREBASE_DATABASE_URL (or legacy NEXT_FIREBASE_DATABASE_URL) in .env.local",
    );
  }

  return url;
};

/**
 * Fetch de productos principales
 * Con retry automático y manejo de errores
 */
export async function fetchMainProducts(): Promise<ProductList> {
  return normalizeProducts(productsData.mainProducts ?? []);
}

/**
 * Fetch de productos home (destacados)
 * Con retry automático y manejo de errores
 */
export async function fetchHomeProducts(): Promise<ProductList> {
  return normalizeProducts(productsData.homeProducts ?? []);
}

/**
 * Fetch de página de productos
 * Con retry automático y manejo de errores
 */
export async function fetchProductsPage(): Promise<ProductList> {
  return normalizeProducts(productsData.productsPage ?? []);
}

// ============ ORDERS API ============

/**
 * Guardar una nueva orden en Firebase Realtime Database
 * Con reintentos automáticos
 * @param {Object} orderData - Datos de la orden
 * @returns {Promise<Object>} Orden guardada con ID
 */
export async function saveOrder(orderData: CheckoutOrder): Promise<CheckoutOrder> {
  const databaseUrl = getFirebaseDatabaseUrl();

  const ordersUrl = `${databaseUrl}/orders/${orderData.orderId}.json`;

  try {
    await httpClient.put<unknown, CheckoutOrder>(ordersUrl, orderData);
    logger.info(
      "Orden guardada exitosamente",
      { orderId: orderData.orderId },
      LogCategory.API
    );
    return orderData;
  } catch (error: unknown) {
    logger.error(
      "Error guardando orden",
      error,
      { orderId: orderData.orderId },
      LogCategory.API
    );
    throw new Error(`Error al guardar orden: ${getErrorMessage(error)}`);
  }
}

/**
 * Obtener todas las órdenes
 * @returns {Promise<Array>} Lista de órdenes
 */
export async function getOrders(): Promise<CheckoutOrder[]> {
  const databaseUrl = getFirebaseDatabaseUrl();

  const ordersUrl = `${databaseUrl}/orders.json`;

  try {
    const data = await httpClient.get<FirebaseOrdersMap | null>(ordersUrl);

    if (!data) {
      return [];
    }

    // Convertir objeto de Firebase a array
    return Object.values(data);
  } catch (error: unknown) {
    logger.error(
      "Error obteniendo órdenes",
      error,
      undefined,
      LogCategory.API
    );
    throw new Error(`Error al obtener órdenes: ${getErrorMessage(error)}`);
  }
}

/**
 * Obtener una orden por ID
 * @param {string} orderId - ID de la orden
 * @returns {Promise<Object>} Datos de la orden
 */
export async function getOrderById(orderId: string): Promise<CheckoutOrder> {
  const baseUrl = getFirebaseDatabaseUrl();

  const orderUrl = `${baseUrl}/orders/${orderId}.json`;

  try {
    const data = await httpClient.get<CheckoutOrder | null>(orderUrl);

    if (!data) {
      throw new Error("Orden no encontrada");
    }

    return data;
  } catch (error: unknown) {
    logger.error(
      "Error obteniendo orden",
      error,
      { orderId },
      LogCategory.API
    );
    throw new Error(`Error al obtener orden: ${getErrorMessage(error)}`);
  }
}

/**
 * Actualizar estado de la orden
 * @param {string} orderId - ID de la orden
 * @param {string|Object} status - Nuevo estado de la orden
 * @returns {Promise<Object>} Orden actualizada
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<OrderStatus> {
  const baseUrl = getFirebaseDatabaseUrl();

  const orderUrl = `${baseUrl}/orders/${orderId}/status.json`;

  try {
    await httpClient.put<unknown, OrderStatus>(orderUrl, status);
    return status;
  } catch (error: unknown) {
    logger.error(
      "Error actualizando orden",
      error,
      { orderId, status },
      LogCategory.API
    );
    throw new Error(`Error al actualizar orden: ${getErrorMessage(error)}`);
  }
}
