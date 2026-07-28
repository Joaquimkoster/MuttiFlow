const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function nomeValido(valor, minimo = 2, maximo = 150) {
  const nome = String(valor || '').trim();
  return nome.length >= minimo && nome.length <= maximo && /^[\p{L}\p{M} .'-]+$/u.test(nome);
}

function telefoneValido(valor) {
  const digitos = String(valor || '').replace(/\D/g, '');
  return digitos.length === 10 || digitos.length === 11;
}

function emailValido(valor) {
  const email = String(valor || '').trim();
  return email.length <= 255 && EMAIL_REGEX.test(email);
}

function cepValido(valor) {
  return /^\d{5}-?\d{3}$/.test(String(valor || '').trim());
}

function quantidadeValida(valor) {
  return Number.isInteger(Number(valor)) && Number(valor) > 0;
}

function dataValida(valor, permitirPassado = false) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(valor || ''))) return false;
  const data = new Date(`${valor}T12:00:00Z`);
  if (Number.isNaN(data.getTime())) return false;
  if (data.toISOString().slice(0, 10) !== valor) return false;
  if (permitirPassado) return true;
  const hoje = new Date();
  const hojeUtc = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  return data.getTime() >= hojeUtc;
}

function horarioValido(valor) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(valor || ''));
}

function valorNaoNegativo(valor) {
  return Number.isFinite(Number(valor)) && Number(valor) >= 0;
}

function idNumericoValido(valor) {
  return /^\d+$/.test(String(valor || '')) && Number(valor) > 0;
}

function senhaForte(valor) {
  const senha = String(valor || '');
  return senha.length >= 8 && /[a-z]/.test(senha) && /[A-Z]/.test(senha) && /\d/.test(senha);
}

module.exports = {
  cepValido,
  dataValida,
  emailValido,
  horarioValido,
  idNumericoValido,
  nomeValido,
  quantidadeValida,
  senhaForte,
  telefoneValido,
  valorNaoNegativo,
};
