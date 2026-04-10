const express = require('express');
const noticiasRoutes = require('./src/routes/noticias.routes');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API rodando');
});

app.use('/noticias', noticiasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
