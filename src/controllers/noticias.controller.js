const buscar = (req, res) => {
  const { cidade } = req.query;

  if (!cidade) {
    return res.status(400).json({ erro: 'Parâmetro "cidade" é obrigatório' });
  }

  return res.status(200).json({ cidade });
};

module.exports = { buscar };
