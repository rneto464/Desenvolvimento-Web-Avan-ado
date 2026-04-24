/**
 * logger.js — Utilitário central de logging
 *
 * Formato de saída:
 *   [2026-04-24T15:00:00.000Z] [NÍVEL] [CONTEXTO] mensagem  { ...meta }
 *
 * Níveis disponíveis: info | warn | error
 */

const LEVELS = {
  info:  '\x1b[36mINFO \x1b[0m',  // Ciano
  warn:  '\x1b[33mWARN \x1b[0m',  // Amarelo
  error: '\x1b[31mERROR\x1b[0m',  // Vermelho
};

/**
 * Formata e imprime uma linha de log.
 * @param {'info'|'warn'|'error'} level
 * @param {string} context  Prefixo do contexto (ex: 'REQUEST', 'RESPONSE', 'ERROR')
 * @param {string} message
 * @param {object} [meta]   Dados extras opcionais
 */
function log(level, context, message, meta) {
  const timestamp = new Date().toISOString();
  const prefix    = `[${timestamp}] ${LEVELS[level] || level} [${context}]`;
  const line      = `${prefix} ${message}`;

  if (level === 'error') {
    meta ? console.error(line, meta) : console.error(line);
  } else {
    meta ? console.log(line, meta) : console.log(line);
  }
}

module.exports = {
  info:  (ctx, msg, meta) => log('info',  ctx, msg, meta),
  warn:  (ctx, msg, meta) => log('warn',  ctx, msg, meta),
  error: (ctx, msg, meta) => log('error', ctx, msg, meta),
};
