const { pool } = require('../config/database');

const camposRetorno = `
  id, nome, categoria, quantidade, unidade, minimo, validade,
  CASE
    WHEN quantidade = 0 THEN 'Esgotado'
    WHEN quantidade <= minimo THEN 'Baixo'
    ELSE 'Disponível'
  END AS status
`;

async function listar() {
  const result = await pool.query(`SELECT ${camposRetorno} FROM estoque ORDER BY nome`);
  return result.rows;
}

async function criar(dados) {
  const result = await pool.query(
    `INSERT INTO estoque (nome, categoria, quantidade, unidade, minimo, validade)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${camposRetorno}`,
    [dados.nome, dados.categoria, dados.quantidade, dados.unidade, dados.minimo, dados.validade || null]
  );
  return result.rows[0];
}

async function atualizar(id, dados) {
  const result = await pool.query(
    `UPDATE estoque
     SET nome = $1, categoria = $2, quantidade = $3, unidade = $4,
         minimo = $5, validade = $6, atualizado_em = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING ${camposRetorno}`,
    [dados.nome, dados.categoria, dados.quantidade, dados.unidade, dados.minimo, dados.validade || null, id]
  );
  return result.rows[0];
}

async function excluir(id) {
  const result = await pool.query('DELETE FROM estoque WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
}

module.exports = { listar, criar, atualizar, excluir };
