/**
 * controllers/usuariosController.js
 *
 * Mesma estrutura do produtosController. Quando voce ve dois
 * controllers com a "mesma cara", e um sinal de que existe um
 * padrao que vale a pena seguir no projeto inteiro.
 */

const usuarios = [
    { id: 1, nome: "Ana",   email: "ana@example.com" },
    { id: 2, nome: "Bruno", email: "bruno@example.com" },
];


function listar(req, res) {
    res.json(usuarios);
}


function detalhar(req, res) {
    const id = Number(req.params.id);
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({ erro: "Usuario nao encontrado" });
    }

    res.json(usuario);
}


module.exports = { listar, detalhar };
