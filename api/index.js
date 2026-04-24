const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const { scrapeAndSyncG1 } = require('./src/integrations/g1ScrapingIntegration');

// Middlewares de logging
const requestLogger = require('./src/middlewares/requestLogger');
const errorHandler  = require('./src/middlewares/errorHandler');
const logger        = require('./src/middlewares/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS aberto para qualquer origem — qualquer frontend pode acoplar
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ✅ Log de requisições e respostas — deve vir antes das rotas
app.use(requestLogger);

// Importação das Rotas
const regionRoutes = require('./src/routes/regionRoutes');
const newsRoutes = require('./src/routes/newsRoutes');

// Importação do Swagger
const { swaggerUi, swaggerDocs } = require('./src/docs/swagger');

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check — qualquer frontend pode usar para verificar se a API está online
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Uso das rotas sob o prefixo /api
app.use('/api/regions', regionRoutes);
app.use('/api/news', newsRoutes);

// Tratamento para rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

// ✅ Log de erros — deve ser o último middleware (4 argumentos obrigatórios)
app.use(errorHandler);

app.listen(PORT, async () => {
  logger.info('SERVER', `API rodando em http://localhost:${PORT}`);

  // Sincronização inicial ao subir o servidor
  logger.info('CRON', 'Sincronização inicial iniciada...');
  scrapeAndSyncG1()
    .then(r => logger.info('CRON', `Inicial: ${r.insertedArticles} novas notícias inseridas.`))
    .catch(e => logger.error('CRON', `Erro na sincronização inicial: ${e.message}`));

  // Agendamento: todo início de hora (0 * * * *)
  cron.schedule('0 * * * *', async () => {
    logger.info('CRON', `${new Date().toLocaleString('pt-BR')} - Sincronizando notícias G1...`);
    try {
      const result = await scrapeAndSyncG1();
      logger.info('CRON', `${result.insertedArticles} novas notícias inseridas.`);
    } catch (err) {
      logger.error('CRON', `Erro: ${err.message}`);
    }
  });
});
