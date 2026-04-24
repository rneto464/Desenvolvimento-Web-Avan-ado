/**
 * httpClient.js — Cliente HTTP centralizado baseado em axios
 *
 * Todos os módulos de integração devem usar este client em vez
 * de instanciar axios diretamente, garantindo:
 *   - Timeout padrão configurável via .env
 *   - Log automático de requests e erros
 *   - Tratamento uniforme de erros HTTP
 */

import axios from 'axios';
import logger from '../middlewares/logger.js';

const DEFAULT_TIMEOUT = parseInt(process.env.HTTP_CLIENT_TIMEOUT_MS) || 10000;

/**
 * Cria uma instância axios configurada para uma API externa.
 * @param {string} baseURL
 * @param {object} [extraHeaders]
 * @returns {import('axios').AxiosInstance}
 */
export function createHttpClient(baseURL, extraHeaders = {}) {
  const client = axios.create({
    baseURL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...extraHeaders,
    },
  });

  // --- Interceptor de Requisição: Log de saída ---
  client.interceptors.request.use((config) => {
    logger.info('HTTP_OUT', `${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  });

  // --- Interceptor de Resposta: Log de retorno e mapeamento de erros ---
  client.interceptors.response.use(
    (response) => {
      logger.info(
        'HTTP_IN',
        `${response.status} ${response.config.method?.toUpperCase()} ${response.config.url} — ${
          JSON.stringify(response.data).length
        } bytes`
      );
      return response;
    },
    (error) => {
      const status  = error.response?.status  || 'SEM_RESPOSTA';
      const message = error.response?.data?.message || error.message;
      const url     = error.config?.url || '';

      logger.error('HTTP_ERR', `${status} ${url} — ${message}`);

      // Normaliza o erro para que services possam tratar uniformemente
      const normalized = new Error(message);
      normalized.statusCode = error.response?.status || 503;
      normalized.isHttpError = true;
      throw normalized;
    }
  );

  return client;
}
