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
   * Lista notícias com paginação e filtros opcionais.
   * Retorna { data, total, page, limit, totalPages }
   * @param {{ page?: number, limit?: number, region_id?: string, category?: string }} opts
   */
  getAll: async ({ page = 1, limit = 12, region_id, category } = {}) => {
    const params = { page, limit };
    if (region_id) params.region_id = region_id;
    if (category) params.category = category;
    const response = await api.get('/news', { params });
    return response.data;
  },

  /**
   * Busca uma notícia pelo id
   * @param {number|string} id
   */
  getById: async (id) => {
    const response = await api.get(`/news/${id}`);
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
