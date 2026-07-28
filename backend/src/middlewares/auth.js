const jwt = require('jsonwebtoken');
const { obterJwtSecret } = require('../config/jwt');
const { buscarPublicoPorId } = require('../models/Usuario');

async function autenticar(req, res, next) {
	const authorization = req.headers.authorization;
	const [tipo, token] = String(authorization || '').split(' ');

	if (tipo !== 'Bearer' || !token) {
		return res.status(401).json({ erro: 'Autenticação necessária.' });
	}

	try {
		const payload = jwt.verify(token, obterJwtSecret());
		const usuario = await buscarPublicoPorId(payload.id);
		if (!usuario) return res.status(401).json({ erro: 'Usuário da sessão não existe.' });
		req.usuario = usuario;
		return next();
	} catch {
		return res.status(401).json({ erro: 'Sessão inválida ou expirada.' });
	}
}

module.exports = autenticar;
