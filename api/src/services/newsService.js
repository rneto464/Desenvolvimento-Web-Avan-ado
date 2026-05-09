import supabase from '../database/db.js';
import { scrapeAndSyncG1 } from '../integrations/g1ScrapingIntegration.js';
import { scrapeAndSyncImirante } from '../integrations/imiranteScrapingIntegration.js';
import { scrapeAndSyncOImparcial } from '../integrations/oimparcialScrapingIntegration.js';
import { calculateSimilarity } from '../utils/textSimilarity.js';

/**
 * Serviço de Notícias — camada de negócio entre controllers e banco de dados.
 * Controllers não devem acessar o Supabase diretamente.
 */

/**
 * Lista notícias com paginação e filtros opcionais.
 * @param {{ page?: number, limit?: number, region_id?: string, category?: string }} opts
 * @returns {Promise<{ data: object[], total: number, page: number, limit: number, totalPages: number }>}
 */
export async function listNews({ page = 1, limit = 12, region_id, category, date } = {}) {
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let query = supabase.from('news').select('*', { count: 'exact' });

  if (region_id) query = query.eq('region_id', region_id);
  if (category)  query = query.ilike('category', `%${category}%`);
  
  if (date) {
    let parsedDate = date;
    if (date.includes('/')) {
      const parts = date.split('/');
      if (parts.length === 3) parsedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    // Assume a coluna created_at existe no banco (adicionada por padrão no painel ou via alter table)
    query = query.gte('created_at', `${parsedDate}T00:00:00.000Z`).lte('created_at', `${parsedDate}T23:59:59.999Z`);
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;

  // Enhance payload for the frontend
  const enhancedData = (data || []).map(item => {
    const totalSources = 1 + (item.related_sources ? item.related_sources.length : 0);
    return {
      ...item,
      credibility_status: totalSources > 1 ? 'Confirmado (Múltiplas Fontes)' : 'Única Fonte',
      credibility_score: totalSources
    };
  });

  return {
    data: enhancedData,
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

  if (data) {
    const totalSources = 1 + (data.related_sources ? data.related_sources.length : 0);
    data.credibility_status = totalSources > 1 ? 'Confirmado (Múltiplas Fontes)' : 'Única Fonte';
    data.credibility_score = totalSources;
  }

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

  // 1. Deduplicação Matemática por Jaccard
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const { data: recentNews, error: fetchErr } = await supabase
    .from('news')
    .select('id, title, source, url, related_sources, related_urls')
    .eq('region_id', region_id)
    .gte('created_at', twoDaysAgo.toISOString());

  if (!fetchErr && recentNews && recentNews.length > 0) {
    for (const item of recentNews) {
      const sim = calculateSimilarity(title, item.title);
      // Se a similaridade for maior que 60%, agrupa
      if (sim > 0.60) {
        let updatedSources = item.related_sources || [];
        let updatedUrls = item.related_urls || [];
        let shouldUpdate = false;
        
        if (source && item.source !== source && !updatedSources.includes(source)) {
          updatedSources.push(source);
          shouldUpdate = true;
        }
        if (url && item.url !== url && !updatedUrls.includes(url)) {
          updatedUrls.push(url);
          shouldUpdate = true;
        }

        if (shouldUpdate) {
          await supabase
            .from('news')
            .update({ related_sources: updatedSources, related_urls: updatedUrls })
            .eq('id', item.id);
        }
        
        return { id: item.id, merged: true, similarity: sim };
      }
    }
  }

  // 2. Inserção normal se não for duplicado
  const { data, error } = await supabase
    .from('news')
    .insert([{
      region_id,
      category,
      title,
      source,
      timeAgo,
      summary,
      content,
      url,
      "imageUrl": imageUrl,
      related_sources: [],
      related_urls: []
    }])
    .select('id')
    .maybeSingle();
  if (error) throw error;
  return { id: data?.id, merged: false };
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

/**
 * Dispara a sincronização com o Imirante via Puppeteer.
 */
export async function syncImiranteNews() {
  return scrapeAndSyncImirante();
}

/**
 * Dispara a sincronização com O Imparcial via Puppeteer.
 */
export async function syncOImparcialNews() {
  return scrapeAndSyncOImparcial();
}
