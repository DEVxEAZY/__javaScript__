/**
 * ============================================================
 * EXPRESS — MIDDLEWARES
 * ============================================================
 *
 * Como rodar:
 *   cd src/02_module/express/07_middlewares
 *   npm install
 *   node server.js
 *
 * Abra:
 *   http://localhost:3000/                (publica)
 *   http://localhost:3000/sobre           (publica)
 *   http://localhost:3000/admin           (precisa ?token=42)
 *   http://localhost:3000/admin?token=42  (logado)
 *   http://localhost:3000/erro            (dispara erro proposital)
 *   http://localhost:3000/qualquer-coisa  (404)
 *
 *
 * ============================================================
 * O QUE E MIDDLEWARE
 * ============================================================
 *
 * Middleware e uma funcao com a assinatura:
 *
 *      function (req, res, next) { ... }
 *
 * Que o Express CHAMA pra cada request, antes (ou depois) das
 * suas rotas finais. Cada middleware tem 3 escolhas:
 *
 *   1. CHAMAR next()    → "passa pra frente, eu ja terminei aqui".
 *   2. RESPONDER         (res.send/res.json/res.end) → encerra.
 *   3. CHAMAR next(erro) → pula direto pro middleware DE ERRO.
 *
 * Voce ja vinha usando middlewares sem perceber:
 *
 *   app.use(express.json())             ← parseia body JSON
 *   app.use(express.urlencoded(...))    ← parseia body de form
 *   app.use(express.static("public"))   ← serve arquivos
 *
 * Sao todos middlewares que cuidam de uma fatia do trabalho.
 *
 *
 * ============================================================
 * O FLUXO  (pipeline)
 * ============================================================
 *
 *   request entra
 *        │
 *        ▼
 *   ┌──────────────┐
 *   │ middleware 1 │ ── chama next() ──▶  ┌──────────────┐
 *   └──────────────┘                       │ middleware 2 │ ──▶ rota final ──▶ res
 *                                          └──────────────┘
 *
 * Se algum middleware NAO chamar next() nem responder, a request
 * "trava" — o cliente fica esperando ate timeout. Bug classico!
 *
 *
 * ============================================================
 * 4 TIPOS DE MIDDLEWARE NESTE ARQUIVO
 * ============================================================
 *
 *   A) Middleware GLOBAL (app.use sem caminho)         → roda em TUDO
 *   B) Middleware DE ROTA (app.use("/x", ...))         → roda em /x
 *   C) Middleware POR HANDLER (app.get("/y", mw, fn))  → so naquela rota
 *   D) Middleware DE ERRO (4 args: err, req, res, next)→ so quando da pau
 * ============================================================
 */


const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ============================================================
// A) MIDDLEWARE GLOBAL  —  logger caseiro
// ============================================================
//
// app.use(fn) sem caminho → roda em TODA requisicao, antes das
// rotas. Bom pra: log, medir tempo, header de seguranca, etc.
//
// Em producao voce normalmente usa "morgan" (npm i morgan), que
// faz isso melhor. Mas implementar uma vez na mao desmistifica
// o que ele faz por baixo.
app.use((req, res, next) => {
    const inicio = Date.now();

    // Log "na entrada":
    console.log(`→ ${req.method} ${req.url}`);

    // Truque legal: registra um callback pra rodar quando a
    // resposta acabar. Ai conseguimos medir o tempo total.
    res.on("finish", () => {
        const ms = Date.now() - inicio;
        console.log(`← ${req.method} ${req.url} ${res.statusCode} (${ms}ms)`);
    });

    // SEMPRE chame next() em middleware "passador" — senao a
    // request fica pendurada.
    next();
});


// ============================================================
// B) MIDDLEWARE DE ROTA  —  protege tudo abaixo de /admin
// ============================================================
//
// app.use("/admin", mw) faz mw rodar SOMENTE pra requests que
// comecam com /admin. Util pra autenticacao agrupada.
//
// Aqui um "guardiao" tosco: so deixa passar se vier ?token=42.
// Em projeto real, voce checaria um cookie de sessao ou um
// header Authorization com JWT.
function autenticar(req, res, next) {
    if (req.query.token === "42") {
        // Voce pode ANEXAR coisas em req — convencao comum: req.user
        // pra info do usuario logado, lida pelos handlers seguintes.
        req.user = { nome: "Admin" };
        return next();
    }

    // Sem token valido → cortamos aqui mesmo. NAO chamamos next();
    // a resposta encerra a request.
    res.status(401).send(`
        <h1>401 — Nao autorizado</h1>
        <p>Tente <a href="/admin?token=42">/admin?token=42</a></p>
    `);
}

app.use("/admin", autenticar);


// ============================================================
// C) MIDDLEWARE POR HANDLER  —  validacao especifica de uma rota
// ============================================================
//
// Voce pode listar varios middlewares antes do handler final na
// MESMA chamada de rota:
//
//      app.post("/x", mw1, mw2, handlerFinal);
//
// Cada um pode chamar next() pra avancar ou responder pra parar.
function validarCadastro(req, res, next) {
    const { nome } = req.body;
    if (!nome || nome.length < 2) {
        return res.status(400).json({ erro: "Nome muito curto" });
    }
    next();
}

app.post("/cadastro", validarCadastro, (req, res) => {
    res.json({ ok: true, recebido: req.body });
});


// ============================================================
// ROTAS PUBLICAS
// ============================================================
app.get("/", (req, res) => {
    res.send(`
        <h1>Aula de Middlewares</h1>
        <p>Veja o terminal: o logger global imprime cada request.</p>
        <ul>
            <li><a href="/sobre">/sobre</a> (publica)</li>
            <li><a href="/admin">/admin</a> (vai dar 401)</li>
            <li><a href="/admin?token=42">/admin?token=42</a> (passa)</li>
            <li><a href="/erro">/erro</a> (dispara o middleware de erro)</li>
            <li><a href="/coisa-que-nao-existe">/coisa-que-nao-existe</a> (404 customizado)</li>
        </ul>
    `);
});

app.get("/sobre", (req, res) => {
    res.send("<h1>Sobre</h1><p>Pagina publica.</p>");
});


// ============================================================
// ROTAS DE ADMIN  —  ja passaram pelo autenticar
// ============================================================
//
// Repare que aqui a gente nao precisa testar token de novo:
// se a request chegou ate aqui, e porque o middleware
// `autenticar` deixou. Concentrar a logica num lugar so e o
// ganho central de middleware.
app.get("/admin", (req, res) => {
    res.send(`<h1>Admin</h1><p>Bem-vindo, ${req.user.nome}.</p>`);
});


// ============================================================
// ROTA QUE PROVOCA ERRO  —  pra mostrar o middleware de erro
// ============================================================
//
// Em rotas SINCRONAS, basta dar throw: o Express captura e manda
// pro middleware de erro automaticamente.
//
// Em rotas ASYNC (com async/await), erros NAO sao capturados
// automaticamente em Express 4 — voce precisa try/catch e
// next(err) na mao, OU usar uma lib como `express-async-errors`.
// No Express 5 (em release) isso passa a ser automatico.
app.get("/erro", (req, res) => {
    throw new Error("Algo quebrou de proposito");
});


// ============================================================
// 404  —  middleware "catch-all" no FINAL
// ============================================================
//
// Como o Express percorre os middlewares na ordem, se chegar
// aqui sem nenhuma rota acima ter respondido, sabemos que e
// 404. Por isso este middleware vem APOS todas as rotas.
app.use((req, res, next) => {
    res.status(404).send(`
        <h1>404 — Nao encontrado</h1>
        <p>A URL <code>${req.url}</code> nao existe.</p>
    `);
});


// ============================================================
// D) MIDDLEWARE DE ERRO  —  4 argumentos, sempre por ULTIMO
// ============================================================
//
// O Express identifica que e um middleware DE ERRO pelo numero
// de argumentos: 4 (err, req, res, next). Se voce escrever 3,
// vira middleware comum e o `err` que voce esperava ali nem
// chega.
//
// Ele e chamado quando:
//   • Algum middleware/rota deu throw.
//   • Alguem chamou next(erro) com argumento.
//
// Aqui voce LOGA o erro de verdade (em prod: enviaria pro
// Sentry/Datadog) e devolve resposta amigavel pro cliente —
// SEM vazar a stack trace.
app.use((err, req, res, next) => {
    console.error("ERRO:", err.message);
    res.status(500).send(`
        <h1>500 — Erro interno</h1>
        <p>Aconteceu algum problema. A gente foi avisado.</p>
    `);
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
 *   middleware = (req, res, next) => { ... }
 *
 *   3 escolhas:
 *     • next()        → passa adiante
 *     • res.send(...) → encerra
 *     • next(err)     → vai pro middleware de erro
 *
 *   ORDEM IMPORTA. Pipeline tipico:
 *     1. body parsers (json, urlencoded)
 *     2. arquivos estaticos
 *     3. logger
 *     4. autenticacao
 *     5. rotas
 *     6. 404 catch-all
 *     7. handler de erro (4 args, ULTIMO)
 *
 *   Middleware de erro PRECISA ter 4 argumentos. Sem isso, vira
 *   middleware comum e o Express nao sabe que e pra erros.
 *
 *   Em rota async, erro nao "sobe" sozinho no Express 4. Use
 *   try/catch + next(e) ou a lib express-async-errors.
 * ============================================================
 */
