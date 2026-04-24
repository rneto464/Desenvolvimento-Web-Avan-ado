const { fork } = require('child_process');
const path = require('path');

const WORKER_PATH = path.join(__dirname, '../workers/scraperWorker.js');
const TIMEOUT_MS = 5 * 60 * 1000; // mata o worker se travar por mais de 5 min

let running = false;

function runScraper() {
  if (running) {
    return Promise.resolve({
      message: 'Sincronização já em andamento. Tente novamente em alguns minutos.',
      skipped: true
    });
  }

  running = true;

  return new Promise((resolve, reject) => {
    const child = fork(WORKER_PATH);
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      running = false;
      child.kill('SIGTERM');
      reject(new Error('Scraping timeout após 5 minutos.'));
    }, TIMEOUT_MS);

    child.on('message', (msg) => {
      if (settled) return;
      settled = true;
      running = false;
      clearTimeout(timer);
      if (msg.success) resolve(msg.result);
      else reject(new Error(msg.error));
    });

    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      running = false;
      clearTimeout(timer);
      reject(err);
    });

    child.on('exit', (code) => {
      if (settled) return;
      settled = true;
      running = false;
      clearTimeout(timer);
      if (code !== 0) reject(new Error(`Worker encerrou inesperadamente (código ${code}).`));
    });
  });
}

module.exports = { runScraper };
