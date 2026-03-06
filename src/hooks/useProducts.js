"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchMainProducts,
  fetchHomeProducts,
  fetchProductsPage,
  saveOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../lib/api';

/**
 * 🎣 HOOKS PERSONALIZADOS CON REACT QUERY
 *
 * Estos hooks implementan caching inteligente, stale-while-revalidate
 * y deduplicación automática de requests.
 */

// ============================================
// 📦 PRODUCTOS - Query Hooks
// ============================================

/**
 * Hook para productos principales (catálogo completo)
 *
 * @returns {UseQueryResult} { data, isLoading, error, refetch }
 */
export function useMainProducts() {
  return useQuery({
    queryKey: ["products", "main"],
    queryFn: fetchMainProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
  });
}

/**
 * Hook para productos destacados (home page)
 *
 * @returns {UseQueryResult} { data, isLoading, error, refetch }
 */
export function useHomeProducts() {
  return useQuery({
    queryKey: ["products", "home"],
    queryFn: fetchHomeProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
  });
}

/**
 * Hook para productos de la página de listado
 *
 * @returns {UseQueryResult} { data, isLoading, error, refetch }
 */
export function useProductsPage() {
  return useQuery({
    queryKey: ["products", "page"],
    queryFn: fetchProductsPage,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: 3,
  });
}

/**
 * Hook para obtener todos los productos (fusiona todos los endpoints)
 * Útil para búsquedas globales
 *
 * @returns {UseQueryResult} { data, isLoading, error, refetch }
 */
export function useAllProducts() {
  return useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const [main, home, page] = await Promise.all([
        fetchMainProducts(),
        fetchHomeProducts(),
        fetchProductsPage(),
      ]);

      // Fusionar y deduplicar por ID
      const allProducts = [...main, ...home, ...page];
      const uniqueProducts = Array.from(
        new Map(allProducts.map((p) => [p.id, p])).values(),
      );

      return uniqueProducts;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook para buscar productos por query
 * Solo hace el fetch cuando hay una query válida
 *
 * @param {string} searchQuery - Término de búsqueda
 * @returns {UseQueryResult} { data, isLoading, error, refetch }
 */
export function useProductSearch(searchQuery) {
  return useQuery({
    queryKey: ["products", "search", searchQuery],
    queryFn: async () => {
      const products = await fetchMainProducts();

      if (!searchQuery || searchQuery.trim() === "") {
        return products;
      }

      const query = searchQuery.toLowerCase();
      return products.filter(
        (product) =>
          product.title?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query),
      );
    },
    staleTime: 2 * 60 * 1000, // 2 minutos (búsquedas cambian más)
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    enabled: true, // Siempre habilitado, filtra en queryFn
  });
}

// ============================================
// 📋 ÓRDENES - Query Hooks
// ============================================

/**
 * Hook para obtener todas las órdenes
 *
 * @returns {UseQueryResult} { data, isLoading, error, refetch }
 */
export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    staleTime: 1 * 60 * 1000, // 1 minuto (órdenes cambian más frecuentemente)
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
  });
}

/**
 * Hook para obtener una orden específica por ID
 *
 * @param {string} orderId - ID de la orden
 * @returns {UseQueryResult} { data, isLoading, error, refetch }
 */
export function useOrder(orderId) {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: () => getOrderById(orderId),
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 2,
    enabled: !!orderId, // Solo ejecutar si orderId existe
  });
}

// ============================================
// ✏️ ÓRDENES - Mutation Hooks
// ============================================

/**
 * Hook para crear/guardar una nueva orden
 * Invalida automáticamente el caché de órdenes
 *
 * @returns {UseMutationResult} { mutate, mutateAsync, isLoading, error }
 */
export function useSaveOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveOrder,
    onSuccess: () => {
      // Invalidar caché de órdenes para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("❌ Error guardando orden:", error);
    },
  });
}

/**
 * Hook para actualizar el estado de una orden
 * Invalida automáticamente el caché de la orden específica y la lista
 *
 * @returns {UseMutationResult} { mutate, mutateAsync, isLoading, error }
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: (data, variables) => {
      // Invalidar caché de la orden específica
      queryClient.invalidateQueries({
        queryKey: ["orders", variables.orderId],
      });

      // Invalidar caché de todas las órdenes
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("❌ Error actualizando orden:", error);
    },
  });
}

// ============================================
// 🔄 UTILIDADES DE CACHÉ
// ============================================

/**
 * Hook para obtener el QueryClient y manipular caché manualmente
 *
 * @returns {QueryClient}
 *
 * @example
 * const queryClient = useInvalidateCache();
 *
 * // Invalidar productos
 * queryClient.invalidateQueries({ queryKey: ['products'] });
 *
 * // Limpiar toda la caché
 * queryClient.clear();
 *
 * // Actualizar dato en caché sin refetch
 * queryClient.setQueryData(['products', 'main'], newData);
 */
export function useInvalidateCache() {
  return useQueryClient();
}

/**
 * Hook para prefetch de datos (precarga)
 * Útil para precargar datos que el usuario verá pronto
 *
 * @example
 * const prefetch = usePrefetch();
 *
 * // Precargar productos al hover de un link
 * <Link
 *   href="/products"
 *   onMouseEnter={() => prefetch.products()}
 * >
 *   Productos
 * </Link>
 */
export function usePrefetch() {
  const queryClient = useQueryClient();

  return {
    mainProducts: () =>
      queryClient.prefetchQuery({
        queryKey: ["products", "main"],
        queryFn: fetchMainProducts,
      }),

    homeProducts: () =>
      queryClient.prefetchQuery({
        queryKey: ["products", "home"],
        queryFn: fetchHomeProducts,
      }),

    productsPage: () =>
      queryClient.prefetchQuery({
        queryKey: ["products", "page"],
        queryFn: fetchProductsPage,
      }),

    orders: () =>
      queryClient.prefetchQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
      }),
  };
}

/**
 * 📝 NOTAS DE USO:
 *
 * 1. EN COMPONENTES CLIENT:
 * ```jsx
 * "use client";
 *
 * import { useMainProducts } from './useProducts';
 *
 * export default function ProductsPage() {
 *   const { data, isLoading, error, refetch } = useMainProducts();
 *
 *   if (isLoading) return <LoadingFallback />;
 *   if (error) return <APIError error={error} onRetry={refetch} />;
 *
 *   return <ProductList products={data} />;
 * }
 * ```
 *
 * 2. MUTATIONS (ÓRDENES):
 * ```jsx
 * const { mutate, isLoading } = useSaveOrder();
 *
 * const handleSubmit = () => {
 *   mutate(orderData, {
 *     onSuccess: () => {
 *       toast.success('Orden guardada');
 *       router.push('/success');
 *     },
 *     onError: (error) => {
 *       toast.error(error.message);
 *     }
 *   });
 * };
 * ```
 *
 * 3. INVALIDACIÓN MANUAL:
 * ```jsx
 * const queryClient = useInvalidateCache();
 *
 * // Después de crear un producto manualmente
 * queryClient.invalidateQueries({ queryKey: ['products'] });
 * ```
 *
 * 4. PREFETCH PARA NAVEGACIÓN RÁPIDA:
 * ```jsx
 * const prefetch = usePrefetch();
 *
 * <Link
 *   href="/products"
 *   onMouseEnter={() => prefetch.mainProducts()}
 * >
 *   Ver Productos
 * </Link>
 * ```
 */

/**
 * 🎯 BENEFICIOS:
 *
 * ✅ DEDUPLICACIÓN AUTOMÁTICA:
 *    - 3 componentes usando useMainProducts() = 1 solo request
 *    - Query key identifica requests duplicados
 *
 * ✅ STALE-WHILE-REVALIDATE:
 *    - Datos se muestran inmediatamente del caché
 *    - Se revalidan en background
 *    - Usuario no espera
 *
 * ✅ INVALIDACIÓN INTELIGENTE:
 *    - Mutations invalidan automáticamente queries relacionadas
 *    - Ej: Crear orden → Invalida lista de órdenes
 *
 * ✅ PREFETCH:
 *    - Precargar datos en hover
 *    - Navegación instantánea
 *
 * ✅ RETRY AUTOMÁTICO:
 *    - Fallos transitorios se reintentan
 *    - Usuario no ve errores temporales
 */
