/**
 * ============================================================
 * routes/produtos.js — Router de "produtos"
 * ============================================================
 *
 * Evolução desta aula (do básico ao “elite”):
 *   • GET /, POST /           → lista e cria
 *   • GET /novo ANTES de /:id → ordem de rotas (fixo vs param)
 *   • router.param("id")      → loadProduto antes dos handlers :id
 *   • router.route("/:id")    → .get().put().delete() encadeados
 *   • middleware por rota     → validarCriacao no POST
 *
 * Fluxo visual: rotas_fluxo.html
 * ============================================================
 */

const express = require("express");
const router = express.Router();

const produtosController = require("../controllers/produtosController");
const loadProduto = require("../middlewares/loadProduto");


// Middleware só deste router — roda em TODA request que passa aqui
router.use((req, res, next) => {
    req.contextoProdutos = { dominio: "produtos" };
    next();
});


function validarCriacao(req, res, next) {
    const { nome, preco } = req.body;
    if (!nome || preco == null) {
        return res.status(400).json({ erro: "Campos obrigatórios: nome, preco" });
    }
    next();
}


// ── Rotas fixas ANTES de parametrizadas ──
router.get("/", produtosController.listar);
router.get("/novo", produtosController.formNovo);

router.post("/", validarCriacao, produtosController.criar);

// ── Param middleware: toda rota com :id passa por loadProduto ──
router.param("id", loadProduto);

// ── app.route equivalente no Router: vários verbos, mesmo path ──
router
    .route("/:id")
    .get(produtosController.detalhar)
    .put(produtosController.atualizar)
    .delete(produtosController.remover);


module.exports = router;
