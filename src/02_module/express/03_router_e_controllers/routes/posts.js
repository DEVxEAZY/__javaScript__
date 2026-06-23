/**
 * routes/posts.js — Router ANINHADO (mergeParams)
 *
 * Montado em server.js como:
 *   app.use("/usuarios/:userId/posts", postsRouter);
 *
 * mergeParams: true faz req.params.userId (do prefixo pai)
 * estar disponível dentro deste router.
 */

const express = require("express");
const router = express.Router({ mergeParams: true });
const postsController = require("../controllers/postsController");

router.get("/", postsController.listarPorUsuario);

module.exports = router;
