import { httpClient } from "./httpClient";

/**
 * Fetch de productos principales
 * Con retry automático y manejo de errores
 */
export async function fetchMainProducts() {
  const url = process.env.NEXT_PUBLIC_MAIN_PRODUCTS_URL;
  if (!url) {
    throw new Error(
      "fetchMainProducts: NEXT_PUBLIC_MAIN_PRODUCTS_URL is not defined. Asegúrate de configurar .env.local",
    );
  }

  try {
    const data = await httpClient.get(url);
    if (!data) {
      throw new Error("No se devolvieron productos de la API");
    }
    return data;
  } catch (error) {
    console.error("❌ Error fetching main products:", error);
    throw new Error(`Error al cargar productos principales: ${error.message}`);
  }
}

/**
 * Fetch de productos home (destacados)
 * Con retry automático y manejo de errores
 */
export async function fetchHomeProducts() {
  const url = process.env.NEXT_PUBLIC_HOME_PRODUCTS_URL;
  if (!url) {
    throw new Error(
      "fetchHomeProducts: NEXT_PUBLIC_HOME_PRODUCTS_URL is not defined. Asegúrate de configurar .env.local",
    );
  }

  try {
    const data = await httpClient.get(url);
    if (!data) {
      throw new Error("No se devolvieron productos de la API");
    }
    return data;
  } catch (error) {
    console.error("❌ Error fetching home products:", error);
    throw new Error(`Error al cargar productos destacados: ${error.message}`);
  }
}

/**
 * Fetch de página de productos
 * Con retry automático y manejo de errores
 */
export async function fetchProductsPage() {
  const url = process.env.NEXT_PUBLIC_PRODUCTS_PAGE_URL;
  if (!url) {
    throw new Error(
      "fetchProductsPage: NEXT_PUBLIC_PRODUCTS_PAGE_URL is not defined. Asegúrate de configurar .env.local",
    );
  }

  try {
    const data = await httpClient.get(url);
    if (!data) {
      throw new Error("No se devolvieron productos de la API");
    }
    return data;
  } catch (error) {
    console.error("❌ Error fetching products page:", error);
    throw new Error(`Error al cargar página de productos: ${error.message}`);
  }
}

// ============ ORDERS API ============

/**
 * Guardar una nueva orden en Firebase Realtime Database
 * Con reintentos automáticos
 * @param {Object} orderData - Datos de la orden
 * @returns {Promise<Object>} Orden guardada con ID
 */
export async function saveOrder(orderData) {
  const databaseUrl = process.env.NEXT_FIREBASE_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "saveOrder: NEXT_FIREBASE_DATABASE_URL is not defined. Asegúrate de configurar .env.local",
    );
  }

  const ordersUrl = `${databaseUrl}/orders/${orderData.orderId}.json`;

  try {
    const data = await httpClient.put(ordersUrl, orderData);
    console.log("✅ Orden guardada exitosamente:", orderData.orderId);
    return data;
  } catch (error) {
    console.error("❌ Error guardando orden:", error);
    throw new Error(`Error al guardar orden: ${error.message}`);
  }
}

/**
 * Obtener todas las órdenes
 * @returns {Promise<Array>} Lista de órdenes
 */
export async function getOrders() {
  const databaseUrl = process.env.NEXT_FIREBASE_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "getOrders: NEXT_FIREBASE_DATABASE_URL is not defined. Asegúrate de configurar .env.local",
    );
  }

  const ordersUrl = `${databaseUrl}/orders.json`;

  try {
    const data = await httpClient.get(ordersUrl);

    if (!data) {
      return [];
    }

    // Convertir objeto de Firebase a array
    return Object.entries(data).map(([key, value]) => ({
      ...value,
      id: key,
    }));
  } catch (error) {
    console.error("❌ Error obteniendo órdenes:", error);
    throw new Error(`Error al obtener órdenes: ${error.message}`);
  }
}

/**
 * Obtener una orden por ID
 * @param {string} orderId - ID de la orden
 * @returns {Promise<Object>} Datos de la orden
 */
export async function getOrderById(orderId) {
  const baseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!baseUrl) {
    throw new Error(
      "Database URL not configured. Set NEXT_PUBLIC_FIREBASE_DATABASE_URL in .env.local",
    );
  }

  const orderUrl = `${baseUrl}/orders/${orderId}.json`;

  try {
    const data = await httpClient.get(orderUrl);

    if (!data) {
      throw new Error("Orden no encontrada");
    }

    return data;
  } catch (error) {
    console.error("❌ Error obteniendo orden:", error);
    throw new Error(`Error al obtener orden: ${error.message}`);
  }
}

/**
 * Actualizar estado de la orden
 * @param {string} orderId - ID de la orden
 * @param {string|Object} status - Nuevo estado de la orden
 * @returns {Promise<Object>} Orden actualizada
 */
export async function updateOrderStatus(orderId, status) {
  const baseUrl = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
  if (!baseUrl) {
    throw new Error(
      "Database URL not configured. Set NEXT_PUBLIC_FIREBASE_DATABASE_URL in .env.local",
    );
  }

  const orderUrl = `${baseUrl}/orders/${orderId}/status.json`;

  try {
    const data = await httpClient.put(orderUrl, status);

    return data;
  } catch (error) {
    console.error("❌ Error actualizando orden:", error);
    throw new Error(`Error al actualizar orden: ${error.message}`);
  }
}
