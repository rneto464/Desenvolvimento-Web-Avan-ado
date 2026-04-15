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

export const newsService = {
  getAllNews: async (page = 1, limit = 12) => {
    try {
      const response = await api.get('/noticias', { params: { page, limit } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getNewsById: async (id) => {
    try {
      const response = await api.get(`/noticias/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  searchNews: async (query) => {
    try {
      const response = await api.get('/noticias/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getNewsByCategory: async (categoryId, page = 1, limit = 12) => {
    try {
      const response = await api.get(`/noticias/categoria/${categoryId}`, {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
