"use client";

import {
    useQuery,
    useMutation,
    useQueryClient,
    type QueryClient,
    type UseMutationResult,
    type UseQueryResult,
} from "@tanstack/react-query";
import {
    fetchMainProducts,
    fetchHomeProducts,
    fetchProductsPage,
    saveOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
} from "../lib/api";
import type { CheckoutOrder, OrderStatus, Product } from "../types";

type ProductsResult = UseQueryResult<Product[], Error>;
type OrdersResult = UseQueryResult<CheckoutOrder[], Error>;
type OrderResult = UseQueryResult<CheckoutOrder, Error>;

type UpdateOrderStatusInput = {
    orderId: string;
    status: OrderStatus;
};

export function useMainProducts(): ProductsResult {
    return useQuery<Product[], Error>({
        queryKey: ["products", "main"],
        queryFn: fetchMainProducts,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 3,
    });
}

export function useHomeProducts(): ProductsResult {
    return useQuery<Product[], Error>({
        queryKey: ["products", "home"],
        queryFn: fetchHomeProducts,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 3,
    });
}

export function useProductsPage(): ProductsResult {
    return useQuery<Product[], Error>({
        queryKey: ["products", "page"],
        queryFn: fetchProductsPage,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 3,
    });
}

export function useAllProducts(): ProductsResult {
    return useQuery<Product[], Error>({
        queryKey: ["products", "all"],
        queryFn: async (): Promise<Product[]> => {
            const [main, home, page] = await Promise.all([
                fetchMainProducts(),
                fetchHomeProducts(),
                fetchProductsPage(),
            ]);

            const allProducts = [...main, ...home, ...page];
            return Array.from(new Map(allProducts.map((p) => [p.id, p])).values());
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
    });
}

export function useProductSearch(searchQuery: string): ProductsResult {
    return useQuery<Product[], Error>({
        queryKey: ["products", "search", searchQuery],
        queryFn: async (): Promise<Product[]> => {
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
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        enabled: true,
    });
}

export function useOrders(): OrdersResult {
    return useQuery<CheckoutOrder[], Error>({
        queryKey: ["orders"],
        queryFn: getOrders,
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
    });
}

export function useOrder(orderId: string): OrderResult {
    return useQuery<CheckoutOrder, Error>({
        queryKey: ["orders", orderId],
        queryFn: () => getOrderById(orderId),
        staleTime: 1 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        enabled: Boolean(orderId),
    });
}

export function useSaveOrder(): UseMutationResult<CheckoutOrder, Error, CheckoutOrder> {
    const queryClient = useQueryClient();

    return useMutation<CheckoutOrder, Error, CheckoutOrder>({
        mutationFn: saveOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error: Error) => {
            console.error("Error guardando orden:", error);
        },
    });
}

export function useUpdateOrderStatus(): UseMutationResult<
    OrderStatus,
    Error,
    UpdateOrderStatusInput
> {
    const queryClient = useQueryClient();

    return useMutation<OrderStatus, Error, UpdateOrderStatusInput>({
        mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["orders", variables.orderId] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: (error: Error) => {
            console.error("Error actualizando orden:", error);
        },
    });
}

export function useInvalidateCache(): QueryClient {
    return useQueryClient();
}

export function usePrefetch(): {
    mainProducts: () => Promise<void>;
    homeProducts: () => Promise<void>;
    productsPage: () => Promise<void>;
    orders: () => Promise<void>;
} {
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
