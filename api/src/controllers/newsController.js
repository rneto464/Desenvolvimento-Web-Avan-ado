const newsService = require('../services/newsService');

exports.listNews = async (req, res) => {
  try {
    const page      = parseInt(req.query.page)  || 1;
    const limit     = parseInt(req.query.limit) || 12;
    const region_id = req.query.region_id || undefined;
    const category  = req.query.category  || undefined;

    const result = await newsService.listNews({ page, limit, region_id, category });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const data = await newsService.getNewsById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Notícia não encontrada.' });
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

exports.createNews = async (req, res) => {
  try {
    const result = await newsService.createNews(req.body);
    res.status(201).json({ message: 'Notícia criada com sucesso', ...result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const updated = await newsService.updateNews(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Notícia não encontrada.' });
    res.json({ message: 'Notícia atualizada com sucesso.' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const deleted = await newsService.deleteNews(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Notícia não encontrada para deletar.' });
    res.json({ message: 'Notícia deletada com sucesso.' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
};

exports.syncG1News = async (req, res) => {
  try {
    const result = await newsService.syncG1News();
    const status = result.skipped ? 202 : 200;
    res.status(status).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
