const supabase = require('../database/db');
const { scrapeAndSyncG1 } = require('../integrations/g1ScrapingIntegration');

exports.getNewsById = async (req, res) => {
  const newsId = req.params.id;
  try {
    const { data, error } = await supabase.from('news').select('*').eq('id', newsId).maybeSingle();
    if (error) throw error;
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: 'Notícia não encontrada.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createNews = async (req, res) => {
  const { region_id, category, title, source, timeAgo, summary, url, imageUrl, content } = req.body;
  if (!region_id || !title || !content) {
    return res.status(400).json({ error: 'region_id, title e content são obrigatórios.' });
  }
  try {
    const { data, error } = await supabase.from('news').insert([
      { region_id, category, title, source, timeAgo, summary, url, imageUrl, content }
    ]).select('id').maybeSingle();
    if (error) throw error;
    res.status(201).json({ message: 'Notícia criada com sucesso', id: data?.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNews = async (req, res) => {
  const newsId = req.params.id;
  const { category, title, source, summary, content } = req.body;
  try {
    const updateData = {};
    if (category !== undefined) updateData.category = category;
    if (title !== undefined) updateData.title = title;
    if (source !== undefined) updateData.source = source;
    if (summary !== undefined) updateData.summary = summary;
    if (content !== undefined) updateData.content = content;

    const { data, error } = await supabase.from('news').update(updateData).eq('id', newsId).select('id');
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Notícia não encontrada.' });
    res.json({ message: 'Notícia atualizada com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNews = async (req, res) => {
  const newsId = req.params.id;
  try {
    const { data, error } = await supabase.from('news').delete().eq('id', newsId).select('id');
    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Notícia não encontrada para deletar.' });
    res.json({ message: 'Notícia deletada com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.syncG1News = async (req, res) => {
  try {
    const result = await scrapeAndSyncG1();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
