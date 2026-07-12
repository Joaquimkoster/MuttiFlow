const Pedido = require('../models/Pedido');

const statusPermitidos = ['Agendado', 'Confirmado', 'Preparando', 'Pronto', 'Saiu para entrega', 'Entregue', 'Cancelado'];

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
  const dados = req.body;

  const obrigatorios = [
    'nome',
    'whatsapp',
    'pagamento',
    'endereco',
    'dataEntrega',
    'horario',
  ];

  if (!sessaoId) {
    return res.status(400).json({
      erro: 'Sessão não informada',
    });
  }

  const ausentes = obrigatorios.filter(
    (campo) => !String(dados[campo] || '').trim()
  );

  if (ausentes.length > 0) {
    return res.status(400).json({
      erro: `Preencha os campos: ${ausentes.join(', ')}`,
    });
  }

  try {
    const pedido = await Pedido.criar(sessaoId, dados);
    return res.status(201).json(pedido);
  } catch (error) {
    return res.status(400).json({
      erro: error.message,
    });
  }
}

async function atualizarStatus(req, res) {
  const { status } = req.body;
  if (!statusPermitidos.includes(status)) {
    return res.status(400).json({ erro: 'Status inválido' });
  }

  try {
    const pedido = await Pedido.atualizarStatus(req.params.id, status);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
    return res.json(pedido);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar pedido' });
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

module.exports = { criar, listar, atualizarStatus, atualizarPagamento, excluir };
