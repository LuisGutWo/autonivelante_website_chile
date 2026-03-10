import { logger, LogCategory } from "../lib/logger";

/**
 * Formato de precio en pesos chilenos
 * @param price Precio numérico
 * @returns String formateado con separadores de miles
 */
export const formatPrice = (price: number | string): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    if (isNaN(numPrice)) {
        logger.warn(
            "formatPrice: Valor inválido recibido",
            { receivedValue: price, type: typeof price },
            LogCategory.GENERAL
        );
        return '$0';
    }

    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(numPrice);
};

/**
 * Formatea un número con separadores de miles
 * @param num Número a formatear
 * @returns String formateado
 */
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-CL').format(num);
};

/**
 * Trunca un texto a un número específico de caracteres
 * @param text Texto a truncar
 * @param maxLength Longitud máxima
 * @returns Texto truncado con elipsis si es necesario
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
};

/**
 * Valida si un email tiene formato válido
 * @param email Email a validar
 * @returns true si es válido
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida teléfono chileno
 * @param phone Número telefónico
 * @returns true si es válido
 */
export const isValidChileanPhone = (phone: string): boolean => {
    const phoneRegex = /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

/**
 * Genera un ID único
 * @returns String único
 */
export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
