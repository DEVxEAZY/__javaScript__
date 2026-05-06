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


// GET /produtos
function listar(req, res) {
    res.json(produtos);
}


// GET /produtos/:id
function detalhar(req, res) {
    // req.params.id chega como STRING. Compare com Number(...) ou
    // converta antes — comparar "1" === 1 da false.
    const id = Number(req.params.id);
    const produto = produtos.find(p => p.id === id);

    if (!produto) {
        // 404 = "achei o servidor mas nao achei esse recurso".
        // res.status(...).json(...) e um padrao MUITO comum:
        // ajusta o status code antes de mandar o corpo.
        return res.status(404).json({ erro: "Produto nao encontrado" });
    }

    res.json(produto);
}


// POST /produtos
function criar(req, res) {
    const { nome, preco } = req.body;

    // Validacao basica — em prod use uma lib (zod, joi, yup).
    if (!nome || preco == null) {
        return res.status(400).json({
            erro: "Campos obrigatorios: nome, preco",
        });
    }

    const novo = {
        id: produtos.length + 1, // id "fake" — banco real cuida disso
        nome,
        preco: Number(preco),
    };
    produtos.push(novo);

    // 201 = "criado". Convencao REST: respondendo a um POST que
    // criou um recurso, devolva 201 e o objeto criado (com id).
    res.status(201).json(novo);
}


// Exportamos UM OBJETO com varias funcoes. No router fazemos
// `produtosController.listar` etc.
//
// Alternativa equivalente: exportar cada funcao separada
// (`exports.listar = ...`). Sao estilos — escolha um e mantenha.
module.exports = {
    listar,
    detalhar,
    criar,
};
