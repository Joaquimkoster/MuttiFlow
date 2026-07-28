const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

async function buscarPorEmail(email) {
	const result = await pool.query(
		'SELECT id, nome, email, senha, funcao, criado_em FROM usuarios WHERE email = $1',
		[email],
	);

	return result.rows[0];
}

async function buscarPorNome(nome) {
	const result = await pool.query(
		'SELECT id, nome, email, senha, funcao, criado_em FROM usuarios WHERE LOWER(TRIM(nome)) = LOWER(TRIM($1)) ORDER BY id LIMIT 1',
		[nome],
	);

	return result.rows[0];
}

async function criarUsuario({ nome, email, senha, funcao = 'operador' }) {
	const senhaHash = await bcrypt.hash(senha, 10);

	const result = await pool.query(
		'INSERT INTO usuarios (nome, email, senha, funcao) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, funcao, criado_em',
		[nome, email, senhaHash, funcao],
	);

	return result.rows[0];
}

async function contarUsuarios() {
	const result = await pool.query('SELECT COUNT(*)::INTEGER AS total FROM usuarios');
	return result.rows[0].total;
}

async function buscarPublicoPorId(id) {
	const result = await pool.query('SELECT id, nome, email, funcao FROM usuarios WHERE id = $1', [id]);
	return result.rows[0];
}

module.exports = {
	buscarPorEmail,
	buscarPorNome,
	criarUsuario,
	contarUsuarios,
	buscarPublicoPorId,
};
