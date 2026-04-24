import { getIbgeNews } from '../services/ibgeService.js';

/**
 * GET /api/ibge/news?limit=5
 * Retorna as notícias mais recentes da Agência de Notícias do IBGE.
 */
export async function listIbgeNews(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const result = await getIbgeNews(limit);
    res.json(result);
  } catch (err) {
    const status = err.statusCode || 500;
    res.status(status).json({
      error:  err.message,
      source: 'IBGE',
    });
  }
}
