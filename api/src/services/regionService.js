const { publicClient } = require('../database/db');

/**
 * Serviço de Regiões — camada de negócio entre controllers e banco de dados.
 */

/**
 * Retorna todas as regiões cadastradas (exceto a pseudo-região "all").
 * @returns {Promise<object[]>}
 */
async function getAllRegions() {
  const { data, error } = await publicClient
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
async function getRegionData(regionId) {
  const { data, error } = await publicClient
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
async function getRegionNews(regionId, { page = 1, limit = 12 } = {}) {
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  let query = publicClient
    .from('news')
    .select('*', { count: 'exact' })
    .order('id', { ascending: false })
    .range(from, to);

  if (regionId !== 'all') query = query.eq('region_id', regionId);

  const { data, count, error } = await query;
  if (error) throw error;

  return { region_id: regionId, page, limit, total: count ?? 0, articles: data || [] };
}

module.exports = {
  getAllRegions,
  getRegionData,
  getRegionNews,
};
