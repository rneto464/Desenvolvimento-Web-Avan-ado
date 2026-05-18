import crypto from 'crypto';

export default function requireAuth(req, res, next) {
  const apiKey = process.env.API_SECRET_KEY;
  if (!apiKey) {
    console.error('[AUTH] API_SECRET_KEY não definida no ambiente.');
    return res.status(500).json({ error: 'Servidor mal configurado.' });
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Autenticação necessária. Envie: Authorization: Bearer <chave>' });
  }

  const provided = authHeader.slice(7);

  // timingSafeEqual previne timing attacks
  try {
    const a = Buffer.from(provided);
    const b = Buffer.from(apiKey);
    const match = a.length === b.length && crypto.timingSafeEqual(a, b);
    if (!match) throw new Error();
  } catch {
    return res.status(403).json({ error: 'Chave de API inválida.' });
  }

  next();
}
