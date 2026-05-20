import express from 'express';
import { scrapeAndSyncG1 } from '../integrations/g1ScrapingIntegration.js';
import { scrapeAndSyncImirante } from '../integrations/imiranteScrapingIntegration.js';
import { scrapeAndSyncOImparcial } from '../integrations/oimparcialScrapingIntegration.js';

const router = express.Router();

// Health/status da rotina de cron
router.get('/status', (req, res) => {
  res.json({ status: 'ok', description: 'Rotinas de sincronização registradas.' });
});

// Dispara todos os scrapers manualmente
router.post('/run', async (req, res) => {
  try {
    const [g1, imirante, oimparcial] = await Promise.all([
      scrapeAndSyncG1(),
      scrapeAndSyncImirante(),
      scrapeAndSyncOImparcial()
    ]);
    res.json({ success: true, results: { g1, imirante, oimparcial } });
  } catch (err) {
    console.error('Erro ao disparar scrapers manualmente:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
