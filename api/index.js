const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server API is running. API at http://localhost:${PORT}`);
});
