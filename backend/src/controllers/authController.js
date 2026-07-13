const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { buscarPorEmail, buscarPorNome, criarUsuario } = require('../models/Usuario');

function gerarToken(usuario) {
	return jwt.sign(
		{ id: usuario.id, email: usuario.email, nome: usuario.nome },
		process.env.JWT_SECRET || 'muttiflow-secret',
		{ expiresIn: process.env.JWT_EXPIRES_IN || '30d' },
	);
}

async function cadastro(req, res) {
	try {
		const { nome, email, senha } = req.body;
		const emailNormalizado = String(email || '').trim().toLowerCase();
		const nomeNormalizado = String(nome || '').trim();

		if (!nomeNormalizado || !emailNormalizado || !senha) {
			return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' });
		}
		if (String(senha).length < 6) {
			return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
		}

		const usuarioExistente = await buscarPorEmail(emailNormalizado);
		if (usuarioExistente) {
			return res.status(409).json({ erro: 'E-mail já cadastrado.' });
		}

		const usuario = await criarUsuario({ nome: nomeNormalizado, email: emailNormalizado, senha });

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
		const { nome, email, senha } = req.body;
		const identificador = String(nome || email || '').trim();

		if (!identificador || !senha) {
			return res.status(400).json({ erro: 'Informe nome e senha.' });
		}

		// O e-mail continua aceito para não quebrar integrações antigas da API.
		const usuario = nome
			? await buscarPorNome(identificador)
			: await buscarPorEmail(identificador.toLowerCase());
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
