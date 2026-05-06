/**
 * ============================================================
 * CONTROLLER — Produtos
 * ============================================================
 *
 * Handlers que orquestram: model (Mongo) + view (EJS) + flash.
 * Note como as mensagens flash (req.flash) sobrevivem ao
 * redirect pra serem lidas no GET seguinte — esse e o ponto
 * todo do flash.
 * ============================================================
 */

const Produto = require("../models/Produto");


// GET /produtos  —  lista
exports.index = async (req, res, next) => {
    try {
        const produtos = await Produto.find().sort({ createdAt: -1 });
        res.render("produtos/index", { titulo: "Produtos", produtos });
    } catch (err) {
        next(err);
    }
};


// GET /produtos/novo  —  formulario
exports.formNovo = (req, res) => {
    // res.locals.csrfToken ja vem injetado pelo middleware do
    // server.js — a view usa <%= csrfToken %> no input hidden.
    res.render("produtos/novo", { titulo: "Novo produto" });
};


// POST /produtos  —  cria
exports.criar = async (req, res, next) => {
    try {
        const { nome, preco, categoria } = req.body;

        await Produto.create({
            nome,
            preco: Number(preco),
            categoria,
        });

        // Flash: salva na sessao, sera consumido na proxima request.
        req.flash("sucesso", `Produto "${nome}" cadastrado.`);
        res.redirect("/produtos");
    } catch (err) {
        // Erros de validacao do Mongoose vem com err.errors.
        if (err.name === "ValidationError") {
            const msgs = Object.values(err.errors).map((e) => e.message);
            req.flash("erro", msgs.join(" • "));
            return res.redirect("/produtos/novo");
        }
        next(err);
    }
};


// POST /produtos/:id/excluir  —  exclui
exports.excluir = async (req, res, next) => {
    try {
        const removido = await Produto.findByIdAndDelete(req.params.id);
        if (!removido) {
            req.flash("erro", "Produto nao encontrado.");
        } else {
            req.flash("sucesso", `Produto "${removido.nome}" excluido.`);
        }
        res.redirect("/produtos");
    } catch (err) {
        next(err);
    }
};
