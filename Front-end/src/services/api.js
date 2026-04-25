import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// --------------------------------------------------------------------------
// Regiões — /api/regions
// --------------------------------------------------------------------------
export const regionsService = {
  /**
   * Lista todas as regiões disponíveis
   * (São Luís, Raposa, Paço do Lumiar, São José de Ribamar)
   */
  getAll: async () => {
    const response = await api.get('/regions');
    return response.data;
  },

  /**
   * Retorna dados socioeconômicos de uma região pelo id
   * @param {string} id  — "1" | "2" | "3" | "4" | "all"
   */
  getData: async (id) => {
    const response = await api.get(`/regions/${id}/data`);
    return response.data;
  },

  /**
   * Retorna as notícias de uma região pelo id
   * @param {string} id  — "1" | "2" | "3" | "4" | "all"
   */
  getNews: async (id) => {
    const response = await api.get(`/regions/${id}/news`);
    return response.data; // { region_id, articles: [] }
  },
};

// --------------------------------------------------------------------------
// Notícias — /api/news
// --------------------------------------------------------------------------
export const newsService = {
  /**
   * Busca uma notícia pelo id
   * @param {number|string} id
   */
  getById: async (id) => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  /**
   * Cria uma notícia manualmente
   * @param {{ region_id, title, content, category?, source?, summary?, url?, imageUrl? }} payload
   */
  create: async (payload) => {
    const response = await api.post('/news', payload);
    return response.data;
  },

  /**
   * Atualiza uma notícia existente
   * @param {number|string} id
   * @param {{ category?, title?, source?, summary?, content? }} payload
   */
  update: async (id, payload) => {
    const response = await api.put(`/news/${id}`, payload);
    return response.data;
  },

  /**
   * Remove uma notícia pelo id
   * @param {number|string} id
   */
  remove: async (id) => {
    const response = await api.delete(`/news/${id}`);
    return response.data;
  },

  /**
   * Força sincronização manual com o G1 Maranhão (Puppeteer)
   * Em produção, o cron executa automaticamente a cada hora.
   */
  syncG1: async () => {
    const response = await api.post('/news/external/g1/sync');
    return response.data;
  },
};

// --------------------------------------------------------------------------
// Health check — /api/health
// --------------------------------------------------------------------------
export const healthService = {
  check: async () => {
    const response = await api.get('/health');
    return response.data; // { status: 'ok', timestamp }
  },
};

export default api;
