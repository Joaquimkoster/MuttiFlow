const express = require("express");
const router = express.Router();

const carrinhoController = require("../controllers/carrinhoController");

router.get("/", carrinhoController.listarCarrinho);
router.post("/itens", carrinhoController.adicionarItem);
router.patch("/itens/:id", carrinhoController.atualizarQuantidade);
router.delete("/itens/:id", carrinhoController.removerItem);
router.delete("/", carrinhoController.limparCarrinho);

module.exports = router;