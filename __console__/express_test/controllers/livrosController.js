const path = require("path");
const livros = require(path.join(__dirname, "../data/livros.json"));

function listarLivros(req, res) {
    res.json(livros); // não processa query string
}

function detalharLivro(req, res) {
    const id = Number(req.params.id);
    const livro = livros.find((l) => l.id === id);
    if (!livro) return res.status(404).json({ erro: "Livro não encontrado" });
    res.json(livro);
}

module.exports = { listarLivros, detalharLivro };

