const { publicClient, adminClient } = require('../database/db');
const { runScraper } = require('./scraperService');
const { stripHtml, safeUrl } = require('../utils/sanitize');

/**
 * Serviço de Notícias — camada de negócio entre controllers e banco de dados.
 * Controllers não devem acessar o Supabase diretamente.
 */

/**
 * Lista notícias com paginação e filtros opcionais.
 * @param {{ page?: number, limit?: number, region_id?: string, category?: string }} opts
 * @returns {Promise<{ data: object[], total: number, page: number, limit: number, totalPages: number }>}
 */
async function listNews({ page = 1, limit = 12, region_id, category } = {}) {
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let query = publicClient.from('news').select('*', { count: 'exact' });

  if (region_id) query = query.eq('region_id', region_id);
  if (category)  query = query.ilike('category', `%${category}%`);

  const { data, error, count } = await query
    .order('id', { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    data: data || [],
    total: count || 0,
    page,
    limit,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

/**
 * Busca uma notícia pelo id.
 * @param {number|string} id
 * @returns {Promise<object|null>}
 */
async function getNewsById(id) {
  const { data, error } = await publicClient
    .from('news')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Cria uma notícia manualmente.
 * @param {{ region_id, title, content, category?, source?, timeAgo?, summary?, url?, imageUrl? }} payload
 * @returns {Promise<{ id: number }>}
 */
async function createNews(payload) {
  const { region_id, category, title, source, timeAgo, summary, url, imageUrl, content } = payload;

  if (!region_id || !title || !content) {
    throw Object.assign(new Error('region_id, title e content são obrigatórios.'), { statusCode: 400 });
  }

  const { data, error } = await adminClient
    .from('news')
    .insert([{
      region_id,
      category:  stripHtml(category),
      title:     stripHtml(title),
      source:    stripHtml(source),
      timeAgo:   stripHtml(timeAgo),
      summary:   stripHtml(summary),
      content:   stripHtml(content),
      url:       safeUrl(url),
      imageUrl:  safeUrl(imageUrl)
    }])
    .select('id')
    .maybeSingle();
  if (error) throw error;
  return { id: data?.id };
}

/**
 * Atualiza campos de uma notícia existente.
 * @param {number|string} id
 * @param {{ category?, title?, source?, summary?, content? }} fields
 * @returns {Promise<boolean>} true se encontrada e atualizada
 */
async function updateNews(id, fields) {
  const updateData = {};
  if (fields.category !== undefined) updateData.category = stripHtml(fields.category);
  if (fields.title !== undefined)    updateData.title    = stripHtml(fields.title);
  if (fields.source !== undefined)   updateData.source   = stripHtml(fields.source);
  if (fields.summary !== undefined)  updateData.summary  = stripHtml(fields.summary);
  if (fields.content !== undefined)  updateData.content  = stripHtml(fields.content);

  const { data, error } = await adminClient
    .from('news')
    .update(updateData)
    .eq('id', id)
    .select('id');
  if (error) throw error;
  return !!(data && data.length > 0);
}

/**
 * Remove uma notícia pelo id.
 * @param {number|string} id
 * @returns {Promise<boolean>} true se encontrada e deletada
 */
async function deleteNews(id) {
  const { data, error } = await adminClient
    .from('news')
    .delete()
    .eq('id', id)
    .select('id');
  if (error) throw error;
  return !!(data && data.length > 0);
}

/**
 * Dispara a sincronização com o G1 Maranhão via Puppeteer.
 * @returns {Promise<{ message, totalScraped, foundArticles, insertedArticles }>}
 */
async function syncG1News() {
  return runScraper();
}

module.exports = {
  listNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  syncG1News,
};
