/**
 * routes/usuarios.js — Router de "usuarios"
 *
 * Mesma ideia do produtos.js. Reparei na simetria? E proposital:
 * em projetos reais voce vai ter dezenas desses arquivos, todos
 * com a mesma "casca" — abre router, define rotas, exporta.
 */

const express = require("express");
const router = express.Router();

const usuariosController = require("../controllers/usuariosController");

router.get("/", usuariosController.listar);
router.get("/:id", usuariosController.detalhar);

module.exports = router;
