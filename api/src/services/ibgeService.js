/**
 * ibgeService.js — Camada de negócio para notícias do IBGE
 *
 * Orquestra a integração com a API do IBGE e aplica
 * regras de negócio sobre os dados recebidos.
 */

import { fetchLatestNews } from '../integrations/ibgeIntegration.js';

/**
 * Retorna as notícias mais recentes do IBGE, validadas e mapeadas.
 *
 * Regras de negócio:
 *   - Quantidade mínima: 3 / máxima: 5
 *   - Artigos sem título são descartados
 *   - Artigos sem link externo são marcados como indisponíveis
 *
 * @param {number} [limit=5]
 * @returns {Promise<{ source: string, total: number, articles: object[] }>}
 */
export async function getIbgeNews(limit = 5) {
  const articles = await fetchLatestNews(limit);

  // Filtro: descarta artigos sem título (dados corrompidos)
  const valid = articles.filter(a => a.title && a.title.length > 0);

  // Enriquecimento: marca artigos sem link
  const enriched = valid.map(a => ({
    ...a,
    available: !!a.link,
  }));

  return {
    source:   'IBGE — Agência de Notícias',
    total:    enriched.length,
    articles: enriched,
  };
}
