const VALID_IDS = new Set(['1', '2', '3', '4']);

export default function validateRegionId({ allowAll = false } = {}) {
  return (req, res, next) => {
    const { id } = req.params;
    const valid = VALID_IDS.has(id) || (allowAll && id === 'all');
    if (!valid) {
      return res.status(400).json({ error: `ID de região inválido: "${id}". Use 1, 2, 3 ou 4${allowAll ? ' (ou "all")' : ''}.` });
    }
    next();
  };
}
