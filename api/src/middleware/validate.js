const VALID_REGION_IDS      = new Set(['1', '2', '3', '4']);
const VALID_REGION_IDS_ALL  = new Set(['1', '2', '3', '4', 'all']);

function validateId(paramName = 'id') {
  return (req, res, next) => {
    const n = Number(req.params[paramName]);
    if (!Number.isInteger(n) || n < 1) {
      return res.status(400).json({ error: `Parâmetro '${paramName}' deve ser um inteiro positivo.` });
    }
    next();
  };
}

function validateRegionId({ allowAll = false } = {}) {
  return (req, res, next) => {
    const id = req.params.id;
    const valid = allowAll ? VALID_REGION_IDS_ALL : VALID_REGION_IDS;
    if (!valid.has(id)) {
      const allowed = allowAll ? "'1', '2', '3', '4' ou 'all'" : "'1', '2', '3' ou '4'";
      return res.status(400).json({ error: `Parâmetro 'id' inválido. Use ${allowed}.` });
    }
    next();
  };
}

function validatePagination(req, res, next) {
  const page  = parseInt(req.query.page  ?? '1',  10);
  const limit = parseInt(req.query.limit ?? '20', 10);

  if (!Number.isInteger(page)  || page  < 1)          return res.status(400).json({ error: "'page' deve ser um inteiro >= 1." });
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) return res.status(400).json({ error: "'limit' deve ser um inteiro entre 1 e 100." });

  req.pagination = { page, limit };
  next();
}

function validateCreateNews(req, res, next) {
  const errors = [];
  const { region_id, title, content, category, source, timeAgo, summary, url, imageUrl } = req.body;

  if (!region_id || !VALID_REGION_IDS.has(String(region_id)))
    errors.push("'region_id' é obrigatório e deve ser '1', '2', '3' ou '4'.");

  if (!title || typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 300)
    errors.push("'title' é obrigatório e deve ter entre 3 e 300 caracteres.");

  if (!content || typeof content !== 'string' || content.trim().length < 3 || content.trim().length > 5000)
    errors.push("'content' é obrigatório e deve ter entre 3 e 5000 caracteres.");

  if (category !== undefined && (typeof category !== 'string' || category.length > 100))
    errors.push("'category' deve ter no máximo 100 caracteres.");

  if (source !== undefined && (typeof source !== 'string' || source.length > 200))
    errors.push("'source' deve ter no máximo 200 caracteres.");

  if (timeAgo !== undefined && (typeof timeAgo !== 'string' || timeAgo.length > 50))
    errors.push("'timeAgo' deve ter no máximo 50 caracteres.");

  if (summary !== undefined && (typeof summary !== 'string' || summary.length > 1000))
    errors.push("'summary' deve ter no máximo 1000 caracteres.");

  if (url      != null && !isValidHttpUrl(url))      errors.push("'url' deve ser uma URL http/https válida.");
  if (imageUrl != null && !isValidHttpUrl(imageUrl)) errors.push("'imageUrl' deve ser uma URL http/https válida.");

  if (errors.length > 0) return res.status(400).json({ errors });
  next();
}

function validateUpdateNews(req, res, next) {
  const UPDATABLE = ['category', 'title', 'source', 'summary', 'content'];
  const errors = [];

  if (!UPDATABLE.some(f => req.body[f] !== undefined))
    return res.status(400).json({ error: `Informe ao menos um campo: ${UPDATABLE.join(', ')}.` });

  if (title   !== undefined && (typeof title   !== 'string' || title.trim().length   < 3 || title.trim().length   > 300))
    errors.push("'title' deve ter entre 3 e 300 caracteres.");

  if (content !== undefined && (typeof content !== 'string' || content.trim().length < 3 || content.trim().length > 5000))
    errors.push("'content' deve ter entre 3 e 5000 caracteres.");

  if (category !== undefined && (typeof category !== 'string' || category.length > 100))
    errors.push("'category' deve ter no máximo 100 caracteres.");

  if (source !== undefined && (typeof source !== 'string' || source.length > 200))
    errors.push("'source' deve ter no máximo 200 caracteres.");

  if (summary !== undefined && (typeof summary !== 'string' || summary.length > 1000))
    errors.push("'summary' deve ter no máximo 1000 caracteres.");

  if (errors.length > 0) return res.status(400).json({ errors });
  next();
}

function isValidHttpUrl(str) {
  try {
    const { protocol } = new URL(str);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

module.exports = { validateId, validateRegionId, validatePagination, validateCreateNews, validateUpdateNews };
