const db = require('../database/db');

exports.getAllRegions = (req, res) => {
  db.all('SELECT * FROM regions WHERE id != "all"', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getRegionData = (req, res) => {
  const regionId = req.params.id;
  db.get('SELECT * FROM socio_data WHERE region_id = ?', [regionId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      res.json(row);
    } else {
      res.status(404).json({ error: 'Dados não encontrados.' });
    }
  });
};

exports.getRegionNews = (req, res) => {
  const regionId = req.params.id;
  db.all('SELECT * FROM news WHERE region_id = ? ORDER BY id DESC', [regionId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows && rows.length > 0) {
      res.json({ region_id: regionId, articles: rows });
    } else {
      res.status(404).json({ error: 'Notícias não encontradas.' });
    }
  });
};
