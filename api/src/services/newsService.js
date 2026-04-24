import supabase from '../database/db.js';
import { scrapeAndSyncG1 } from '../integrations/g1ScrapingIntegration.js';

/**
 * Serviço de Notícias — camada de negócio entre controllers e banco de dados.
 * Controllers não devem acessar o Supabase diretamente.
 */

/**
 * Lista notícias com paginação e filtros opcionais.
 * @param {{ page?: number, limit?: number, region_id?: string, category?: string }} opts
 * @returns {Promise<{ data: object[], total: number, page: number, limit: number, totalPages: number }>}
 */
export async function listNews({ page = 1, limit = 12, region_id, category } = {}) {
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let query = supabase.from('news').select('*', { count: 'exact' });

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
export async function getNewsById(id) {
  const { data, error } = await supabase
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
export async function createNews(payload) {
  const { region_id, category, title, source, timeAgo, summary, url, imageUrl, content } = payload;

  if (!region_id || !title || !content) {
    throw Object.assign(new Error('region_id, title e content são obrigatórios.'), { statusCode: 400 });
  }

  const { data, error } = await supabase
    .from('news')
    .insert([{ region_id, category, title, source, timeAgo, summary, url, imageUrl, content }])
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
export async function updateNews(id, fields) {
  const updateData = {};
  if (fields.category !== undefined) updateData.category = fields.category;
  if (fields.title    !== undefined) updateData.title    = fields.title;
  if (fields.source   !== undefined) updateData.source   = fields.source;
  if (fields.summary  !== undefined) updateData.summary  = fields.summary;
  if (fields.content  !== undefined) updateData.content  = fields.content;

  const { data, error } = await supabase
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
export async function deleteNews(id) {
  const { data, error } = await supabase
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
export async function syncG1News() {
  return scrapeAndSyncG1();
}
