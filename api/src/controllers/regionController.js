const { publicClient: supabase } = require('../database/db');

exports.getAllRegions = async (req, res) => {
  try {
    const { data, error } = await supabase.from('regions').select('*').neq('id', 'all');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRegionData = async (req, res) => {
  const regionId = req.params.id;
  try {
    const { data, error } = await supabase.from('socio_data').select('*').eq('region_id', regionId).maybeSingle();
    if (error) throw error;
    
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Dados não encontrados.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRegionNews = async (req, res) => {
  const regionId = req.params.id;
  const { page, limit } = req.pagination;
  const from = (page - 1) * limit;
  const to   = from + limit - 1;

  try {
    let query = supabase
      .from('news')
      .select('*', { count: 'exact' })
      .order('id', { ascending: false })
      .range(from, to);

    if (regionId !== 'all') query = query.eq('region_id', regionId);

    const { data, count, error } = await query;
    if (error) throw error;

    res.json({ region_id: regionId, page, limit, total: count ?? 0, articles: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
