const regionService = require('../services/regionService');

exports.getAllRegions = async (req, res) => {
  try {
    const data = await regionService.getAllRegions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRegionData = async (req, res) => {
  try {
    const data = await regionService.getRegionData(req.params.id);
    if (!data) return res.status(404).json({ error: 'Dados não encontrados.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRegionNews = async (req, res) => {
  try {
    const result = await regionService.getRegionNews(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
