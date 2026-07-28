function obterJwtSecret() {
  const segredo = String(process.env.JWT_SECRET || '');
  if (!segredo) throw new Error('JWT_SECRET não configurado.');
  if (process.env.NODE_ENV === 'production' && segredo.length < 32) {
    throw new Error('JWT_SECRET deve possuir pelo menos 32 caracteres em produção.');
  }
  return segredo;
}

module.exports = { obterJwtSecret };
