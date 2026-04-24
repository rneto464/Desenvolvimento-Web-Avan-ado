const supabase = require('../database/db');

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
  try {
    const { data, error } = await supabase.from('news').select('*').eq('region_id', regionId).order('id', { ascending: false });
    if (error) throw error;
    
    res.json({ region_id: regionId, articles: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
