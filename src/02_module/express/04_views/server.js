/**
 * ============================================================
 * EXPRESS — VIEWS (template engine)
 * ============================================================
 *
 * Como rodar:
 *   cd src/02_module/express/04_views
 *   npm install
 *   node server.js
 *
 * Abra:
 *   http://localhost:3000/
 *   http://localhost:3000/sobre
 *   http://localhost:3000/produtos/1
 *
 *
 * ============================================================
 * O PROBLEMA: HTML dentro de string
 * ============================================================
 *
 * Ate agora a gente tava fazendo:
 *
 *   res.send("<h1>Ola " + nome + "</h1><ul>" + ... + "</ul>");
 *
 * Funciona pra "ola mundo", mas pra UMA pagina real (header,
 * menu, lista, footer) o codigo vira ilegivel:
 *   • aspas escapadas, concatenacao infinita
 *   • impossivel pro editor formatar como HTML
 *   • duplicacao do header em toda rota
 *   • risco de XSS quando voce esquece de escapar dado do user
 *
 *
 * ============================================================
 * SOLUCAO: TEMPLATE ENGINE
 * ============================================================
 *
 * Voce escreve o HTML em arquivos separados (chamados "views")
 * com placeholders pra variaveis. O Express renderiza esse
 * template trocando os placeholders pelos valores que voce
 * passar.
 *
 *   views/home.ejs         → o template
 *   res.render("home", { nome: "Ana" });    → o disparo
 *
 * Engines populares: EJS, Pug, Handlebars, Nunjucks. Aqui
 * usamos EJS porque a sintaxe e literalmente HTML + tags <%= %>
 * — curva de aprendizado quase zero pra quem ja sabe HTML.
 *
 *   <%= variavel %>    → imprime escapando HTML (seguro contra XSS)
 *   <%- variavel %>    → imprime SEM escapar (use com cuidado)
 *   <% if (...) { %>   → logica JS pura
 *   <%- include('...') %> → reaproveita pedaco (header, footer)
 *
 *
 * ============================================================
 * SSR vs SPA  —  pra quando isso e util
 * ============================================================
 *
 * Renderizar HTML no servidor (SSR) e o jeito CLASSICO da web:
 * o servidor monta a pagina inteira e manda pro browser. Bom pra:
 *   • Sites de conteudo (blogs, paginas institucionais, e-commerce
 *     simples) — SEO funciona "de graca", nao depende de JS.
 *   • Apps internos / paineis admin sem necessidade de UX rica.
 *   • Prototipos rapidos — voce nao precisa de dois projetos
 *     (front + API).
 *
 * Pra apps mais interativos (Trello, Figma, Slack), o caminho
 * usual hoje e SPA: front em React/Vue + API JSON. Voce vai
 * ver isso bastante daqui pra frente. Mas saber SSR e a base.
 * ============================================================
 */


const express = require("express");
const path = require("path");

const app = express();


// ────────────────────────────────────────────────────────────
// CONFIGURACAO DA VIEW ENGINE
// ────────────────────────────────────────────────────────────
//
// Duas linhas que ligam tudo:
//
//   1) "view engine" — qual template engine usar. O valor
//      "ejs" funciona porque o pacote ejs instalado tem hooks
//      que o Express consulta automaticamente.
//
//   2) "views" — onde estao os arquivos de template. Default e
//      ./views (relativo ao processo). Setar explicitamente com
//      path.join evita pegadinhas quando voce roda o app de
//      outro diretorio.
//
// Depois disso, res.render("nome") vai procurar
// ./views/nome.ejs e renderizar.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// "Banco" fake — em projeto real isso vem do model/banco.
const produtos = [
    { id: 1, nome: "Teclado mecanico", preco: 350 },
    { id: 2, nome: "Mouse gamer",      preco: 180 },
    { id: 3, nome: "Monitor 24''",     preco: 980 },
];


// ============================================================
// ROTAS
// ============================================================
//
// res.render(view, dados) faz a magica:
//   1. Localiza views/<view>.ejs
//   2. Executa o template passando `dados` como variaveis locais
//      do template (assim, no .ejs, voce usa <%= titulo %>).
//   3. Envia o HTML resultante como resposta — voce nao precisa
//      chamar res.send() nem setar Content-Type.

app.get("/", (req, res) => {
    res.render("home", {
        titulo: "Bem-vindo",
        produtos,
    });
});


app.get("/sobre", (req, res) => {
    res.render("sobre", {
        titulo: "Sobre",
    });
});


app.get("/produtos/:id", (req, res) => {
    const id = Number(req.params.id);
    const produto = produtos.find(p => p.id === id);

    if (!produto) {
        // res.status() encadeia com .render() normalmente.
        return res.status(404).render("404", { titulo: "Nao encontrado" });
    }

    res.render("produto", {
        titulo: produto.nome,
        produto,
    });
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
 *   1. Instala a engine     (npm install ejs)
 *   2. Configura            (app.set("view engine", "ejs"))
 *   3. Cria templates       (views/*.ejs)
 *   4. Renderiza            (res.render("nome", { dados }))
 *
 *   Use <%= var %> SEMPRE que possivel — ele escapa HTML e te
 *   protege de XSS automatico. So use <%- var %> quando voce
 *   tem CERTEZA que o conteudo ja e HTML seguro (ex.: include
 *   de outro template).
 *
 *   Reaproveite com <%- include('partials/header') %>. Isso
 *   elimina a duplicacao do header/footer em toda view.
 * ============================================================
 */
