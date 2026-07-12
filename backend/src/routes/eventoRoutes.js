const express = require('express');
const eventoController = require('../controllers/eventoController');

const router = express.Router();

router.get('/', eventoController.listar);
router.post('/', eventoController.criar);
router.patch('/:id/status', eventoController.atualizarStatus);
router.delete('/:id', eventoController.excluir);

module.exports = router;
