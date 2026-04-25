// Processo filho isolado — roda Puppeteer fora do processo da API
require('dotenv').config();

const { scrapeAndSyncG1 } = require('../integrations/g1ScrapingIntegration');

scrapeAndSyncG1()
  .then(result => {
    process.send({ success: true, result });
    process.exit(0);
  })
  .catch(err => {
    process.send({ success: false, error: err.message });
    process.exit(1);
  });
