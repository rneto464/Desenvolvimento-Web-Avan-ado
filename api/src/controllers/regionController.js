import * as regionService from '../services/regionService.js';

export async function getAllRegions(req, res) {
  try {
    const data = await regionService.getAllRegions();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getRegionData(req, res) {
  try {
    const data = await regionService.getRegionData(req.params.id);
    if (!data) return res.status(404).json({ error: 'Dados não encontrados.' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getRegionNews(req, res) {
  try {
    const result = await regionService.getRegionNews(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
