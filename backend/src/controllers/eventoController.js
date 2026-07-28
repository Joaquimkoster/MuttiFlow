const Evento = require('../models/Evento');
const { dataValida, horarioValido, nomeValido, telefoneValido, valorNaoNegativo } = require('../utils/validacoes');

const statusPermitidos = ['Aguardando', 'Aceito', 'Recusado', 'Preparando', 'Finalizado', 'Cancelado'];

async function listar(req, res) {
  try {
    return res.json(await Evento.listar());
  } catch (error) {
    console.error('Erro ao listar eventos:', error);
    return res.status(500).json({ erro: 'Erro ao listar eventos' });
  }
}

async function criar(req, res) {
  const dados = req.body;
  const obrigatorios = ['cliente', 'telefone', 'tipo', 'data', 'hora', 'endereco', 'convidados'];
  const ausentes = obrigatorios.filter((campo) => !String(dados[campo] || '').trim());

  if (ausentes.length) {
    return res.status(400).json({ erro: `Preencha os campos: ${ausentes.join(', ')}` });
  }
  if (!nomeValido(dados.cliente)) {
    return res.status(400).json({ erro: 'Informe um nome válido' });
  }
  if (!Number.isInteger(Number(dados.convidados)) || Number(dados.convidados) < 1) {
    return res.status(400).json({ erro: 'Informe uma quantidade válida de convidados' });
  }
  if (!telefoneValido(dados.telefone)) {
    return res.status(400).json({ erro: 'Informe um telefone válido com DDD' });
  }
  if (!dataValida(dados.data)) {
    return res.status(400).json({ erro: 'Informe uma data válida para o evento' });
  }
  if (!horarioValido(dados.hora)) {
    return res.status(400).json({ erro: 'Informe um horário válido para o evento' });
  }
  if (dados.valor !== '' && dados.valor != null && !valorNaoNegativo(dados.valor)) {
    return res.status(400).json({ erro: 'Informe um valor estimado válido' });
  }

  try {
    return res.status(201).json(await Evento.criar(dados));
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return res.status(500).json({ erro: 'Erro ao enviar solicitação de evento' });
  }
}

async function atualizarStatus(req, res) {
  const { status } = req.body;
  if (!statusPermitidos.includes(status)) {
    return res.status(400).json({ erro: 'Status inválido' });
  }

  try {
    const evento = await Evento.atualizarStatus(req.params.id, status);
    if (!evento) return res.status(404).json({ erro: 'Evento não encontrado' });
    return res.json(evento);
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar evento' });
  }
}

async function excluir(req, res) {
  try {
    const evento = await Evento.excluir(req.params.id);
    if (!evento) return res.status(404).json({ erro: 'Evento não encontrado' });
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    return res.status(500).json({ erro: 'Erro ao excluir evento' });
  }
}

module.exports = { listar, criar, atualizarStatus, excluir };
