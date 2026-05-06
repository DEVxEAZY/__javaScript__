/**
 * ============================================================
 * ROUTES — Produtos
 * ============================================================
 *
 * Mantem um Router separado por recurso. O server.js monta esse
 * router num prefixo (app.use("/produtos", produtosRouter)) e
 * aqui dentro voce so se preocupa com o caminho relativo.
 * ============================================================
 */

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/produtosController");

router.get("/",            ctrl.index);
router.get("/novo",        ctrl.formNovo);
router.post("/",           ctrl.criar);
router.post("/:id/excluir", ctrl.excluir);

module.exports = router;
