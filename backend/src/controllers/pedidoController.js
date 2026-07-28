const Pedido = require('../models/Pedido');
const { gerarPixCopiaECola } = require('../utils/pix');
const { dataValida, horarioValido, nomeValido, telefoneValido } = require('../utils/validacoes');

const statusPermitidos = ['Agendado', 'Confirmado', 'Preparando', 'Pronto', 'Saiu para entrega', 'Entregue', 'Cancelado'];
const pagamentosPermitidos = ['Pix', 'Cartão na entrega/retirada'];

async function listar(req, res) {
  try {
    const pedidos = await Pedido.listar();
    return res.json(pedidos);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    return res.status(500).json({
      erro: 'Erro ao listar pedidos',
    });
  }
}

async function criar(req, res) {
  const sessaoId = req.headers['x-session-id'];
  const idempotencyKey = String(req.headers['idempotency-key'] || '').trim();
  const dados = req.body;

  const obrigatorios = [
    'nome',
    'whatsapp',
    'pagamento',
    'regiaoEntrega',
    'dataEntrega',
    'horario',
  ];

  if (dados.regiaoEntrega !== 'retirada') obrigatorios.push('endereco', 'cidade', 'bairro');

  if (!sessaoId) {
    return res.status(400).json({
      erro: 'Sessão não informada',
    });
  }
  if (!/^[A-Za-z0-9_-]{16,100}$/.test(idempotencyKey)) {
    return res.status(400).json({ erro: 'Chave de idempotência inválida.' });
  }

  const ausentes = obrigatorios.filter(
    (campo) => !String(dados[campo] || '').trim()
  );

  if (ausentes.length > 0) {
    return res.status(400).json({
      erro: `Preencha os campos: ${ausentes.join(', ')}`,
    });
  }
  if (!nomeValido(dados.nome) || !telefoneValido(dados.whatsapp)) {
    return res.status(400).json({ erro: 'Informe nome e WhatsApp válidos.' });
  }

  if (!pagamentosPermitidos.includes(dados.pagamento)) {
    return res.status(400).json({ erro: 'Forma de pagamento inválida' });
  }

  if (!['retirada', 'paulinia', 'outras'].includes(dados.regiaoEntrega)) {
    return res.status(400).json({ erro: 'Região de entrega inválida' });
  }

  if (!dataValida(dados.dataEntrega)) {
    return res.status(400).json({ erro: 'Informe uma data de entrega válida' });
  }
  if (!horarioValido(dados.horario)) {
    return res.status(400).json({ erro: 'Informe um horário válido' });
  }
  const entregaEm = new Date(`${dados.dataEntrega}T${dados.horario}:00`);
  if (entregaEm.getTime() - Date.now() < 24 * 60 * 60 * 1000) {
    return res.status(400).json({ erro: 'Faça o pedido com pelo menos 24 horas de antecedência.' });
  }

  try {
    const pedido = await Pedido.criar(sessaoId, dados, idempotencyKey);
    return res.status(pedido.reutilizado ? 200 : 201).json(pedido);
  } catch (error) {
    return res.status(400).json({
      erro: error.message,
    });
  }
}

async function buscarPublico(req, res) {
  const codigo = String(req.params.codigo || '').trim().toUpperCase();
  if (!/^MUT-\d{4}-\d{5,}$/.test(codigo)) {
    return res.status(400).json({ erro: 'Código de acompanhamento inválido.' });
  }
  try {
    const pedido = await Pedido.buscarPublico(codigo);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado.' });
    const tipos = {
      retirada: 'Retirada no local',
      paulinia: 'Entrega em Paulínia',
      outras: 'Entrega em outra região',
    };
    return res.json({ ...pedido, tipo_entrega: tipos[pedido.tipo_entrega] || 'Entrega' });
  } catch (error) {
    console.error('Erro ao acompanhar pedido:', error);
    return res.status(500).json({ erro: 'Não foi possível acompanhar o pedido.' });
  }
}

async function atualizarStatus(req, res) {
  const { status } = req.body;
  if (!statusPermitidos.includes(status)) {
    return res.status(400).json({ erro: 'Status inválido' });
  }

  try {
    const pedido = await Pedido.atualizarStatus(req.params.id, status, req.usuario.id);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    return res.json(pedido);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar pedido' });
  }
}

async function listarHistorico(req, res) {
  try {
    const historico = await Pedido.listarHistorico(req.params.id);
    return res.json(historico);
  } catch (error) {
    console.error('Erro ao listar histórico do pedido:', error);
    return res.status(500).json({ erro: 'Erro ao listar histórico do pedido' });
  }
}

async function excluir(req, res) {
  try {
    const pedido = await Pedido.excluir(req.params.id);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir pedido:', error);
    return res.status(500).json({ erro: 'Erro ao excluir pedido' });
  }
}

async function atualizarPagamento(req, res) {
  const { pagamento_status: pagamentoStatus } = req.body;
  if (!['Pendente', 'Pago'].includes(pagamentoStatus)) {
    return res.status(400).json({ erro: 'Status de pagamento inválido' });
  }

  try {
    const pedido = await Pedido.atualizarPagamento(req.params.id, pagamentoStatus);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    return res.json(pedido);
  } catch (error) {
    console.error('Erro ao atualizar pagamento:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar pagamento' });
  }
}

async function buscarPix(req, res) {
  const sessaoId = req.headers['x-session-id'];
  if (!sessaoId) return res.status(400).json({ erro: 'Sessão não informada' });
  if (!/^\d+$/.test(String(req.params.id))) {
    return res.status(400).json({ erro: 'Pedido inválido' });
  }

  try {
    const pedido = await Pedido.buscarPix(req.params.id, sessaoId);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    if (pedido.forma_pagamento !== 'Pix') {
      return res.status(400).json({ erro: 'Este pedido não utiliza pagamento Pix.' });
    }

    const chave = String(process.env.PIX_KEY || '').trim();
    if (!chave) {
      return res.status(503).json({ erro: 'O Pix ainda não foi configurado pela loja.' });
    }

    const beneficiario = process.env.PIX_RECEIVER_NAME || 'MuttiFlow';
    const cidade = process.env.PIX_RECEIVER_CITY || 'Sao Paulo';
    const codigo = gerarPixCopiaECola({
      chave,
      valor: pedido.total,
      pedidoId: pedido.id,
      beneficiario,
      cidade,
    });

    return res.json({
      pedidoId: pedido.id,
      valor: Number(pedido.total),
      chave,
      codigo,
      beneficiario,
      status: pedido.pagamento_status,
      codigoPublico: pedido.codigo_publico,
    });
  } catch (error) {
    console.error('Erro ao gerar Pix:', error);
    return res.status(500).json({ erro: 'Não foi possível gerar o pagamento Pix.' });
  }
}

module.exports = { criar, listar, atualizarStatus, atualizarPagamento, buscarPix, buscarPublico, excluir, listarHistorico };
