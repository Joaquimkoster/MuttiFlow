const express = require('express');
const pedidoController = require('../controllers/pedidoController');
const autenticar = require('../middlewares/auth');

const router = express.Router();

router.get('/', autenticar, pedidoController.listar);
router.post('/', pedidoController.criar);
router.get('/:id/pix', pedidoController.buscarPix);
router.patch('/:id/status', autenticar, pedidoController.atualizarStatus);
router.patch('/:id/pagamento', autenticar, pedidoController.atualizarPagamento);
router.delete('/:id', autenticar, pedidoController.excluir);

module.exports = router;
