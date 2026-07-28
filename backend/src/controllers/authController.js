const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { buscarPorEmail, buscarPorNome, criarUsuario, contarUsuarios } = require('../models/Usuario');
const { obterJwtSecret } = require('../config/jwt');
const { limparTentativas, registrarFalha } = require('../middlewares/loginLimiter');
const { emailValido, nomeValido, senhaForte } = require('../utils/validacoes');

function gerarToken(usuario) {
	return jwt.sign(
		{ id: usuario.id, email: usuario.email, nome: usuario.nome, funcao: usuario.funcao },
		obterJwtSecret(),
		{ expiresIn: process.env.JWT_EXPIRES_IN || '2h' },
	);
}

async function cadastro(req, res) {
	try {
		const { nome, email, senha, funcao } = req.body;
		const emailNormalizado = String(email || '').trim().toLowerCase();
		const nomeNormalizado = String(nome || '').trim();

		if (!nomeValido(nomeNormalizado) || !emailValido(emailNormalizado) || !senha) {
			return res.status(400).json({ erro: 'Preencha nome, e-mail e senha.' });
		}
		if (!senhaForte(senha)) {
			return res.status(400).json({ erro: 'A senha deve ter 8 caracteres, incluindo maiúscula, minúscula e número.' });
		}

		const usuarioExistente = await buscarPorEmail(emailNormalizado);
		if (usuarioExistente) {
			return res.status(409).json({ erro: 'E-mail já cadastrado.' });
		}

		const primeiroUsuario = await contarUsuarios() === 0;
		const funcaoNova = primeiroUsuario ? 'admin' : (funcao === 'admin' ? 'admin' : 'operador');
		const usuario = await criarUsuario({ nome: nomeNormalizado, email: emailNormalizado, senha, funcao: funcaoNova });

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
			registrarFalha(req);
			return res.status(401).json({ erro: 'Credenciais inválidas.' });
		}

		const senhaValida = await bcrypt.compare(senha, usuario.senha);
		if (!senhaValida) {
			registrarFalha(req);
			return res.status(401).json({ erro: 'Credenciais inválidas.' });
		}
		limparTentativas(req);

		const token = gerarToken(usuario);

		return res.json({
			token,
			usuario: {
				id: usuario.id,
				nome: usuario.nome,
				email: usuario.email,
				funcao: usuario.funcao,
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
