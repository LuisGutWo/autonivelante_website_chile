import { httpClient } from "./httpClient";
import type { CheckoutOrder, OrderStatus, ProductList } from "../types";

type FirebaseOrdersMap = Record<string, CheckoutOrder>;

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
  const url = process.env.NEXT_PUBLIC_MAIN_PRODUCTS_URL;
  if (!url) {
    throw new Error(
      "fetchMainProducts: NEXT_PUBLIC_MAIN_PRODUCTS_URL is not defined. Asegúrate de configurar .env.local",
    );
  }

  try {
    const data = await httpClient.get<ProductList>(url);
    if (!data) {
      throw new Error("No se devolvieron productos de la API");
    }
    return data;
  } catch (error: unknown) {
    console.error("❌ Error fetching main products:", error);
    throw new Error(`Error al cargar productos principales: ${getErrorMessage(error)}`);
  }
}

/**
 * Fetch de productos home (destacados)
 * Con retry automático y manejo de errores
 */
export async function fetchHomeProducts(): Promise<ProductList> {
  const url = process.env.NEXT_PUBLIC_HOME_PRODUCTS_URL;
  if (!url) {
    throw new Error(
      "fetchHomeProducts: NEXT_PUBLIC_HOME_PRODUCTS_URL is not defined. Asegúrate de configurar .env.local",
    );
  }

  try {
    const data = await httpClient.get<ProductList>(url);
    if (!data) {
      throw new Error("No se devolvieron productos de la API");
    }
    return data;
  } catch (error: unknown) {
    console.error("❌ Error fetching home products:", error);
    throw new Error(`Error al cargar productos destacados: ${getErrorMessage(error)}`);
  }
}

/**
 * Fetch de página de productos
 * Con retry automático y manejo de errores
 */
export async function fetchProductsPage(): Promise<ProductList> {
  const url = process.env.NEXT_PUBLIC_PRODUCTS_PAGE_URL;
  if (!url) {
    throw new Error(
      "fetchProductsPage: NEXT_PUBLIC_PRODUCTS_PAGE_URL is not defined. Asegúrate de configurar .env.local",
    );
  }

  try {
    const data = await httpClient.get<ProductList>(url);
    if (!data) {
      throw new Error("No se devolvieron productos de la API");
    }
    return data;
  } catch (error: unknown) {
    console.error("❌ Error fetching products page:", error);
    throw new Error(`Error al cargar página de productos: ${getErrorMessage(error)}`);
  }
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
    console.log("✅ Orden guardada exitosamente:", orderData.orderId);
    return orderData;
  } catch (error: unknown) {
    console.error("❌ Error guardando orden:", error);
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
    console.error("❌ Error obteniendo órdenes:", error);
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
    console.error("❌ Error obteniendo orden:", error);
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
    console.error("❌ Error actualizando orden:", error);
    throw new Error(`Error al actualizar orden: ${getErrorMessage(error)}`);
  }
}
