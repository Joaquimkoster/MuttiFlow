const express = require('express');
const {
	cadastro,
	login,
} = require('../controllers/authController');
const autenticar = require('../middlewares/auth');
const { verificarTentativas } = require('../middlewares/loginLimiter');
const { contarUsuarios } = require('../models/Usuario');

const router = express.Router();

async function protegerCadastro(req, res, next) {
	try {
		if (await contarUsuarios() === 0) return next();
		return autenticar(req, res, () => {
			if (req.usuario.funcao !== 'admin') {
				return res.status(403).json({ erro: 'Somente administradores podem cadastrar usuários.' });
			}
			return next();
		});
	} catch (error) {
		return next(error);
	}
}

router.post('/cadastro', protegerCadastro, cadastro);
router.post('/login', verificarTentativas, login);

module.exports = router;
