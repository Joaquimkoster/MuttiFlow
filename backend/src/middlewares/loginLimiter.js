const tentativas = new Map();
const JANELA_MS = 15 * 60 * 1000;
const LIMITE = 5;

function chave(req) {
  const identificador = String(req.body?.nome || req.body?.email || '').trim().toLowerCase();
  return `${req.ip}:${identificador}`;
}

function verificarTentativas(req, res, next) {
  const agora = Date.now();
  const registro = tentativas.get(chave(req));
  if (registro && registro.bloqueadoAte > agora) {
    res.set('Retry-After', String(Math.ceil((registro.bloqueadoAte - agora) / 1000)));
    return res.status(429).json({ erro: 'Muitas tentativas. Aguarde 15 minutos e tente novamente.' });
  }
  if (registro && agora - registro.inicio >= JANELA_MS) tentativas.delete(chave(req));
  return next();
}

function registrarFalha(req) {
  const key = chave(req);
  const agora = Date.now();
  const atual = tentativas.get(key);
  const registro = !atual || agora - atual.inicio >= JANELA_MS
    ? { quantidade: 0, inicio: agora, bloqueadoAte: 0 }
    : atual;
  registro.quantidade += 1;
  if (registro.quantidade >= LIMITE) registro.bloqueadoAte = agora + JANELA_MS;
  tentativas.set(key, registro);
}

function limparTentativas(req) {
  tentativas.delete(chave(req));
}

module.exports = { limparTentativas, registrarFalha, verificarTentativas };
