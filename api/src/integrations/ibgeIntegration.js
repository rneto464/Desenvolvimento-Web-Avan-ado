/**
 * ibgeIntegration.js — Integração com a API pública do IBGE
 *
 * Endpoints consumidos:
 *   GET https://servicodados.ibge.gov.br/api/v3/noticias/?qtd=N
 *
 * Documentação IBGE: https://servicodados.ibge.gov.br/api/docs/noticias
 */

import { createHttpClient } from './httpClient.js';

const client = createHttpClient('https://servicodados.ibge.gov.br/api/v3');

// --------------------------------------------------------------------------
// Mapeamento de dados — transforma o payload bruto do IBGE no schema interno
// --------------------------------------------------------------------------

/**
 * Mapeia um item bruto da API do IBGE para o formato padronizado da aplicação.
 * @param {object} item — Objeto bruto retornado pela API do IBGE
 * @returns {{ id, title, summary, link, publishedAt, image, editorias }}
 */
function mapIbgeArticle(item) {
  // Validação mínima dos campos obrigatórios
  if (!item?.id || !item?.titulo) {
    throw new Error(`Item IBGE inválido: campos obrigatórios ausentes (id, titulo). Recebido: ${JSON.stringify(item)}`);
  }

  return {
    id:          item.id,
    title:       item.titulo?.trim() || '',
    summary:     item.introducao?.trim() || '',
    link:        item.link || null,
    publishedAt: item.data_publicacao || null,
    image:       item.imagens ? parseIbgeImage(item.imagens) : null,
    editorias:   item.editorias
      ? item.editorias.split('|').map(e => e.trim()).filter(Boolean)
      : [],
  };
}

/**
 * Extrai a URL da imagem principal do campo imagens (JSON em string).
 * @param {string} imagens
 * @returns {string|null}
 */
function parseIbgeImage(imagens) {
  try {
    const parsed = JSON.parse(imagens);
    // A API retorna objeto com chave "1" contendo a imagem principal
    const main = parsed?.['1'];
    if (!main?.url) return null;
    return `https://agenciadenoticias.ibge.gov.br/${main.url}`;
  } catch {
    return null;
  }
}

// --------------------------------------------------------------------------
// Funções públicas de integração
// --------------------------------------------------------------------------

/**
 * Busca as notícias mais recentes do IBGE.
 * @param {number} [limit=5]  — Quantidade de notícias (entre 3 e 5 conforme regra de negócio)
 * @returns {Promise<Array<{ id, title, summary, link, publishedAt, image, editorias }>>}
 */
export async function fetchLatestNews(limit = 5) {
  const qtd = Math.max(3, Math.min(limit, 5));

  const response = await client.get('/noticias/', { params: { qtd } });

  const items = response.data?.items;

  // Validação da estrutura de resposta
  if (!Array.isArray(items)) {
    throw new Error(`Resposta inesperada da API do IBGE: campo 'items' ausente ou inválido.`);
  }

  return items.map(mapIbgeArticle);
}
