const express = require('express');
const eventoController = require('../controllers/eventoController');
const autenticar = require('../middlewares/auth');
const validarId = require('../middlewares/validarId');
const { permitirFuncoes } = require('../middlewares/permissoes');

const router = express.Router();

router.get('/', autenticar, eventoController.listar);
router.post('/', eventoController.criar);
router.patch('/:id/status', autenticar, validarId, eventoController.atualizarStatus);
router.delete('/:id', autenticar, permitirFuncoes('admin'), validarId, eventoController.excluir);

module.exports = router;
