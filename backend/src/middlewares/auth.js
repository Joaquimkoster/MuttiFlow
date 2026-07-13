const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
	const authorization = req.headers.authorization;
	const [tipo, token] = String(authorization || '').split(' ');

	if (tipo !== 'Bearer' || !token) {
		return res.status(401).json({ erro: 'Autenticação necessária.' });
	}

	try {
		req.usuario = jwt.verify(token, process.env.JWT_SECRET || 'muttiflow-secret');
		return next();
	} catch {
		return res.status(401).json({ erro: 'Sessão inválida ou expirada.' });
	}
}

module.exports = autenticar;
