import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import 'dotenv/config';

import { scrapeAndSyncG1 } from './src/integrations/g1ScrapingIntegration.js';
import { scrapeAndSyncImirante } from './src/integrations/imiranteScrapingIntegration.js';
import { scrapeAndSyncOImparcial } from './src/integrations/oimparcialScrapingIntegration.js';
import requestLogger from './src/middlewares/requestLogger.js';
import errorHandler from './src/middlewares/errorHandler.js';
import logger from './src/middlewares/logger.js';
import regionRoutes from './src/routes/regionRoutes.js';
import newsRoutes from './src/routes/newsRoutes.js';
import ibgeRoutes from './src/routes/ibgeRoutes.js';
import cronRoutes from './src/routes/cronRoutes.js';
import { swaggerUi, swaggerDocs } from './src/docs/swagger.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Headers de segurança básicos
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0'); // desativa filtro legado; CSP é suficiente
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  next();
});

// CORS aberto para qualquer origem — qualquer frontend pode acoplar
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ Log de requisições e respostas — deve vir antes das rotas
app.use(requestLogger);

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check — qualquer frontend pode usar para verificar se a API está online
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Uso das rotas sob o prefixo /api
app.use('/api/regions', regionRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/ibge', ibgeRoutes);
app.use('/api/cron', cronRoutes);

// Endpoint manual para disparar o robô de Scraping do G1
app.post('/api/news/external/g1/sync', async (req, res) => {
  try {
    const resultG1 = await scrapeAndSyncG1();
    res.json({ success: true, resultG1 });
  } catch (error) {
    console.error('Erro na sincronização manual do G1:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint manual para disparar o robô de Scraping do Imirante
app.post('/api/news/external/imirante/sync', async (req, res) => {
  try {
    const resultImirante = await scrapeAndSyncImirante();
    res.json({ success: true, resultImirante });
  } catch (error) {
    console.error('Erro na sincronização manual do Imirante:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint manual para disparar o robô de Scraping do O Imparcial
app.post('/api/news/external/oimparcial/sync', async (req, res) => {
  try {
    const resultOImparcial = await scrapeAndSyncOImparcial();
    res.json({ success: true, resultOImparcial });
  } catch (error) {
    console.error('Erro na sincronização manual do O Imparcial:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint manual para disparar TODOS os robôs
app.post('/api/news/external/sync-all', async (req, res) => {
  try {
    console.log('Iniciando sincronização de múltiplos sites...');
    // Roda em paralelo para maior rapidez
    const [resultG1, resultImirante] = await Promise.all([
      scrapeAndSyncG1(),
      scrapeAndSyncImirante()
    ]);
    res.json({ success: true, results: { G1: resultG1, Imirante: resultImirante } });
  } catch (error) {
    console.error('Erro na sincronização de todos os robôs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Tratamento para rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

// ✅ Log de erros — deve ser o último middleware (4 argumentos obrigatórios)
app.use(errorHandler);

function startServer() {
  app.listen(PORT, async () => {
    logger.info('SERVER', `API rodando em http://localhost:${PORT}`);

    // Sincronização inicial ao subir o servidor
    logger.info('CRON', 'Sincronização inicial iniciada...');
    Promise.all([scrapeAndSyncG1(), scrapeAndSyncImirante(), scrapeAndSyncOImparcial()])
      .then(() => logger.info('CRON', `Inicial: Sincronização concluída.`))
      .catch(e => logger.error('CRON', `Erro na sincronização inicial: ${e.message}`));

    // Agendamento: todo início de hora (0 * * * *)
    cron.schedule('0 * * * *', async () => {
      logger.info('CRON', `${new Date().toLocaleString('pt-BR')} - Sincronizando notícias G1, Imirante e O Imparcial...`);
      try {
        await Promise.all([scrapeAndSyncG1(), scrapeAndSyncImirante(), scrapeAndSyncOImparcial()]);
        logger.info('CRON', `Sincronização agendada concluída com sucesso.`);
      } catch (err) {
        logger.error('CRON', `Erro: ${err.message}`);
      }
    });
  });
}

// Apenas iniciar servidor quando não estivermos em ambiente serverless (ex: Vercel)
if (!process.env.VERCEL && process.env.DISABLE_SERVERLISTEN !== 'true') {
  startServer();
} else {
  logger.info('SERVER', 'Modo serverless detectado ou `DISABLE_SERVERLISTEN=true` — não iniciando `app.listen`.');
}

// Export necessário para a Vercel usar o Express como serverless function handler
export default app;
