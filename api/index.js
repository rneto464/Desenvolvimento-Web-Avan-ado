const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();
const path = require('path');

const { scrapeAndSyncG1 } = require('./src/integrations/g1ScrapingIntegration');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Servir frontend estático
app.use(express.static(path.join(__dirname, 'public')));

// Importação das Rotas
const regionRoutes = require('./src/routes/regionRoutes');
const newsRoutes = require('./src/routes/newsRoutes');

// Importação do Swagger
const { swaggerUi, swaggerDocs } = require('./src/docs/swagger');

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Uso das rotas sob o prefixo /api
app.use('/api/regions', regionRoutes);
app.use('/api/news', newsRoutes);

// Tratamento para rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

app.listen(PORT, async () => {
  console.log(`Server API is running. API at http://localhost:${PORT}`);

  // Sincronização inicial ao subir o servidor
  console.log('[CRON] Sincronização inicial iniciada...');
  scrapeAndSyncG1()
    .then(r => console.log(`[CRON] Inicial: ${r.insertedArticles} novas notícias inseridas.`))
    .catch(e => console.error('[CRON] Erro na sincronização inicial:', e.message));

  // Agendamento: todo início de hora (0 * * * *)
  cron.schedule('0 * * * *', async () => {
    console.log(`[CRON] ${new Date().toLocaleString('pt-BR')} - Sincronizando notícias G1...`);
    try {
      const result = await scrapeAndSyncG1();
      console.log(`[CRON] ${result.insertedArticles} novas notícias inseridas.`);
    } catch (err) {
      console.error('[CRON] Erro:', err.message);
    }
  });
});
