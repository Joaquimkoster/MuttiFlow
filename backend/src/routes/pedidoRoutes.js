const express = require('express');
const pedidoController = require('../controllers/pedidoController');
const autenticar = require('../middlewares/auth');
const validarId = require('../middlewares/validarId');
const { permitirFuncoes } = require('../middlewares/permissoes');

const router = express.Router();

router.get('/', autenticar, pedidoController.listar);
router.post('/', pedidoController.criar);
router.get('/publico/:codigo', pedidoController.buscarPublico);
router.get('/:id/historico', autenticar, validarId, pedidoController.listarHistorico);
router.get('/:id/pix', validarId, pedidoController.buscarPix);
router.patch('/:id/status', autenticar, validarId, pedidoController.atualizarStatus);
router.patch('/:id/pagamento', autenticar, validarId, pedidoController.atualizarPagamento);
router.delete('/:id', autenticar, permitirFuncoes('admin'), validarId, pedidoController.excluir);

module.exports = router;
