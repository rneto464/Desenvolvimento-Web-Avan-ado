const db = require('../database/db');

exports.getNewsById = (req, res) => {
  const newsId = req.params.id;
  db.get('SELECT * FROM news WHERE id = ?', [newsId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Notícia não encontrada.' });
    }
  });
};

exports.createNews = (req, res) => {
  const { region_id, category, title, source, timeAgo, summary, url, imageUrl, content } = req.body;
  
  if(!region_id || !title || !content) {
    return res.status(400).json({ error: 'region_id, title and content are required' });
  }

  const stmt = db.prepare('INSERT INTO news (region_id, category, title, source, timeAgo, summary, url, imageUrl, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  stmt.run([region_id, category, title, source, timeAgo, summary, url, imageUrl, content], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Notícia criada com sucesso', id: this.lastID });
  });
  stmt.finalize();
};

exports.updateNews = (req, res) => {
  const newsId = req.params.id;
  const { category, title, source, summary, content } = req.body;

  db.run(`UPDATE news SET 
            category = COALESCE(?, category), 
            title = COALESCE(?, title), 
            source = COALESCE(?, source), 
            summary = COALESCE(?, summary),
            content = COALESCE(?, content)
          WHERE id = ?`, 
    [category, title, source, summary, content, newsId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Notícia não encontrada' });
    res.json({ message: 'Notícia atualizada com sucesso' });
  });
};

exports.deleteNews = (req, res) => {
  const newsId = req.params.id;
  db.run('DELETE FROM news WHERE id = ?', [newsId], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Notícia não encontrada para deletar' });
    res.json({ message: 'Notícia deletada com sucesso' });
  });
};

const { fetchLatestNews } = require('../integrations/rssIntegration');

exports.getExternalNews = async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    const news = await fetchLatestNews(limit);
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
