/**
 * HTTP Client con Retry Logic
 * Maneja requests con reintentos automáticos y manejo de errores
 *
 * Uso:
 * const data = await httpClient.get('/api/products');
 * const result = await httpClient.post('/api/order', { items: [...] });
 */

interface HttpClientConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  timeout: number;
}

type HttpClientCacheOption = RequestCache | false;

interface HttpClientRequestOptions extends Omit<RequestInit, "cache"> {
  cache?: HttpClientCacheOption;
}

class HttpClientError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "HttpClientError";
    this.status = status;
    this.data = data;
  }
}

const DEFAULT_CONFIG: HttpClientConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 segundo
  maxDelay: 10000, // 10 segundos
  timeout: 10000, // 10 segundos
};

class HttpClient {
  private config: HttpClientConfig;
  private cache: Map<string, unknown>;

  constructor(config: Partial<HttpClientConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cache = new Map();
  }

  /**
   * Delay para reintentos con exponential backoff
   */
  private async _delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Calcula delay con exponential backoff
   */
  private _getDelayWithBackoff(attempt: number): number {
    const delay = Math.min(
      this.config.initialDelay * Math.pow(2, attempt - 1),
      this.config.maxDelay,
    );
    // Agregar jitter (randomness) para evitar thundering herd
    return delay + Math.random() * (delay * 0.1);
  }

  /**
   * Verifica si el error es retryable
   */
  private _isRetryable(status?: number, error?: unknown): boolean {
    // Reintentar en timeouts o errores de red
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return true;
    }

    // Reintentar en estos status codes
    const retryableStatus = [408, 429, 500, 502, 503, 504];
    return status !== undefined && retryableStatus.includes(status);
  }

  /**
   * Realiza un fetch con reintentos
   */
  private async _fetchWithRetry(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    let lastError: unknown;
    let lastStatus: number | undefined;

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          this.config.timeout,
        );

        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Si es exitoso, retornar
        if (response.ok) {
          return response;
        }

        lastStatus = response.status;
        lastError = new HttpClientError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          null,
        );

        // Si no es retryable o es último intento, throw
        if (
          !this._isRetryable(response.status) ||
          attempt === this.config.maxRetries
        ) {
          throw lastError;
        }

        // Esperar antes de reintentar
        const delay = this._getDelayWithBackoff(attempt);
        console.warn(
          `⚠️ Request falló (status ${response.status}). Reintentando en ${Math.round(delay)}ms... (intento ${attempt}/${this.config.maxRetries})`,
        );
        await this._delay(delay);
      } catch (error) {
        lastError = error;

        // Si es error de red y no es último intento, reintentar
        if (
          this._isRetryable(lastStatus, error) &&
          attempt < this.config.maxRetries
        ) {
          const delay = this._getDelayWithBackoff(attempt);
          console.warn(
            `⚠️ Error de red. Reintentando en ${Math.round(delay)}ms... (intento ${attempt}/${this.config.maxRetries})`,
          );
          await this._delay(delay);
        } else {
          // Último intento o error no retryable
          if (error instanceof TypeError) {
            throw new HttpClientError(
              `Error de conexión: ${error.message}`,
              0,
              null,
            );
          }
          throw error;
        }
      }
    }

    throw lastError;
  }

  /**
   * GET request
   */
  async get<T>(url: string, options: HttpClientRequestOptions = {}): Promise<T> {
    const cacheKey = `GET_${url}`;
    const { cache: cacheControl, ...fetchOptions } = options;

    // Retornar del caché si existe
    if (cacheControl !== false && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) as T;
    }

    const response = await this._fetchWithRetry(url, {
      ...fetchOptions,
      method: "GET",
      ...(cacheControl ? { cache: cacheControl } : {}),
    });

    const data = (await response.json()) as T;

    // Guardar en caché
    if (cacheControl !== false) {
      this.cache.set(cacheKey, data);
    }

    return data;
  }

  /**
   * POST request
   */
  async post<TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    options: RequestInit = {},
  ): Promise<TResponse> {
    const response = await this._fetchWithRetry(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(body),
    });

    return (await response.json()) as TResponse;
  }

  /**
   * PUT request
   */
  async put<TResponse, TBody = unknown>(
    url: string,
    body: TBody,
    options: RequestInit = {},
  ): Promise<TResponse> {
    const response = await this._fetchWithRetry(url, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(body),
    });

    return (await response.json()) as TResponse;
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await this._fetchWithRetry(url, {
      ...options,
      method: "DELETE",
    });

    return (await response.json()) as T;
  }

  /**
   * Limpia el caché
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Limpia entrada específica del caché
   */
  clearCacheEntry(url: string, method = "GET"): void {
    const cacheKey = `${method}_${url}`;
    this.cache.delete(cacheKey);
  }
}

// Exportar instancia singleton
export const httpClient = new HttpClient();
export default HttpClient;
