const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const { runScraper } = require('./src/services/scraperService');

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

app.listen(PORT, async () => {
  console.log(`Server API is running. API at http://localhost:${PORT}`);

  // Sincronização inicial ao subir o servidor
  console.log('[SCRAPER] Sincronização inicial iniciada em processo filho...');
  runScraper()
    .then(r => {
      if (r.skipped) console.log(`[SCRAPER] ${r.message}`);
      else console.log(`[SCRAPER] Inicial: ${r.insertedArticles} novas notícias inseridas.`);
    })
    .catch(e => console.error('[SCRAPER] Erro na sincronização inicial:', e.message));

  // Agendamento: todo início de hora (0 * * * *)
  cron.schedule('0 * * * *', () => {
    console.log(`[SCRAPER] ${new Date().toLocaleString('pt-BR')} - Iniciando sincronização em processo filho...`);
    runScraper()
      .then(r => {
        if (r.skipped) console.log(`[SCRAPER] ${r.message}`);
        else console.log(`[SCRAPER] ${r.insertedArticles} novas notícias inseridas.`);
      })
      .catch(err => console.error('[SCRAPER] Erro:', err.message));
  });
});
