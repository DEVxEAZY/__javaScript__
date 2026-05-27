/**
 * Rotas publicas de autenticacao.
 *
 * POST /cadastro  — criar conta
 * POST /login     — autenticar (rate limit aplicado no server.js ou aqui)
 * POST /logout    — encerrar sessao
 */

"use strict";

const express = require("express");
const authController = require("../controllers/authController");
const rateLimitLogin = require("../middlewares/rateLimitLogin");

const router = express.Router();

router.post("/cadastro", authController.cadastrar);
router.post("/login", rateLimitLogin, authController.login);
router.post("/logout", authController.logout);

module.exports = router;
