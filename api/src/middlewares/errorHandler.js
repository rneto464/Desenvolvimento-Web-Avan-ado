/**
 * errorHandler.js — Middleware de Log de Erros e Tratamento Centralizado
 *
 * ✅ Log de erros — stack trace, rota de origem, status HTTP
 *
 * Deve ser registrado APÓS todas as rotas no index.js.
 */

import logger from './logger.js';

// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  const status  = err.statusCode || err.status || 500;
  const message = err.message    || 'Erro interno do servidor.';

  const meta = {
    method: req.method,
    path:   req.originalUrl,
    status,
    ...(process.env.NODE_ENV !== 'production' && err.stack
      ? { stack: err.stack }
      : {}),
  };

  logger.error('ERROR', message, meta);

  res.status(status).json({
    error:  message,
    status,
    path:   req.originalUrl,
    ...(process.env.NODE_ENV !== 'production' && err.stack
      ? { stack: err.stack.split('\n').slice(0, 5) }
      : {}),
  });
}
