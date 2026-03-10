/**
 * Core Type Definitions - Autonivelante Chile
 * 
 * Este archivo contiene las definiciones de tipos principales
 * utilizadas en toda la aplicación.
 */

// ============================================
// PRODUCT TYPES
// ============================================

/**
 * Producto principal del catálogo
 */
export interface Product {
    id: string;
    title: string;
    price: number;
    image: string;
    description?: string;
    category?: string;
    stock?: number;
    featured?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type ProductList = Product[];

/**
 * Producto en el carrito con cantidad
 */
export interface CartItem extends Product {
    qty: number;
}

/**
 * State del carrito en Redux (array simple)
 * Usado por Redux Toolkit slice actual
 */
export type CartStateArray = CartItem[];

/**
 * State del carrito en Redux (estructura completa)
 * Para futuras implementaciones avanzadas
 */
export interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
}

// ============================================
// USER TYPES
// ============================================

/**
 * Usuario autenticado
 */
export interface User {
    id: string;
    email: string;
    name?: string;
    photoURL?: string;
    createdAt?: string;
}

/**
 * State de autenticación
 */
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// ============================================
// ORDER TYPES
// ============================================

/**
 * Información de envío
 */
export interface ShippingInfo {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    region: string;
    zipCode?: string;
    notes?: string;
}

/**
 * Estado de la orden
 */
export type OrderStatus =
    | 'pending_payment'
    | 'pending'
    | 'processing'
    | 'completed'
    | 'cancelled'
    | 'failed';

export interface CustomerInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface AddressInfo {
    street: string;
    streetNumber: string;
    apartment?: string;
    city: string;
    region: string;
    postalCode: string;
}

export interface BillingContactInfo {
    name: string;
    email: string;
    phone: string;
}

export interface OrderSummary {
    subtotal: number;
    shipping: number;
    total: number;
}

export interface CheckoutOrder {
    orderId: string;
    createdAt: string;
    customerInfo: CustomerInfo;
    shippingInfo: AddressInfo;
    billingInfo: AddressInfo | BillingContactInfo;
    items: CartItem[];
    summary: OrderSummary;
    notes?: string;
    status: OrderStatus;
}

/**
 * Orden de compra
 */
export interface Order {
    id: string;
    userId?: string;
    items: CartItem[];
    total: number;
    shipping: ShippingInfo;
    status: OrderStatus;
    paymentIntentId?: string;
    createdAt: string;
    updatedAt?: string;
}

// ============================================
// PROJECT TYPES
// ============================================

/**
 * Proyecto realizado
 */
export interface Project {
    name: string;
    mt2: string;
    duration: string;
    year: string;
    description: string;
    thumbnail: string;
    images: string[];
}

// ============================================
// FORM TYPES
// ============================================

/**
 * Formulario de contacto
 */
export interface ContactFormData {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

/**
 * Formulario de newsletter
 */
export interface NewsletterFormData {
    email: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

/**
 * Respuesta genérica de API
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Error de API
 */
export interface ApiError {
    message: string;
    code?: string;
    statusCode?: number;
    details?: unknown;
}

// ============================================
// COMPONENT PROPS TYPES
// ============================================

/**
 * Props comunes para componentes
 */
export interface BaseComponentProps {
    className?: string;
    id?: string;
    children?: React.ReactNode;
}

/**
 * Props para ProductCard
 */
export interface ProductCardProps extends BaseComponentProps {
    product: Product;
    variant?: 'grid' | 'cart';
    index?: number;
    href?: string;
    imageHeight?: number;
    imageWidth?: number;
    onViewDetails?: (product: Product) => void;
    onAddToCart?: (product: Product) => void;
    onRemove?: (id: string) => void;
    onQtyChange?: (id: string, qty: number) => void;
    disableAddToCart?: boolean;
    showQuantityControls?: boolean;
}

/**
 * Props para Layout
 */
export interface LayoutProps {
    children: React.ReactNode;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Estado de carga
 */
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

/**
 * Resultado paginado
 */
export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

/**
 * Filtros de producto
 */
export interface ProductFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    featured?: boolean;
}

/**
 * Opciones de ordenamiento
 */
export type SortOption =
    | 'price-asc'
    | 'price-desc'
    | 'name-asc'
    | 'name-desc'
    | 'newest'
    | 'oldest';

// ============================================
// PAYMENT TYPES
// ============================================

/**
 * Intent de pago de Stripe
 */
export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: string;
    clientSecret: string;
}

/**
 * Opciones de pago
 */
export interface PaymentOptions {
    amount: number;
    orderId: string;
    currency?: string;
}

// ============================================
// LOGGING TYPES
// ============================================

/**
 * Re-exportar tipos del logger para acceso centralizado
 * Ver src/lib/logger.ts para documentación completa
 */
export { LogLevel, LogCategory } from '../lib/logger';
