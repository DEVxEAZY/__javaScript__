/**
 * middlewares/loadProduto.js
 *
 * Middleware de PARAMETRO (router.param / app.param).
 * Roda ANTES do handler quando a rota tem :id — carrega o recurso
 * em req.produto para os handlers seguintes não repetirem o find.
 *
 * Ver rotas_fluxo.html · cenário "param-loader".
 */

const produtosController = require("../controllers/produtosController");

/** @type {import("express").RequestHandler} */
function loadProduto(req, res, next, id) {
  const num = Number(id);
  if (!Number.isInteger(num) || num < 1) {
    return res.status(400).json({ erro: "id inválido" });
  }

  const produto = produtosController.buscarPorId(num);
  if (!produto) {
    return res.status(404).json({ erro: "Produto não encontrado" });
  }

  req.produto = produto;
  next();
}

module.exports = loadProduto;
