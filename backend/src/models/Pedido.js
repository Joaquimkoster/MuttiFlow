const { pool } = require('../config/database');

async function criar(sessaoId, dados) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const carrinho = await client.query(
      'SELECT id FROM carrinhos WHERE sessao_id = $1 FOR UPDATE',
      [sessaoId]
    );

    if (carrinho.rows.length === 0) {
      throw new Error('Carrinho não encontrado');
    }

    const itens = await client.query(
      `SELECT ci.produto_id, ci.quantidade, ci.preco_unitario, p.nome
       FROM carrinho_itens ci
       JOIN produtos p ON p.id = ci.produto_id
       WHERE ci.carrinho_id = $1`,
      [carrinho.rows[0].id]
    );

    if (itens.rows.length === 0) {
      throw new Error('O carrinho está vazio');
    }

    const subtotal = itens.rows.reduce(
      (total, item) => total + Number(item.preco_unitario) * item.quantidade,
      0
    );
    const frete = 7;
    const desconto = dados.cupom === 'MUTTI15' ? 10 : 0;
    const total = subtotal + frete - desconto;

    const pedido = await client.query(
      `INSERT INTO pedidos (
        sessao_id, cliente_nome, whatsapp, email, forma_pagamento, endereco,
        complemento, cidade, bairro, data_entrega, horario, observacoes, subtotal,
        frete, desconto, total
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING *`,
      [
        sessaoId, dados.nome, dados.whatsapp, dados.email || null,
        dados.pagamento, dados.endereco, dados.complemento || null,
        dados.cidade || null, dados.bairro || null, dados.dataEntrega,
        dados.horario, dados.observacoes || null,
        subtotal, frete, desconto, total,
      ]
    );

    for (const item of itens.rows) {
      await client.query(
        `INSERT INTO pedido_itens
          (pedido_id, produto_id, produto_nome, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4, $5)`,
        [pedido.rows[0].id, item.produto_id, item.nome, item.quantidade, item.preco_unitario]
      );
    }

    await client.query('DELETE FROM carrinho_itens WHERE carrinho_id = $1', [carrinho.rows[0].id]);
    await client.query('COMMIT');
    return { ...pedido.rows[0], itens: itens.rows };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function listar() {
  const result = await pool.query(`
    SELECT p.*,
      COALESCE(
        string_agg(
          pi.quantidade || 'x ' || pi.produto_nome,
          ', ' ORDER BY pi.id
        ),
        ''
      ) AS produtos
    FROM pedidos p
    LEFT JOIN pedido_itens pi ON pi.pedido_id = p.id
    GROUP BY p.id
    ORDER BY p.criado_em DESC
  `);

  return result.rows;
}

async function atualizarStatus(id, status) {
  const result = await pool.query(
    'UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
}

async function excluir(id) {
  const result = await pool.query('DELETE FROM pedidos WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
}

async function atualizarPagamento(id, pagamentoStatus) {
  const result = await pool.query(
    'UPDATE pedidos SET pagamento_status = $1 WHERE id = $2 RETURNING *',
    [pagamentoStatus, id]
  );
  return result.rows[0];
}

module.exports = { criar, listar, atualizarStatus, atualizarPagamento, excluir };
