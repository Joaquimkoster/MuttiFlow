const { pool } = require('../config/database');

function normalizarTexto(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function validarDestino(dados) {
  if (dados.regiaoEntrega === 'retirada') return;

  const cidade = normalizarTexto(dados.cidade);
  if (dados.regiaoEntrega === 'paulinia' && cidade !== 'paulinia') {
    throw new Error('O frete de R$ 7,00 é válido somente para a cidade de Paulínia');
  }
  if (dados.regiaoEntrega === 'outras' && cidade === 'paulinia') {
    throw new Error('Para a cidade de Paulínia, selecione o frete fixo de R$ 7,00');
  }
}

async function calcularDesconto(client, codigoInformado, subtotal) {
  const codigo = String(codigoInformado || '').trim().toUpperCase();
  if (!codigo) return 0;

  const result = await client.query(
    `SELECT tipo, valor
     FROM cupons
     WHERE UPPER(codigo) = $1
       AND ativo = TRUE
       AND (inicio_em IS NULL OR inicio_em <= CURRENT_TIMESTAMP)
       AND (fim_em IS NULL OR fim_em >= CURRENT_TIMESTAMP)`,
    [codigo]
  );

  if (result.rows.length === 0) {
    throw new Error('Cupom inválido ou inativo');
  }

  const cupom = result.rows[0];
  const desconto = cupom.tipo === 'percentual'
    ? subtotal * (Number(cupom.valor) / 100)
    : Number(cupom.valor);

  return Math.min(subtotal, Math.round(desconto * 100) / 100);
}

async function criar(sessaoId, dados, idempotencyKey) {
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

    const pedidoExistente = await client.query(
      'SELECT * FROM pedidos WHERE sessao_id = $1 AND idempotency_key = $2',
      [sessaoId, idempotencyKey]
    );
    if (pedidoExistente.rows.length > 0) {
      await client.query('COMMIT');
      return { ...pedidoExistente.rows[0], reutilizado: true };
    }

    const itens = await client.query(
      `SELECT ci.produto_id, ci.quantidade, p.preco AS preco_unitario,
              p.nome, p.status, p.estoque
       FROM carrinho_itens ci
       JOIN produtos p ON p.id = ci.produto_id
       WHERE ci.carrinho_id = $1
       FOR UPDATE OF ci, p`,
      [carrinho.rows[0].id]
    );

    if (itens.rows.length === 0) {
      throw new Error('O carrinho está vazio');
    }

    for (const item of itens.rows) {
      if (item.status !== 'ativo') {
        throw new Error(`O produto “${item.nome}” não está ativo`);
      }
      if (!Number.isInteger(Number(item.quantidade)) || Number(item.quantidade) <= 0) {
        throw new Error(`A quantidade do produto “${item.nome}” é inválida`);
      }
      if (Number(item.quantidade) > Number(item.estoque)) {
        throw new Error(`Quantidade indisponível para o produto “${item.nome}”`);
      }
    }

    validarDestino(dados);

    const subtotal = itens.rows.reduce(
      (total, item) => total + Number(item.preco_unitario) * item.quantidade,
      0
    );
    const frete = dados.regiaoEntrega === 'paulinia' ? 7 : 0;
    const desconto = await calcularDesconto(client, dados.cupom, subtotal);
    const total = Math.round((subtotal + frete - desconto) * 100) / 100;
    const regiaoEntrega = dados.regiaoEntrega === 'retirada'
      ? 'Retirada no local'
      : dados.regiaoEntrega === 'paulinia'
        ? 'Entrega em Paulínia — frete fixo de R$ 7,00'
        : 'Entrega em Campinas/outra região — Uber calculado à parte';
    const observacoes = [regiaoEntrega, dados.observacoes].filter(Boolean).join(' | ');

    const pedido = await client.query(
      `INSERT INTO pedidos (
        sessao_id, cliente_nome, whatsapp, email, forma_pagamento, endereco,
        complemento, cidade, bairro, data_entrega, horario, observacoes, subtotal,
        frete, desconto, total, idempotency_key, tipo_entrega
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
      RETURNING *`,
      [
        sessaoId, dados.nome, dados.whatsapp, dados.email || null,
        dados.pagamento, dados.regiaoEntrega === 'retirada' ? 'Retirada no local' : dados.endereco, dados.complemento || null,
        dados.cidade || null, dados.bairro || null, dados.dataEntrega,
        dados.horario, observacoes,
        subtotal, frete, desconto, total, idempotencyKey, dados.regiaoEntrega,
      ]
    );

    const codigoPublico = `MUT-${new Date().getFullYear()}-${String(pedido.rows[0].id).padStart(5, '0')}`;
    pedido.rows[0] = (await client.query(
      'UPDATE pedidos SET codigo_publico = $1 WHERE id = $2 RETURNING *',
      [codigoPublico, pedido.rows[0].id]
    )).rows[0];

    await client.query(
      `INSERT INTO pedido_status_historico (pedido_id, status_anterior, status_novo)
       VALUES ($1, NULL, $2)`,
      [pedido.rows[0].id, pedido.rows[0].status]
    );

    for (const item of itens.rows) {
      await client.query(
        `INSERT INTO pedido_itens
          (pedido_id, produto_id, produto_nome, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4, $5)`,
        [pedido.rows[0].id, item.produto_id, item.nome, item.quantidade, item.preco_unitario]
      );

      const estoqueAtualizado = await client.query(
        `UPDATE produtos
         SET estoque = estoque - $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2 AND estoque >= $1
         RETURNING estoque`,
        [item.quantidade, item.produto_id]
      );
      if (estoqueAtualizado.rows.length === 0) {
        throw new Error(`O estoque do produto “${item.nome}” mudou. Revise o pedido.`);
      }
    }

    await client.query(
      `INSERT INTO pagamentos (pedido_id, forma, status, valor)
       VALUES ($1, $2, 'Pendente', $3)`,
      [pedido.rows[0].id, dados.pagamento, total]
    );

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

async function atualizarStatus(id, status, usuarioId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const atual = await client.query(
      'SELECT * FROM pedidos WHERE id = $1 FOR UPDATE',
      [id]
    );
    if (atual.rows.length === 0) {
      await client.query('ROLLBACK');
      return undefined;
    }
    if (atual.rows[0].status === status) {
      await client.query('COMMIT');
      return atual.rows[0];
    }
    const result = await client.query(
      'UPDATE pedidos SET status = $1, atualizado_em = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    await client.query(
      `INSERT INTO pedido_status_historico
        (pedido_id, status_anterior, status_novo, usuario_id)
       VALUES ($1, $2, $3, $4)`,
      [id, atual.rows[0].status, status, usuarioId]
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function listarHistorico(id) {
  const result = await pool.query(
    `SELECT h.id, h.status_anterior, h.status_novo, h.criado_em,
            h.usuario_id, u.nome AS usuario_nome
     FROM pedido_status_historico h
     LEFT JOIN usuarios u ON u.id = h.usuario_id
     WHERE h.pedido_id = $1
     ORDER BY h.criado_em DESC, h.id DESC`,
    [id]
  );
  return result.rows;
}

async function buscarPublico(codigo) {
  const result = await pool.query(
    `SELECT p.codigo_publico AS codigo, p.status, p.data_entrega AS data,
            p.horario, p.tipo_entrega,
            COALESCE(
              json_agg(json_build_object('nome', pi.produto_nome, 'quantidade', pi.quantidade)
                ORDER BY pi.id) FILTER (WHERE pi.id IS NOT NULL),
              '[]'::json
            ) AS itens
     FROM pedidos p
     LEFT JOIN pedido_itens pi ON pi.pedido_id = p.id
     WHERE UPPER(p.codigo_publico) = UPPER($1)
     GROUP BY p.id`,
    [codigo]
  );
  return result.rows[0];
}

async function excluir(id) {
  const result = await pool.query('DELETE FROM pedidos WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
}

async function atualizarPagamento(id, pagamentoStatus) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      'UPDATE pedidos SET pagamento_status = $1, atualizado_em = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [pagamentoStatus, id]
    );
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return undefined;
    }
    await client.query(
      `INSERT INTO pagamentos (pedido_id, forma, status, valor)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (pedido_id) DO UPDATE
       SET status = EXCLUDED.status, atualizado_em = CURRENT_TIMESTAMP`,
      [id, result.rows[0].forma_pagamento, pagamentoStatus, result.rows[0].total]
    );
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function buscarPix(id, sessaoId) {
  const result = await pool.query(
    `SELECT id, cliente_nome, total, forma_pagamento, pagamento_status, codigo_publico
     FROM pedidos
     WHERE id = $1 AND sessao_id = $2`,
    [id, sessaoId]
  );
  return result.rows[0];
}

module.exports = { criar, listar, atualizarStatus, atualizarPagamento, buscarPix, buscarPublico, excluir, listarHistorico };
