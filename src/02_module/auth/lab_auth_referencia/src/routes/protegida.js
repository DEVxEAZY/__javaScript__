/**
 * Exemplo de rota protegida — GET /painel
 *
 * exigirLogin roda antes do handler: sem sessao valida, nem chega aqui.
 */

"use strict";

const express = require("express");
const exigirLogin = require("../middlewares/exigirLogin");

const router = express.Router();

router.get("/painel", exigirLogin, (req, res) => {
    res.json({
        ok: true,
        mensagem: "Area autenticada — voce passou pelo middleware exigirLogin.",
        usuario: req.session.usuario,
    });
});

module.exports = router;
