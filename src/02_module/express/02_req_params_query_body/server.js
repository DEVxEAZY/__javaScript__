/**
 * ============================================================
 * EXPRESS — req.params, req.query e req.body
 * ============================================================
 *
 * Como rodar:
 *   cd src/02_module/express/02_req_params_query_body
 *   npm install        (uma vez)
 *   node server.js
 *
 * Depois abra: http://localhost:3000/
 *
 *
 * ============================================================
 * AS TRES FONTES DE DADOS DA REQUISICAO
 * ============================================================
 *
 * Toda requisicao HTTP carrega informacao. O Express expoe
 * essas informacoes em TRES lugares principais:
 *
 *   ┌────────────┬───────────────────────┬──────────────────────────┐
 *   │ ONDE       │ DE ONDE VEM           │ EXEMPLO                  │
 *   ├────────────┼───────────────────────┼──────────────────────────┤
 *   │ req.params │ pedacos da URL fixos  │ /produtos/:id            │
 *   │ req.query  │ depois do "?"         │ /busca?q=foo&page=2      │
 *   │ req.body   │ corpo (POST/PUT/...)  │ formulario, JSON, etc.   │
 *   └────────────┴───────────────────────┴──────────────────────────┘
 *
 * Os tres podem coexistir numa mesma requisicao. Cada um serve
 * a um proposito DIFERENTE — saber qual usar quando e metade do
 * trabalho de desenhar uma API decente:
 *
 *   • params  → IDENTIFICAR um recurso ("qual produto?", "qual
 *               usuario?"). Faz parte do "endereco" do recurso.
 *
 *   • query   → MODIFICAR a busca/lista (filtros, paginacao,
 *               ordenacao). Opcionais por natureza.
 *
 *   • body    → DADOS que o cliente esta MANDANDO (form
 *               preenchido, JSON enviado por fetch/axios).
 *               Sempre acompanha verbos POST / PUT / PATCH.
 *
 *
 * ============================================================
 * REGRA PRATICA: GET nao manda body
 * ============================================================
 *
 * GET serve pra LER. Toda info que ele precisa fica na URL
 * (params + query) — facil de bookmarkar, compartilhar, cachear.
 *
 * POST / PUT / PATCH / DELETE servem pra MUDAR algo no servidor.
 * Eles podem (e geralmente devem) mandar payload no body.
 * ============================================================
 */


const express = require("express");
const app = express();


// ────────────────────────────────────────────────────────────
// MIDDLEWARES DE PARSING DO BODY
// ────────────────────────────────────────────────────────────
//
// Sem isso req.body vem `undefined`. Habilitamos os DOIS formatos
// mais comuns:
//
//   • urlencoded → o que <form> manda por padrao (chave=valor&...)
//   • json       → o que fetch / axios mandam quando voce faz
//                  fetch(url, { method:"POST", body: JSON.stringify(...) })
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ============================================================
// HOME — pagina-indice com links e formularios pra testar tudo
// ============================================================
app.get("/", (req, res) => {
    res.send(`
        <h1>req.params, req.query e req.body</h1>

        <h2>1) req.params (parte fixa da URL)</h2>
        <ul>
            <li><a href="/produtos/42">/produtos/42</a></li>
            <li><a href="/produtos/abc">/produtos/abc</a></li>
            <li><a href="/usuarios/joao/posts/7">/usuarios/joao/posts/7</a></li>
        </ul>

        <h2>2) req.query (depois do "?")</h2>
        <ul>
            <li><a href="/busca?q=javascript">/busca?q=javascript</a></li>
            <li><a href="/busca?q=node&amp;page=2&amp;ordem=desc">/busca?q=node&amp;page=2&amp;ordem=desc</a></li>
            <li><a href="/busca">/busca (sem query)</a></li>
        </ul>

        <h2>3) req.body (formulario)</h2>
        <form action="/cadastro" method="post">
            <p><label>Nome: <input name="nome" /></label></p>
            <p><label>Email: <input name="email" type="email" /></label></p>
            <p><label>Idade: <input name="idade" type="number" /></label></p>
            <p><button type="submit">Cadastrar</button></p>
        </form>

        <h2>3b) req.body em JSON (fetch direto do navegador)</h2>
        <p>Abra o DevTools (F12) → console → cole:</p>
        <pre>fetch("/api/cadastro", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nome: "Maria", email: "m@x.com" })
}).then(r =&gt; r.json()).then(console.log);</pre>
    `);
});


// ============================================================
// 1) req.params  —  /produtos/:id
// ============================================================
//
// O ":id" na rota e um PARAMETRO DE ROTA. O Express captura o
// pedaco que vier ali e disponibiliza em req.params.id.
//
// Voce pode ter varios:
//      app.get("/usuarios/:user/posts/:postId", ...)
// → req.params = { user: "...", postId: "..." }
//
// IMPORTANTE: tudo em req.params chega como STRING. Se a rota
// e /produtos/42, req.params.id e "42" (string), nao 42 (number).
// Se voce precisa do numero, converta com Number(...) ou parseInt.
app.get("/produtos/:id", (req, res) => {
    const { id } = req.params;

    res.send(`
        <h1>Produto ${id}</h1>
        <p>O Express capturou o pedaco da URL apos /produtos/.</p>
        <p>req.params = <code>${JSON.stringify(req.params)}</code></p>
        <p>typeof id = <code>${typeof id}</code> (sempre string!)</p>
        <p><a href="/">Voltar</a></p>
    `);
});

// Multiplos params na mesma rota
app.get("/usuarios/:user/posts/:postId", (req, res) => {
    res.json({
        rota: "/usuarios/:user/posts/:postId",
        params: req.params,
        // ex.: { user: "joao", postId: "7" }
    });
});


// ============================================================
// 2) req.query  —  ?chave=valor&chave2=valor2
// ============================================================
//
// Tudo o que vem depois do "?" na URL vai pra req.query, ja como
// objeto. NAO precisa declarar nada na rota — query string e
// LIVRE, o cliente manda o que quiser.
//
// Casos de uso classicos:
//   • Busca:    /busca?q=termo
//   • Paginar:  /lista?page=2&perPage=20
//   • Filtrar:  /produtos?categoria=livros&maxPreco=50
//   • Ordenar:  /lista?ordem=desc
//
// Como params, query SEMPRE chega como string (ou objeto, se
// extended:true e voce mandar algo aninhado). Converta tipos
// quando precisar.
app.get("/busca", (req, res) => {
    // Defaults razoaveis quando o cliente nao manda algo:
    const termo = req.query.q || "(vazio)";
    const page  = Number(req.query.page) || 1;
    const ordem = req.query.ordem || "asc";

    res.send(`
        <h1>Busca</h1>
        <p>Termo: <strong>${termo}</strong></p>
        <p>Pagina: <strong>${page}</strong> (typeof = ${typeof page})</p>
        <p>Ordem: <strong>${ordem}</strong></p>
        <hr/>
        <p>req.query = <code>${JSON.stringify(req.query)}</code></p>
        <p><a href="/">Voltar</a></p>
    `);
});


// ============================================================
// 3) req.body  —  formulario classico (urlencoded)
// ============================================================
//
// Quando um <form method="post"> envia, o navegador serializa os
// campos como "chave=valor&chave=valor" e poe NO CORPO da
// requisicao com Content-Type: application/x-www-form-urlencoded.
//
// O middleware express.urlencoded() (la em cima) parseia isso
// e popula req.body como objeto.
//
// Se voce esquecer o middleware, req.body vem `undefined` e
// quebra com TypeError ao tentar ler .nome — armadilha classica.
app.post("/cadastro", (req, res) => {
    const { nome, email, idade } = req.body;

    res.send(`
        <h1>Cadastro recebido</h1>
        <ul>
            <li>Nome: <strong>${nome || "(vazio)"}</strong></li>
            <li>Email: <strong>${email || "(vazio)"}</strong></li>
            <li>Idade: <strong>${idade || "(vazio)"}</strong></li>
        </ul>
        <p>req.body = <code>${JSON.stringify(req.body)}</code></p>
        <p><a href="/">Voltar</a></p>
    `);
});


// ============================================================
// 3b) req.body  —  JSON (fetch / axios)
// ============================================================
//
// APIs modernas trocam JSON. O middleware express.json() habilita
// o parsing automatico quando o Content-Type e "application/json".
//
// res.json(...) ja serializa pra JSON e seta o header pra voce —
// e o equivalente "json" do res.send().
app.post("/api/cadastro", (req, res) => {
    res.json({
        recebido: true,
        body: req.body,
        // dica de teste: rode no console do navegador o snippet
        // que esta na home.
    });
});


// ============================================================
// EXEMPLO COMBINADO  —  os tres ao mesmo tempo
// ============================================================
//
// Realista: um endpoint que ATUALIZA produto N com base em
// dados do body, com flags opcionais via query.
//
//   PUT /produtos/42?notificar=true
//   Content-Type: application/json
//   { "preco": 99.90 }
//
// Aqui:
//   req.params.id    = "42"           (qual produto)
//   req.query.notificar = "true"      (flag opcional)
//   req.body         = { preco: 99.9} (o que mudar)
app.put("/produtos/:id", (req, res) => {
    res.json({
        params: req.params,
        query: req.query,
        body: req.body,
    });
});


// ============================================================
// LISTEN
// ============================================================
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
});


/**
 * ============================================================
 * RESUMO MENTAL
 * ============================================================
 *
 *   req.params  →  /produtos/:id              (identifica)
 *   req.query   →  ?q=foo&page=2              (filtra/modifica)
 *   req.body    →  POST/PUT corpo da req.     (manda dados)
 *
 *   Sem app.use(express.urlencoded()) → req.body undefined em forms.
 *   Sem app.use(express.json())       → req.body undefined em APIs JSON.
 *
 *   Tudo em params/query chega como STRING. Converta com
 *   Number()/parseInt() quando precisar de numero.
 * ============================================================
 */
