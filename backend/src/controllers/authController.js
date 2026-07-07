const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { buscarPorEmail, criarUsuario } = require('../models/Usuario');

function gerarToken(usuario) {
	return jwt.sign(
		{ id: usuario.id, email: usuario.email, nome: usuario.nome },
		process.env.JWT_SECRET || 'muttiflow-secret',
		{ expiresIn: '8h' },
	);
}

async function cadastro(req, res) {
	try {
		const { nome, email, senha } = req.body;

		if (!nome || !email || !senha) {
			return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' });
		}

		const usuarioExistente = await buscarPorEmail(email);
		if (usuarioExistente) {
			return res.status(409).json({ erro: 'E-mail já cadastrado.' });
		}

		const usuario = await criarUsuario({ nome, email, senha });

		return res.status(201).json({
			mensagem: 'Usuário criado com sucesso.',
			usuario,
		});
	} catch (error) {
		console.error('Erro no cadastro:', error);
		return res.status(500).json({ erro: 'Erro interno ao criar conta.' });
	}
}

async function login(req, res) {
	try {
		const { email, senha } = req.body;

		if (!email || !senha) {
			return res.status(400).json({ erro: 'Informe e-mail e senha.' });
		}

		const usuario = await buscarPorEmail(email);
		if (!usuario) {
			return res.status(401).json({ erro: 'Credenciais inválidas.' });
		}

		const senhaValida = await bcrypt.compare(senha, usuario.senha);
		if (!senhaValida) {
			return res.status(401).json({ erro: 'Credenciais inválidas.' });
		}

		const token = gerarToken(usuario);

		return res.json({
			token,
			usuario: {
				id: usuario.id,
				nome: usuario.nome,
				email: usuario.email,
			},
		});
	} catch (error) {
		console.error('Erro no login:', error);
		return res.status(500).json({ erro: 'Erro interno ao fazer login.' });
	}
}

module.exports = {
	cadastro,
	login,
};
