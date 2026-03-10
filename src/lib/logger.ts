/**
 * 📋 Sistema de Logging Centralizado
 * 
 * Logger profesional con niveles de log, control de entorno y
 * preparado para integración con servicios de monitoreo (Sentry, LogRocket).
 * 
 * @example
 * ```typescript
 * import { logger } from '@/src/lib/logger';
 * 
 * logger.info('Usuario inició sesión', { userId: '123' });
 * logger.error('Error al procesar pago', error, { orderId: '456' });
 * logger.warn('Stock bajo', { productId: '789', stock: 2 });
 * logger.debug('Estado del carrito', cart);
 * ```
 */

/**
 * Niveles de log disponibles
 */
export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4,
}

/**
 * Categorías de log para mejor organización
 */
export enum LogCategory {
    API = "API",
    REDUX = "Redux",
    UI = "UI",
    FIREBASE = "Firebase",
    CART = "Cart",
    CHECKOUT = "Checkout",
    PRODUCT = "Product",
    NAVIGATION = "Navigation",
    PERFORMANCE = "Performance",
    GENERAL = "General",
}

/**
 * Metadata opcional para contexto adicional
 */
interface LogMetadata {
    [key: string]: any;
}

/**
 * Configuración del logger
 */
interface LoggerConfig {
    /** Nivel mínimo de log a mostrar */
    minLevel: LogLevel;
    /** Habilitar logs en consola */
    enableConsole: boolean;
    /** Habilitar timestamps */
    enableTimestamps: boolean;
    /** Habilitar stack traces en errors */
    enableStackTrace: boolean;
    /** Prefijo para todos los logs */
    prefix?: string;
}

/**
 * Clase Logger - Manejo centralizado de logs
 */
class Logger {
    private config: LoggerConfig;
    private isDevelopment: boolean;

    constructor(config?: Partial<LoggerConfig>) {
        this.isDevelopment = process.env.NODE_ENV !== "production";

        // Configuración por defecto
        this.config = {
            minLevel: this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN,
            enableConsole: true,
            enableTimestamps: this.isDevelopment,
            enableStackTrace: this.isDevelopment,
            prefix: "🏗️ Autonivelante",
            ...config,
        };
    }

    /**
     * Verifica si un nivel de log debe mostrarse
     */
    private shouldLog(level: LogLevel): boolean {
        return (
            this.config.enableConsole &&
            level >= this.config.minLevel &&
            this.config.minLevel !== LogLevel.NONE
        );
    }

    /**
     * Formatea el mensaje con prefijo y timestamp
     */
    private formatMessage(
        level: string,
        category: LogCategory,
        message: string
    ): string {
        const parts: string[] = [];

        if (this.config.prefix) {
            parts.push(this.config.prefix);
        }

        if (this.config.enableTimestamps) {
            parts.push(new Date().toISOString());
        }

        parts.push(`[${level}]`);
        parts.push(`[${category}]`);
        parts.push(message);

        return parts.join(" ");
    }

    /**
     * Envía log a servicios externos (Sentry, LogRocket, etc.)
     */
    private sendToExternalService(
        level: LogLevel,
        message: string,
        error?: Error,
        metadata?: LogMetadata
    ): void {
        // TODO: Integrar con Sentry cuando esté disponible
        // if (level === LogLevel.ERROR && typeof window !== 'undefined' && window.Sentry) {
        //   window.Sentry.captureException(error || new Error(message), {
        //     extra: metadata,
        //   });
        // }
    }

    /**
     * Log nivel DEBUG - Solo en desarrollo
     * Útil para debugging detallado
     */
    debug(
        message: string,
        metadata?: LogMetadata,
        category: LogCategory = LogCategory.GENERAL
    ): void {
        if (!this.shouldLog(LogLevel.DEBUG)) return;

        const formattedMessage = this.formatMessage("DEBUG", category, message);

        if (this.isDevelopment) {
            console.log(
                `%c${formattedMessage}`,
                "color: #6c757d; font-weight: normal;",
                metadata || ""
            );
        }
    }

    /**
     * Log nivel INFO - Información general
     */
    info(
        message: string,
        metadata?: LogMetadata,
        category: LogCategory = LogCategory.GENERAL
    ): void {
        if (!this.shouldLog(LogLevel.INFO)) return;

        const formattedMessage = this.formatMessage("INFO", category, message);

        if (this.isDevelopment) {
            console.log(
                `%c${formattedMessage}`,
                "color: #0dcaf0; font-weight: bold;",
                metadata || ""
            );
        } else {
            console.info(formattedMessage, metadata || "");
        }
    }

    /**
     * Log nivel WARN - Advertencias
     */
    warn(
        message: string,
        metadata?: LogMetadata,
        category: LogCategory = LogCategory.GENERAL
    ): void {
        if (!this.shouldLog(LogLevel.WARN)) return;

        const formattedMessage = this.formatMessage("WARN", category, message);

        console.warn(formattedMessage, metadata || "");
        this.sendToExternalService(LogLevel.WARN, message, undefined, metadata);
    }

    /**
     * Log nivel ERROR - Errores críticos
     */
    error(
        message: string,
        error?: Error | unknown,
        metadata?: LogMetadata,
        category: LogCategory = LogCategory.GENERAL
    ): void {
        if (!this.shouldLog(LogLevel.ERROR)) return;

        const formattedMessage = this.formatMessage("ERROR", category, message);

        console.error(formattedMessage, error || "", metadata || "");

        if (this.config.enableStackTrace && error instanceof Error) {
            console.error("Stack trace:", error.stack);
        }

        // Enviar a servicios externos
        this.sendToExternalService(
            LogLevel.ERROR,
            message,
            error instanceof Error ? error : undefined,
            metadata
        );
    }

    /**
     * Log de performance - Para medir tiempos de operación
     */
    performance(
        operation: string,
        duration: number,
        metadata?: LogMetadata
    ): void {
        this.debug(
            `⏱️ ${operation} completado en ${duration.toFixed(2)}ms`,
            metadata,
            LogCategory.PERFORMANCE
        );
    }

    /**
     * Log de API request - Para debugging de llamadas HTTP
     */
    apiRequest(
        method: string,
        url: string,
        metadata?: LogMetadata
    ): void {
        this.debug(
            `🌐 ${method} ${url}`,
            metadata,
            LogCategory.API
        );
    }

    /**
     * Log de API response - Para debugging de respuestas HTTP
     */
    apiResponse(
        status: number,
        url: string,
        duration?: number,
        metadata?: LogMetadata
    ): void {
        const emoji = status >= 200 && status < 300 ? "✅" : "❌";
        const durationText = duration ? ` (${duration.toFixed(0)}ms)` : "";

        this.debug(
            `${emoji} ${status} ${url}${durationText}`,
            metadata,
            LogCategory.API
        );
    }

    /**
     * Grupo de logs - Agrupa logs relacionados
     */
    group(title: string, callback: () => void): void {
        if (!this.isDevelopment) return;

        console.group(
            `%c${this.config.prefix} ${title}`,
            "color: #0d6efd; font-weight: bold;"
        );
        callback();
        console.groupEnd();
    }

    /**
     * Tabla formateada - Para mostrar datos estructurados
     */
    table(data: any[], label?: string): void {
        if (!this.isDevelopment) return;

        if (label) {
            console.log(
                `%c${this.config.prefix} ${label}`,
                "color: #0d6efd; font-weight: bold;"
            );
        }
        console.table(data);
    }

    /**
     * Actualizar configuración en runtime
     */
    configure(config: Partial<LoggerConfig>): void {
        this.config = { ...this.config, ...config };
    }

    /**
     * Deshabilitar todos los logs
     */
    disable(): void {
        this.config.minLevel = LogLevel.NONE;
    }

    /**
     * Habilitar todos los logs
     */
    enable(): void {
        this.config.minLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.WARN;
    }
}

/**
 * Instancia global del logger
 */
export const logger = new Logger();

/**
 * Helper para medir performance de funciones
 * 
 * @example
 * ```typescript
 * const result = await measurePerformance(
 *   'fetchProducts',
 *   () => fetchProducts()
 * );
 * ```
 */
export async function measurePerformance<T>(
    operation: string,
    fn: () => Promise<T> | T,
    metadata?: LogMetadata
): Promise<T> {
    const start = performance.now();

    try {
        const result = await fn();
        const duration = performance.now() - start;
        logger.performance(operation, duration, metadata);
        return result;
    } catch (error) {
        const duration = performance.now() - start;
        logger.error(
            `${operation} falló después de ${duration.toFixed(2)}ms`,
            error,
            metadata,
            LogCategory.PERFORMANCE
        );
        throw error;
    }
}

/**
 * Export por defecto
 */
export default logger;
