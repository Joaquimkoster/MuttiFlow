const express = require('express');
const eventoController = require('../controllers/eventoController');
const autenticar = require('../middlewares/auth');

const router = express.Router();

router.get('/', autenticar, eventoController.listar);
router.post('/', eventoController.criar);
router.patch('/:id/status', autenticar, eventoController.atualizarStatus);
router.delete('/:id', autenticar, eventoController.excluir);

module.exports = router;
