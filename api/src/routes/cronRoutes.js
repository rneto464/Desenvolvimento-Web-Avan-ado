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
/**
 * @module cronRoutes
 * @description Endpoints acionados pelos Vercel Cron Jobs.
 * Requerem o header Authorization: Bearer <CRON_SECRET> para evitar execução não autorizada.
 *
 * Configuração do cron em /api/vercel.json:
 * {
 *   "crons": [{ "path": "/api/cron/sync-news", "schedule": "0 * * * *" }]
 * }
 */

import express from 'express';
import { scrapeAndSyncG1 } from '../integrations/g1ScrapingIntegration.js';
import logger from '../middlewares/logger.js';

const router = express.Router();

/**
 * POST /api/cron/sync-news
 * Acionado automaticamente pelo Vercel Cron Jobs a cada hora.
 * Protegido por CRON_SECRET para evitar execuções externas não autorizadas.
 */
router.post('/sync-news', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET || authHeader !== expectedToken) {
    logger.warn('CRON', 'Tentativa de acesso não autorizado ao endpoint de cron.');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  logger.info('CRON', 'Sincronização G1 iniciada via Vercel Cron Job...');

  try {
    const result = await scrapeAndSyncG1();
    logger.info('CRON', `Sincronização finalizada: ${result.insertedArticles} novas notícias inseridas.`);
    return res.json({ ok: true, ...result });
  } catch (err) {
    logger.error('CRON', `Erro na sincronização: ${err.message}`);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
