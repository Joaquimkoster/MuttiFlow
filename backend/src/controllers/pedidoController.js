const Pedido = require('../models/Pedido');
const { gerarPixCopiaECola } = require('../utils/pix');

const statusPermitidos = ['Agendado', 'Confirmado', 'Preparando', 'Pronto', 'Saiu para entrega', 'Entregue', 'Cancelado'];
const pagamentosPermitidos = ['Pix'];

function horarioEntregaValido(valor) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(valor || ''));
}

function dataEntregaValida(valor) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(valor || ''))) return false;
  const data = new Date(`${valor}T12:00:00`);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return !Number.isNaN(data.getTime()) && data >= hoje;
}

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
    'regiaoEntrega',
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

  if (!pagamentosPermitidos.includes(dados.pagamento)) {
    return res.status(400).json({ erro: 'Forma de pagamento inválida' });
  }

  if (!['paulinia', 'outras'].includes(dados.regiaoEntrega)) {
    return res.status(400).json({ erro: 'Região de entrega inválida' });
  }

  if (!dataEntregaValida(dados.dataEntrega)) {
    return res.status(400).json({ erro: 'Informe uma data de entrega válida' });
  }

  if (!horarioEntregaValido(dados.horario)) {
    return res.status(400).json({ erro: 'Informe um horário válido' });
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

async function buscarPix(req, res) {
  const sessaoId = req.headers['x-session-id'];
  if (!sessaoId) return res.status(400).json({ erro: 'Sessão não informada' });
  if (!/^\d+$/.test(String(req.params.id))) {
    return res.status(400).json({ erro: 'Pedido inválido' });
  }

  try {
    const pedido = await Pedido.buscarPix(req.params.id, sessaoId);
    if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });

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
    });
  } catch (error) {
    console.error('Erro ao gerar Pix:', error);
    return res.status(500).json({ erro: 'Não foi possível gerar o pagamento Pix.' });
  }
}

module.exports = { criar, listar, atualizarStatus, atualizarPagamento, buscarPix, excluir };
