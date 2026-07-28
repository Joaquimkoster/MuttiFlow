function permitirFuncoes(...funcoes) {
  return (req, res, next) => {
    if (!req.usuario || !funcoes.includes(req.usuario.funcao)) {
      return res.status(403).json({ erro: 'Você não tem permissão para esta ação.' });
    }
    return next();
  };
}

module.exports = { permitirFuncoes };
