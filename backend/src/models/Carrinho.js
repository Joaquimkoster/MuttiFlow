const { pool } = require("../config/database");

function normalizarQuantidade(quantidade) {
  return Number(quantidade);
}

async function criarOuBuscarCarrinho(sessaoId) {
  const carrinhoExistente = await pool.query(
    "SELECT * FROM carrinhos WHERE sessao_id = $1",
    [sessaoId]
  );

  if (carrinhoExistente.rows.length > 0) {
    return carrinhoExistente.rows[0];
  }

  const novoCarrinho = await pool.query(
    "INSERT INTO carrinhos (sessao_id) VALUES ($1) RETURNING *",
    [sessaoId]
  );

  return novoCarrinho.rows[0];
}

async function buscarCarrinho(sessaoId) {
  const carrinho = await criarOuBuscarCarrinho(sessaoId);

  const itens = await pool.query(
    `
    SELECT
      ci.id,
      ci.produto_id,
      p.nome AS name,
      COALESCE(p.imagens->>0, '') AS image,
      p.porcao AS serves,
      ci.quantidade,
      ci.preco_unitario AS price,
      (ci.quantidade * ci.preco_unitario) AS subtotal
    FROM carrinho_itens ci
    JOIN produtos p ON p.id = ci.produto_id
    WHERE ci.carrinho_id = $1
    ORDER BY ci.id
    `,
    [carrinho.id]
  );

  const subtotal = itens.rows.reduce(
    (total, item) => total + Number(item.subtotal),
    0
  );

  return {
    carrinho,
    itens: itens.rows,
    subtotal,
    desconto: 0,
    total: subtotal,
  };
}

async function adicionarItem(sessaoId, produtoId, quantidade) {
  const carrinho = await criarOuBuscarCarrinho(sessaoId);
  const quantidadeNormalizada = normalizarQuantidade(quantidade);

  const produto = await pool.query(
    "SELECT * FROM produtos WHERE id = $1 AND status = 'ativo'",
    [produtoId]
  );

  if (produto.rows.length === 0) {
    throw new Error("Produto não encontrado");
  }

  const preco = produto.rows[0].preco;

  const itemExistente = await pool.query(
    `
    SELECT * FROM carrinho_itens
    WHERE carrinho_id = $1 AND produto_id = $2
    `,
    [carrinho.id, produtoId]
  );

  if (itemExistente.rows.length > 0) {
    const novaQuantidade =
      itemExistente.rows[0].quantidade + quantidadeNormalizada;

    await pool.query(
      `
      UPDATE carrinho_itens
      SET quantidade = $1, atualizado_em = CURRENT_TIMESTAMP
      WHERE id = $2
      `,
      [novaQuantidade, itemExistente.rows[0].id]
    );
  } else {
    await pool.query(
      `
      INSERT INTO carrinho_itens
      (carrinho_id, produto_id, quantidade, preco_unitario)
      VALUES ($1, $2, $3, $4)
      `,
      [carrinho.id, produtoId, quantidadeNormalizada, preco]
    );
  }

  return buscarCarrinho(sessaoId);
}

async function atualizarQuantidade(sessaoId, itemId, quantidade) {
  const result = await pool.query(
    `
    UPDATE carrinho_itens ci
    SET quantidade = $1, atualizado_em = CURRENT_TIMESTAMP
    FROM carrinhos c
    WHERE ci.id = $2 AND ci.carrinho_id = c.id AND c.sessao_id = $3
    RETURNING ci.id
    `,
    [quantidade, itemId, sessaoId]
  );
  return result.rows[0];
}

async function removerItem(sessaoId, itemId) {
  const result = await pool.query(
    `DELETE FROM carrinho_itens ci
     USING carrinhos c
     WHERE ci.id = $1 AND ci.carrinho_id = c.id AND c.sessao_id = $2
     RETURNING ci.id`,
    [itemId, sessaoId]
  );
  return result.rows[0];
}

async function limparCarrinho(sessaoId) {
  const carrinho = await criarOuBuscarCarrinho(sessaoId);

  await pool.query(
    "DELETE FROM carrinho_itens WHERE carrinho_id = $1",
    [carrinho.id]
  );
}

module.exports = {
  criarOuBuscarCarrinho,
  buscarCarrinho,
  adicionarItem,
  atualizarQuantidade,
  removerItem,
  limparCarrinho,
};
