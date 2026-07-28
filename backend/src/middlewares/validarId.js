const { idNumericoValido } = require('../utils/validacoes');

function validarId(req, res, next) {
  if (!idNumericoValido(req.params.id)) {
    return res.status(400).json({ erro: 'Identificador inválido.' });
  }
  return next();
}

module.exports = validarId;
