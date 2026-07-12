const express = require('express');
const estoqueController = require('../controllers/estoqueController');

const router = express.Router();

router.get('/', estoqueController.listar);
router.post('/', estoqueController.criar);
router.put('/:id', estoqueController.atualizar);
router.delete('/:id', estoqueController.excluir);

module.exports = router;
