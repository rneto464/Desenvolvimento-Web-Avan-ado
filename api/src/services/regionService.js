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
 * Retorna as notícias de uma região ordenadas do mais recente.
 * @param {string} regionId
 * @returns {Promise<{ region_id: string, articles: object[] }>}
 */
export async function getRegionNews(regionId) {
  const { data, error } = await supabase
    .from('news')
    .select('*')
    .eq('region_id', regionId)
    .order('id', { ascending: false });
  if (error) throw error;
  return { region_id: regionId, articles: data || [] };
}
