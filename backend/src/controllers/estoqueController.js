const Estoque = require('../models/Estoque');

function validar(dados) {
  const obrigatorios = ['nome', 'categoria', 'unidade'];
  const ausentes = obrigatorios.filter((campo) => !String(dados[campo] || '').trim());
  if (ausentes.length) return `Preencha os campos: ${ausentes.join(', ')}`;

  const quantidade = Number(dados.quantidade);
  const minimo = Number(dados.minimo);
  if (!Number.isFinite(quantidade) || quantidade < 0) return 'Quantidade inválida';
  if (!Number.isFinite(minimo) || minimo < 0) return 'Estoque mínimo inválido';
  return null;
}

async function listar(req, res) {
  try {
    return res.json(await Estoque.listar());
  } catch (error) {
    console.error('Erro ao listar estoque:', error);
    return res.status(500).json({ erro: 'Erro ao listar estoque' });
  }
}

async function criar(req, res) {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  try {
    return res.status(201).json(await Estoque.criar(req.body));
  } catch (error) {
    console.error('Erro ao cadastrar item:', error);
    return res.status(500).json({ erro: 'Erro ao cadastrar item' });
  }
}

async function atualizar(req, res) {
  const erro = validar(req.body);
  if (erro) return res.status(400).json({ erro });

  try {
    const item = await Estoque.atualizar(req.params.id, req.body);
    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
    return res.json(item);
  } catch (error) {
    console.error('Erro ao atualizar item:', error);
    return res.status(500).json({ erro: 'Erro ao atualizar item' });
  }
}

async function excluir(req, res) {
  try {
    const item = await Estoque.excluir(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir item:', error);
    return res.status(500).json({ erro: 'Erro ao excluir item' });
  }
}

module.exports = { listar, criar, atualizar, excluir };
