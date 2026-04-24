/**
 * errorHandler.js — Middleware de Log de Erros e Tratamento Centralizado
 *
 * Cobre o item do checklist:
 *   ✅ Log de erros — stack trace, rota de origem, status HTTP
 *
 * Deve ser registrado APÓS todas as rotas no index.js:
 *   const errorHandler = require('./src/middlewares/errorHandler');
 *   app.use(errorHandler);
 *
 * Para disparar, qualquer controller/service deve chamar next(err) ou
 * lançar um Error com o campo statusCode opcionalmente definido.
 */

const logger = require('./logger');

// eslint-disable-next-line no-unused-vars
module.exports = function errorHandler(err, req, res, next) {
  const status  = err.statusCode || err.status || 500;
  const message = err.message    || 'Erro interno do servidor.';

  // Log completo com stack apenas em ambiente não-produção
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
};
