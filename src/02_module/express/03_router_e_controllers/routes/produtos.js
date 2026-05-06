/**
 * ============================================================
 * routes/produtos.js — Router de "produtos"
 * ============================================================
 *
 * Este arquivo NAO conhece o prefixo "/produtos". Ele descreve
 * suas rotas como se fosse um app standalone:
 *
 *      "/"     → lista
 *      "/:id"  → detalhe
 *
 * O server.js e quem monta esse router em "/produtos" via:
 *
 *      app.use("/produtos", produtosRouter);
 *
 * Esse "desacoplamento" e o que torna o router REUSAVEL: amanha
 * voce decide versionar a API e poe em "/v2/produtos" sem mexer
 * em uma linha aqui.
 * ============================================================
 */

const express = require("express");
const router = express.Router();

// O controller cuida da LOGICA. O router so faz o ROTEAMENTO.
const produtosController = require("../controllers/produtosController");


// GET  /produtos       → listar
router.get("/", produtosController.listar);

// GET  /produtos/:id   → detalhar
router.get("/:id", produtosController.detalhar);

// POST /produtos       → criar
router.post("/", produtosController.criar);


// "module.exports = router" e o que torna esse arquivo IMPORTAVEL.
// Sem isso, server.js nao consegue puxar produtosRouter.
module.exports = router;
