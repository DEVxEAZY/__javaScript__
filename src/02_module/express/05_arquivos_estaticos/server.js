/**
 * ============================================================
 * EXPRESS — ARQUIVOS ESTATICOS
 * ============================================================
 *
 * Como rodar:
 *   cd src/02_module/express/05_arquivos_estaticos
 *   npm install
 *   node server.js
 *
 * Abra:
 *   http://localhost:3000/             (index.html da pasta public)
 *   http://localhost:3000/sobre.html
 *   http://localhost:3000/css/style.css
 *   http://localhost:3000/js/app.js
 *
 *
 * ============================================================
 * O QUE E "ARQUIVO ESTATICO"
 * ============================================================
 *
 * Estatico = o servidor nao GERA o conteudo a cada request; ele
 * so LE um arquivo do disco e devolve. Tipico:
 *
 *   • index.html, sobre.html
 *   • style.css, reset.css
 *   • app.js, jquery.min.js
 *   • imagens, fontes, audio, video
 *
 * Voce poderia escrever uma rota pra cada arquivo:
 *
 *   app.get("/css/style.css", (req, res) =>
 *       res.sendFile(path.join(__dirname, "public/css/style.css"))
 *   );
 *
 * Mas isso nao escala — sao centenas de arquivos. O Express tem
 * um middleware EMBUTIDO pra exatamente esse caso: express.static.
 *
 *
 * ============================================================
 * express.static(pasta)
 * ============================================================
 *
 *   app.use(express.static("public"));
 *
 * O que isso faz na pratica: pra CADA requisicao que chegar, o
 * middleware tenta achar um arquivo em ./public com o caminho
 * pedido. Se achar, manda o arquivo + Content-Type correto +
 * cache headers. Se nao achar, passa adiante (chama next()), e
 * suas rotas normais cuidam.
 *
 * Mapeamento (com pasta = "public"):
 *
 *   GET /                  → public/index.html  (default)
 *   GET /sobre.html        → public/sobre.html
 *   GET /css/style.css     → public/css/style.css
 *   GET /js/app.js         → public/js/app.js
 *   GET /img/logo.png      → public/img/logo.png
 *
 * Notar: o nome "public" NAO aparece na URL. O cliente ve so
 * "/css/style.css" — a estrutura interna do projeto e detalhe seu.
 *
 *
 * ============================================================
 * COM PREFIXO  —  app.use("/static", express.static(...))
 * ============================================================
 *
 *   app.use("/static", express.static("public"));
 *
 * Ai:
 *   GET /static/css/style.css   → public/css/style.css
 *   GET /css/style.css          → 404 (a rota / nao serve mais)
 *
 * Util quando voce quer separar nominalmente as URLs estaticas
 * das dinamicas, ou quando varias pastas viram /static, /assets,
 * /uploads, etc.
 *
 *
 * ============================================================
 * ORDEM IMPORTA
 * ============================================================
 *
 * Middlewares em Express sao executados NA ORDEM em que voce
 * chama app.use(). Se voce poe express.static() ANTES das suas
 * rotas, ele tenta arquivo primeiro; depois suas rotas. E quase
 * sempre o que voce quer pra que /style.css ache o CSS antes
 * de qualquer rota /:slug capturar.
 *
 *
 * ============================================================
 * CACHE  —  ele ja vem
 * ============================================================
 *
 * express.static seta automaticamente headers como ETag e
 * Last-Modified. O navegador re-pede com If-None-Match e
 * recebe 304 (Not Modified) se nada mudou — isso explica por
 * que CSS/JS nao baixam toda vez. Em prod voce ainda costuma
 * por um proxy/CDN na frente, mas fora-da-caixa ja funciona.
 * ============================================================
 */


const express = require("express");
const path = require("path");

const app = express();


// ────────────────────────────────────────────────────────────
// SERVIR PASTA "public" NA RAIZ
// ────────────────────────────────────────────────────────────
//
// path.join(__dirname, "public") garante caminho absoluto e
// independente de onde o app foi chamado (`node server.js` da
// pasta atual ou de outra). Defensivo, vale o tique a mais.
app.use(express.static(path.join(__dirname, "public")));


// ────────────────────────────────────────────────────────────
// (opcional) — uma rota dinamica convivendo com o estatico
// ────────────────────────────────────────────────────────────
//
// Se a URL nao bater num arquivo de public/, a request cai aqui.
// Mostra que dinamico e estatico convivem: voce pode ter SPA
// com index.html servido staticamente E uma /api/... dinamica
// no mesmo app.
app.get("/api/agora", (req, res) => {
    res.json({ agora: new Date().toISOString() });
});


const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor em http://localhost:${PORTA}`);
});


/**
 * ============================================================
 * RESUMO MENTAL
 * ============================================================
 *
 *   app.use(express.static("public"))    → expoe public/* na raiz
 *   app.use("/x", express.static("..."))  → expoe sob /x
 *
 *   "public/" e so convencao — pode ser "static", "assets", etc.
 *   O index.html dentro vira a resposta automatica de GET /.
 *
 *   Static + rotas dinamicas convivem: a ordem dos app.use(...)
 *   manda. Geralmente static vem ANTES das rotas.
 * ============================================================
 */
