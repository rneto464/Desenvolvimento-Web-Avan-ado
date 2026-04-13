const express = require('express');
const cors = require('cors');

// Importar e inicializar banco de dados
const { serializeDb } = require('./src/database/setup');
serializeDb(); // Roda a criação das tabelas e semeadura inicial apenas se vazio

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Importação das Rotas
const regionRoutes = require('./src/routes/regionRoutes');
const newsRoutes = require('./src/routes/newsRoutes');

// Uso das rotas sob o prefixo /api
app.use('/api/regions', regionRoutes);
app.use('/api/news', newsRoutes);

// Tratamento para rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

app.listen(PORT, () => {
  console.log(`Server API is running. API at http://localhost:${PORT}`);
});
