const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

async function buscarPorEmail(email) {
	const result = await pool.query(
		'SELECT id, nome, email, senha, criado_em FROM usuarios WHERE email = $1',
		[email],
	);

	return result.rows[0];
}

async function criarUsuario({ nome, email, senha }) {
	const senhaHash = await bcrypt.hash(senha, 10);

	const result = await pool.query(
		'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING id, nome, email, criado_em',
		[nome, email, senhaHash],
	);

	return result.rows[0];
}

module.exports = {
	buscarPorEmail,
	criarUsuario,
};
