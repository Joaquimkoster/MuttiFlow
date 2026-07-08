const Carrinho = require("../models/Carrinho");

function pegarSessaoId(req) {
  return req.headers["x-session-id"];
}

async function listarCarrinho(req, res) {
  try {
    const sessaoId = pegarSessaoId(req);

    if (!sessaoId) {
      return res.status(400).json({ erro: "Sessão não informada" });
    }

    const carrinho = await Carrinho.buscarCarrinho(sessaoId);

    res.json(carrinho);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar carrinho" });
  }
}

async function adicionarItem(req, res) {
  try {
    const sessaoId = pegarSessaoId(req);
    const { produto_id, quantidade } = req.body;

    if (!sessaoId) {
      return res.status(400).json({ erro: "Sessão não informada" });
    }

    if (!produto_id) {
      return res.status(400).json({ erro: "Produto é obrigatório" });
    }

    if (!quantidade || quantidade < 1) {
      return res.status(400).json({ erro: "Quantidade inválida" });
    }

    const carrinho = await Carrinho.adicionarItem(
      sessaoId,
      produto_id,
      quantidade
    );

    res.status(201).json(carrinho);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
}

async function atualizarQuantidade(req, res) {
  try {
    const sessaoId = pegarSessaoId(req);
    const { id } = req.params;
    const { quantidade } = req.body;

    if (!sessaoId) {
      return res.status(400).json({ erro: "Sessão não informada" });
    }

    if (!quantidade || quantidade < 1) {
      return res.status(400).json({ erro: "Quantidade inválida" });
    }

    await Carrinho.atualizarQuantidade(id, quantidade);

    const carrinho = await Carrinho.buscarCarrinho(sessaoId);

    res.json(carrinho);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar item" });
  }
}

async function removerItem(req, res) {
  try {
    const sessaoId = pegarSessaoId(req);
    const { id } = req.params;

    await Carrinho.removerItem(id);

    const carrinho = await Carrinho.buscarCarrinho(sessaoId);

    res.json(carrinho);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao remover item" });
  }
}

async function limparCarrinho(req, res) {
  try {
    const sessaoId = pegarSessaoId(req);

    await Carrinho.limparCarrinho(sessaoId);

    res.json({ mensagem: "Carrinho limpo com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao limpar carrinho" });
  }
}

module.exports = {
  listarCarrinho,
  adicionarItem,
  atualizarQuantidade,
  removerItem,
  limparCarrinho,
};