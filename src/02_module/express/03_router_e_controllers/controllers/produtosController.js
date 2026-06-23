/**
 * ============================================================
 * controllers/produtosController.js
 * ============================================================
 *
 * O CONTROLLER e onde a logica REALMENTE vive. Ele recebe
 * (req, res) — exatamente como um handler comum de rota — e
 * decide o que fazer.
 *
 * O ganho de extrair pra ca:
 *   • routes/produtos.js fica enxuto: so "qual rota chama qual
 *     funcao".
 *   • Cada funcao tem nome (listar, detalhar, criar). Quando o
 *     server crashar, a stack trace mostra "produtosController.criar"
 *     em vez de uma arrow function anonima dentro de outra.
 *   • Pra testar, voce importa o controller direto e chama com
 *     req/res falsos. Nao precisa subir servidor.
 *
 *
 * SOBRE O "BANCO" FAKE
 * ────────────────────
 * A lista hardcoded abaixo simula o que viria de um banco de
 * dados. Em projeto real isso aqui seria uma chamada async pro
 * MODEL — algo como `await Produto.findAll()`. A ideia da
 * arquitetura nao muda; so o que o controller chama e que vira
 * mais sofisticado.
 * ============================================================
 */

const produtos = [
    { id: 1, nome: "Teclado mecanico", preco: 350 },
    { id: 2, nome: "Mouse gamer",      preco: 180 },
    { id: 3, nome: "Monitor 24''",     preco: 980 },
];


/** Usado por loadProduto (router.param) — expõe o array fake */
function buscarPorId(id) {
    return produtos.find(p => p.id === id) || null;
}


// GET /produtos
function listar(req, res) {
    const { ordenar } = req.query;
    let lista = [...produtos];
    if (ordenar === "preco") {
        lista.sort((a, b) => a.preco - b.preco);
    }
    res.json(lista);
}


// GET /produtos/novo — rota FIXA antes de /:id (ordem importa!)
function formNovo(req, res) {
    res.json({
        mensagem: "Formulário de novo produto (rota fixa /novo)",
        campos: ["nome", "preco"],
    });
}


// GET /produtos/:id — usa req.produto se loadProduto rodou
function detalhar(req, res) {
    res.json(req.produto);
}


// PUT /produtos/:id
function atualizar(req, res) {
    const { nome, preco } = req.body;
    if (nome) req.produto.nome = nome;
    if (preco != null) req.produto.preco = Number(preco);
    res.json(req.produto);
}


// DELETE /produtos/:id
function remover(req, res) {
    const idx = produtos.findIndex(p => p.id === req.produto.id);
    if (idx >= 0) produtos.splice(idx, 1);
    res.status(204).send();
}


// POST /produtos
function criar(req, res) {
    const { nome, preco } = req.body;
    const novo = {
        id: produtos.length + 1,
        nome,
        preco: Number(preco),
    };
    produtos.push(novo);
    res.status(201).json(novo);
}


// Exportamos UM OBJETO com varias funcoes. No router fazemos
// `produtosController.listar` etc.
//
// Alternativa equivalente: exportar cada funcao separada
// (`exports.listar = ...`). Sao estilos — escolha um e mantenha.
module.exports = {
    buscarPorId,
    listar,
    formNovo,
    detalhar,
    criar,
    atualizar,
    remover,
};
