const { pool } = require('../config/database');

async function listar() {
  const result = await pool.query(`
    SELECT * FROM eventos
    ORDER BY
      CASE WHEN status = 'Aguardando' THEN 0 ELSE 1 END,
      data,
      horario,
      criado_em DESC
  `);
  return result.rows;
}

async function criar(dados) {
  const result = await pool.query(
    `INSERT INTO eventos (cliente, telefone, tipo, data, horario, endereco, convidados, valor)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [dados.cliente, dados.telefone, dados.tipo, dados.data, dados.hora, dados.endereco, dados.convidados, dados.valor || null]
  );
  return result.rows[0];
}

async function atualizarStatus(id, status) {
  const result = await pool.query(
    `UPDATE eventos SET status = $1, atualizado_em = CURRENT_TIMESTAMP
     WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return result.rows[0];
}

async function excluir(id) {
  const result = await pool.query('DELETE FROM eventos WHERE id = $1 RETURNING id', [id]);
  return result.rows[0];
}

module.exports = { listar, criar, atualizarStatus, excluir };
