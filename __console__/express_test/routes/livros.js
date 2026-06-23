const express = require("express");
const router = express.Router();

const livrosController = require("../controllers/livrosController");

router.get("/", livrosController.listarLivros); // lista todos os livros

router.get("/:id", livrosController.detalharLivro); // detalha um livro

module.exports = router;