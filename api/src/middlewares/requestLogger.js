/**
 * requestLogger.js — Middleware de Log de Requisições e Respostas
 *
 * Cobre dois itens do checklist:
 *   ✅ Log de requisições  — método, rota, IP, body (se presente)
 *   ✅ Log de respostas    — status HTTP, tempo de resposta em ms
 */

import logger from './logger.js';

export default function requestLogger(req, res, next) {
  const startedAt = Date.now();
  const { method, originalUrl, ip } = req;

  // --- LOG DE REQUISIÇÃO ---
  const requestMeta = { ip: ip || req.socket?.remoteAddress };
  if (['POST', 'PUT', 'PATCH'].includes(method) && req.body && Object.keys(req.body).length) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = '***';
    if (safeBody.token)    safeBody.token    = '***';
    requestMeta.body = safeBody;
  }

  logger.info('REQUEST', `${method} ${originalUrl}`, requestMeta);

  // --- LOG DE RESPOSTA (intercepta res.json) ---
  const originalJson = res.json.bind(res);

  res.json = function (data) {
    const duration = Date.now() - startedAt;
    const status   = res.statusCode;
    const level    = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';

    logger[level]('RESPONSE', `${method} ${originalUrl} → ${status} (${duration}ms)`);

    return originalJson(data);
  };

  next();
}
