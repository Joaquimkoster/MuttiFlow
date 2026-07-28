const express = require("express");
const router = express.Router();

const carrinhoController = require("../controllers/carrinhoController");
const validarId = require('../middlewares/validarId');

router.get("/", carrinhoController.listarCarrinho);
router.post("/itens", carrinhoController.adicionarItem);
router.patch("/itens/:id", validarId, carrinhoController.atualizarQuantidade);
router.delete("/itens/:id", validarId, carrinhoController.removerItem);
router.delete("/", carrinhoController.limparCarrinho);

module.exports = router;
