import supabase from '../database/db.js';

/**
 * Serviço de Regiões — camada de negócio entre controllers e banco de dados.
 */

/**
 * Retorna todas as regiões cadastradas (exceto a pseudo-região "all").
 * @returns {Promise<object[]>}
 */
export async function getAllRegions() {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .neq('id', 'all');
  if (error) throw error;
  return data;
}

/**
 * Retorna os dados socioeconômicos de uma região.
 * @param {string} regionId
 * @returns {Promise<object|null>}
 */
export async function getRegionData(regionId) {
  const { data, error } = await supabase
    .from('socio_data')
    .select('*')
    .eq('region_id', regionId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * Retorna as notícias de uma região com paginação.
 * @param {string} regionId
 * @param {{ page?: number, limit?: number }} opts
 * @returns {Promise<{ region_id: string, page: number, limit: number, total: number, articles: object[] }>}
 */
export async function getRegionNews(regionId, { page = 1, limit = 10 } = {}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('news')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (regionId !== 'all') {
    query = query.eq('region_id', regionId);
  }

  const { data, count, error } = await query;
  if (error) throw error;

  const enhancedArticles = (data || []).map(item => {
    const totalSources = 1 + (item.related_sources ? item.related_sources.length : 0);
    return {
      ...item,
      credibility_status: totalSources > 1 ? 'Confirmado (Múltiplas Fontes)' : 'Única Fonte',
      credibility_score: totalSources
    };
  });

  return { region_id: regionId, page, limit, total: count ?? 0, articles: enhancedArticles };
}
