import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { scrapeAndSyncG1 } from './src/integrations/g1ScrapingIntegration.js';
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Headers de segurança — CSP aplicado apenas fora do /api-docs
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '0');
  if (!req.originalUrl.startsWith('/api-docs')) {
    res.setHeader('Content-Security-Policy', "default-src 'none'");
  }
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

// Health check — qualquer frontend pode usar para verificar se a API está online
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Uso das rotas sob o prefixo /api
app.use('/api/regions', regionRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/ibge', ibgeRoutes);
app.use('/api/cron', cronRoutes);

// Tratamento para rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

// ✅ Log de erros — deve ser o último middleware (4 argumentos obrigatórios)
app.use(errorHandler);

// Em ambiente serverless (Vercel) não iniciamos um servidor HTTP —
// a Vercel usa o export default como handler diretamente.
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, async () => {
    logger.info('SERVER', `API rodando em http://localhost:${PORT}`);
    logger.info('CRON', 'Sincronização inicial iniciada (modo dev)...');
    scrapeAndSyncG1()
      .then(r => logger.info('CRON', `Inicial: ${r.insertedArticles} novas notícias inseridas.`))
      .catch(e => logger.error('CRON', `Erro na sincronização inicial: ${e.message}`));
  });
}

// Export necessário para a Vercel usar o Express como serverless function handler
export default app;
