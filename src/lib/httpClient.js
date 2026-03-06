/**
 * HTTP Client con Retry Logic
 * Maneja requests con reintentos automáticos y manejo de errores
 *
 * Uso:
 * const data = await httpClient.get('/api/products');
 * const result = await httpClient.post('/api/order', { items: [...] });
 */

class HttpClientError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "HttpClientError";
    this.status = status;
    this.data = data;
  }
}

const DEFAULT_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 segundo
  maxDelay: 10000, // 10 segundos
  timeout: 10000, // 10 segundos
};

class HttpClient {
  constructor(config = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cache = new Map();
  }

  /**
   * Delay para reintentos con exponential backoff
   */
  async _delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Calcula delay con exponential backoff
   */
  _getDelayWithBackoff(attempt) {
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
  _isRetryable(status, error) {
    // Reintentar en timeouts o errores de red
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return true;
    }

    // Reintentar en estos status codes
    const retryableStatus = [408, 429, 500, 502, 503, 504];
    return retryableStatus.includes(status);
  }

  /**
   * Realiza un fetch con reintentos
   */
  async _fetchWithRetry(url, options = {}) {
    let lastError;
    let lastStatus;

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
  async get(url, options = {}) {
    const cacheKey = `GET_${url}`;

    // Retornar del caché si existe
    if (options.cache !== false && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const response = await this._fetchWithRetry(url, {
      ...options,
      method: "GET",
    });

    const data = await response.json();

    // Guardar en caché
    if (options.cache !== false) {
      this.cache.set(cacheKey, data);
    }

    return data;
  }

  /**
   * POST request
   */
  async post(url, body, options = {}) {
    const response = await this._fetchWithRetry(url, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(body),
    });

    return await response.json();
  }

  /**
   * PUT request
   */
  async put(url, body, options = {}) {
    const response = await this._fetchWithRetry(url, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(body),
    });

    return await response.json();
  }

  /**
   * DELETE request
   */
  async delete(url, options = {}) {
    const response = await this._fetchWithRetry(url, {
      ...options,
      method: "DELETE",
    });

    return await response.json();
  }

  /**
   * Limpia el caché
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Limpia entrada específica del caché
   */
  clearCacheEntry(url, method = "GET") {
    const cacheKey = `${method}_${url}`;
    this.cache.delete(cacheKey);
  }
}

// Exportar instancia singleton
export const httpClient = new HttpClient();
export default HttpClient;
