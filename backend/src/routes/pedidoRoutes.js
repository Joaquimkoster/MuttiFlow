const express = require('express');
const pedidoController = require('../controllers/pedidoController');

const router = express.Router();

router.get('/', pedidoController.listar);
router.post('/', pedidoController.criar);
router.patch('/:id/status', pedidoController.atualizarStatus);
router.patch('/:id/pagamento', pedidoController.atualizarPagamento);
router.delete('/:id', pedidoController.excluir);

module.exports = router;
