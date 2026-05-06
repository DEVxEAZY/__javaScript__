/**
 * ============================================================
 * SERVIDOR WEB BÁSICO COM EXPRESS
 * ============================================================
 *
 * Como instalar (UMA vez por pasta):
 *   cd src/02_module/express/01_servidor_basico
 *   npm install
 *   # (ou, se for criar do zero do zero:)
 *   # npm init -y
 *   # npm install express
 *
 * Como rodar:
 *   node server.js
 *
 * Como testar no navegador:
 *   http://localhost:3000/          → home
 *   http://localhost:3000/contato   → contato (GET)
 *   http://localhost:3000/sobre     → sobre
 *   http://localhost:3000/qualquer  → 404 "Cannot GET /qualquer"
 *
 * Como parar:
 *   Ctrl+C no terminal onde o servidor está rodando.
 *
 *
 * ============================================================
 * POR QUE EXPRESS E NÃO O `http` BUILT-IN?
 * ============================================================
 *
 * O Node já vem com um módulo nativo `http` capaz de criar
 * servidor web. Funciona, mas é VERBOSO: você mesmo precisa
 * fazer parsing de URL, separar método, lidar com headers,
 * cuidar de JSON, gerenciar middlewares… cada rota vira dezenas
 * de linhas de boilerplate.
 *
 * Express é um "micro-framework" — uma camada fina por cima do
 * `http` que cuida desse boilerplate pra você. No mundo real
 * (especialmente em APIs), Express ou seus primos (Fastify,
 * Koa, NestJS) é o que se usa. Reinventar a roda do `http`
 * direto raramente compensa.
 *
 *
 * ============================================================
 * O CICLO REQUISIÇÃO / RESPOSTA (request / response)
 * ============================================================
 *
 *   ┌────────────┐                          ┌─────────────┐
 *   │  CLIENTE   │ ──── REQUEST (req) ────▶ │  SERVIDOR   │
 *   │ (browser)  │                          │  (Express)  │
 *   │            │ ◀──── RESPONSE (res) ─── │             │
 *   └────────────┘                          └─────────────┘
 *
 * Toda interação com a web é esse vai-e-vem:
 *   1. O cliente (navegador, app, curl…) MANDA uma requisição
 *      pedindo algo: "me dá a página /sobre".
 *   2. O servidor RECEBE essa requisição, decide o que fazer,
 *      e MANDA uma resposta de volta: "aqui está, é HTML".
 *   3. Conexão fecha. Próxima ação = nova requisição.
 *
 * Por isso toda função de rota recebe `(req, res)`:
 *   • req → tudo o que o cliente mandou (URL, headers, body…)
 *   • res → o que vamos devolver pra ele.
 *
 *
 * ============================================================
 * CRUD E OS VERBOS HTTP
 * ============================================================
 *
 *   CRUD (operações típicas em qualquer aplicação)
 *     C reate   → criar       → método POST
 *     R ead     → ler         → método GET
 *     U pdate   → atualizar   → método PUT (ou PATCH)
 *     D elete   → apagar      → método DELETE
 *
 *   Quando você abre uma página no navegador, ele faz um GET
 *   por padrão. Quando envia um formulário com method="post",
 *   vira um POST. Cada verbo tem semântica diferente — o
 *   servidor pode tratar GET / e POST / como duas coisas
 *   completamente separadas (e neste arquivo, fazemos isso!).
 *
 *   Nesta aula focamos em GET e POST. PUT e DELETE virão
 *   quando construirmos uma API.
 * ============================================================
 */


// ────────────────────────────────────────────────────────────
// IMPORT — carregando o Express
// ────────────────────────────────────────────────────────────
//
// `express` é um pacote do npm. Como NÃO começa com "./" ou "/",
// o Node procura em node_modules (que foi populado quando
// rodamos `npm install`).
//
// O require devolve uma FUNÇÃO. Por convenção, guardamos em
// uma constante chamada `express` (mesmo nome do pacote). Você
// vai ver isso em qualquer tutorial — é o padrão da comunidade.
const express = require("express");

// Chamar `express()` cria uma INSTÂNCIA da aplicação. É essa
// instância que tem os métodos `.get`, `.post`, `.listen` etc.
// Por convenção a variável se chama `app`.
//
// Você pode ter várias `app` no mesmo processo (ex.: uma para
// API, outra para painel admin), mas em projetos pequenos é
// uma só.
const app = express();


// ────────────────────────────────────────────────────────────
// MIDDLEWARE — habilitando leitura de formulários POST
// ────────────────────────────────────────────────────────────
//
// Quando um <form method="post"> envia dados, eles chegam no
// CORPO da requisição (req.body) codificados como
// "application/x-www-form-urlencoded" (chave=valor&chave=valor).
//
// Por padrão, Express NÃO faz parsing desse corpo automaticamente
// — `req.body` viria undefined. O middleware abaixo liga essa
// funcionalidade. É uma linha que você quase sempre vai querer.
//
// `extended: true` permite estruturas aninhadas (objetos dentro
// de objetos no formulário). Para formulários simples tanto faz,
// mas é o que se usa por padrão.
//
// Se também for receber JSON (ex.: chamada de fetch/axios), o
// equivalente é app.use(express.json()) — ainda não usamos aqui,
// mas vale guardar.
app.use(express.urlencoded({ extended: true }));


// ============================================================
// 1. ROTA GET / — a "home" do site
// ============================================================
//
// Sintaxe geral:
//
//     app.METODO(CAMINHO, HANDLER)
//
//   • METODO  → get, post, put, delete, patch… (em minúsculo).
//   • CAMINHO → string que o cliente precisa pedir pra cair
//               aqui. "/" é a raiz; "/sobre" é uma subpágina.
//   • HANDLER → função (req, res) executada quando bate.
//
// Esta rota responde com HTML. `res.send` é esperto: detecta o
// tipo do que você manda e ajusta o header Content-Type:
//
//     res.send("texto")            → text/html (string)
//     res.send({ chave: "valor" }) → application/json (objeto)
//     res.send(Buffer.from(...))   → application/octet-stream
//
// O <form> embutido é só pra demonstrar o ciclo GET→POST mais
// pra baixo. Atributo action="/" diz "mande pra mesma rota /";
// method="post" muda o verbo de GET para POST.
app.get("/", (req, res) => {
    res.send(`
        <h1>Olá mundo!</h1>
        <p>Esta é a rota <strong>/</strong> (raiz do site).</p>
        <form action="/" method="post">
            <label>Seu nome: <input type="text" name="nome" /></label>
            <button type="submit">Enviar</button>
        </form>
        <hr />
        <p>Tente também: <a href="/sobre">/sobre</a> ou <a href="/contato">/contato</a></p>
    `);
});


// ============================================================
// 2. ROTA GET /sobre
// ============================================================
//
// Mesma lógica, caminho diferente. O Express faz a roteira
// internamente: olha o método+URL da requisição que chegou e
// chama o handler correspondente. Se nenhum bater, devolve 404
// "Cannot GET /xxx" automaticamente.
app.get("/sobre", (req, res) => {
    res.send("<h1>Sobre</h1><p>Página de exemplo do curso.</p>");
});


// ============================================================
// 3. ROTA GET /contato
// ============================================================
app.get("/contato", (req, res) => {
    res.send("<h1>Contato</h1><p>Obrigado por entrar em contato com a gente.</p>");
});


// ============================================================
// 4. ROTA POST / — recebendo o formulário da home
// ============================================================
//
// O <form> da rota GET / aponta para method="post" action="/".
// Ou seja, mesmo PATH ("/"), mas verbo diferente. Isso prova
// que GET / e POST / são DUAS rotas independentes — o Express
// roteia por (método + caminho), não só por caminho.
//
// Quando o usuário aperta "Enviar":
//   1. Navegador empacota os campos do form em URL-encoded
//      (ex.: "nome=Joao") e manda no corpo.
//   2. O middleware express.urlencoded() lá em cima parseia
//      e popula req.body como objeto: { nome: "Joao" }.
//   3. Aqui dentro acessamos req.body.nome direto.
//
// Se você esquecer o app.use(express.urlencoded(...)), req.body
// vem undefined e quebra com TypeError ao tentar ler .nome —
// armadilha clássica de quem está começando.
app.post("/", (req, res) => {
    // Fallback "(sem nome)" caso o usuário envie o form vazio.
    const nome = req.body.nome || "(sem nome)";
    res.send(`
        <h1>Recebi o formulário!</h1>
        <p>Olá, <strong>${nome}</strong>.</p>
        <p>Verbo HTTP usado: <code>POST</code> (note que a URL é a mesma "/").</p>
        <p><a href="/">Voltar</a></p>
    `);
});


// ============================================================
// 5. app.listen — pondo o servidor pra escutar
// ============================================================
//
// Até aqui só DESCREVEMOS as rotas; nada está rodando. listen()
// é o que efetivamente abre uma PORTA TCP no sistema operacional
// e fica esperando conexões.
//
//
// SOBRE PORTAS
// ────────────
// Uma "porta" é como um número de apartamento dentro do seu
// computador (que é o "endereço"). Cada processo que escuta
// requisições ocupa UMA porta — duas coisas não podem usar a
// mesma ao mesmo tempo.
//
// Faixas comuns:
//   1–1023      → reservadas pelo sistema (HTTP=80, HTTPS=443,
//                 SSH=22…). Em Linux/Mac precisam de root.
//   1024–49151  → registradas. 3000, 3306, 5432, 8080 etc.
//   49152–65535 → efêmeras (escolhidas pelo SO).
//
// 3000 é convencional pra desenvolvimento Node/Express. Outras
// igualmente populares: 3333, 4000, 5000, 8000, 8080.
//
// Se você ver erro "EADDRINUSE: address already in use :::3000",
// significa que JÁ TEM algo nessa porta. Possíveis causas:
//   • Outro server seu rodando que você esqueceu (Ctrl+C nele).
//   • Outro app usando 3000 (sair ou trocar pra outra porta).
//   • Servidor anterior travou e o SO ainda não liberou.
//
//
// localhost vs 127.0.0.1
// ─────────────────────
// Os dois apontam pra "este mesmo computador". `localhost` é
// um nome amigável que o SO mapeia pra 127.0.0.1 via /etc/hosts
// (ou C:\Windows\System32\drivers\etc\hosts no Windows).
//
//
// CALLBACK DO listen
// ─────────────────
// O segundo argumento é uma função que dispara assim que o
// servidor está pronto pra aceitar conexões. Ótimo lugar pra
// imprimir a URL — assim o terminal vira clicável no VS Code.
const PORTA = 3000;

app.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`);
    console.log("Pressione Ctrl+C para parar.");
});


/**
 * ============================================================
 * COMO PARAR / REINICIAR
 * ============================================================
 *
 *   • Ctrl+C no terminal: encerra o processo do Node, libera
 *     a porta. É o padrão pra qualquer processo de longa
 *     duração no terminal.
 *
 *   • A cada mudança no código, você precisa parar (Ctrl+C)
 *     e rodar `node server.js` de novo. Cansativo!
 *
 *   • SOLUÇÃO (próxima aula): instalar `nodemon` como dev
 *     dependency. Ele observa os arquivos e reinicia o server
 *     automaticamente a cada save. Equivalente do hot-reload
 *     do front-end:
 *         npm install --save-dev nodemon
 *         npx nodemon server.js
 *
 *
 * ============================================================
 * INSPECIONANDO REQUISIÇÕES NO NAVEGADOR
 * ============================================================
 *
 * Abra o DevTools (F12) → aba "Network" → recarregue a página.
 * Pra cada request feita, você vê:
 *   • Method (GET, POST, etc.)
 *   • Status (200, 404, 500…)
 *   • Headers (request e response)
 *   • Payload (o que foi enviado no body)
 *   • Response (o que o servidor devolveu)
 *
 * É a melhor ferramenta pra DEBUGAR API: você vê exatamente
 * o que sai e o que volta. Acostumar-se com a aba Network é
 * obrigatório pra qualquer dev web.
 *
 *
 * ============================================================
 * TRÊS FORMAS DE EXECUTAR (e qual evitar)
 * ============================================================
 *
 *   1. Botão Play/Run do VS Code
 *      → roda, mas o output fica num "Output" estranho e
 *      é fácil esquecer que o processo continua vivo. EVITE.
 *
 *   2. Terminal integrado do VS Code (`node server.js`)
 *      → bom, fica num painel ali do lado do código.
 *
 *   3. Terminal externo do sistema (PowerShell/Bash)
 *      → o que o instrutor prefere. Vantagem: você sabe
 *      EXATAMENTE qual processo está rodando, e parar é só
 *      Ctrl+C na janela. Recomendado quando estiver fazendo
 *      muitos restarts (até instalar nodemon).
 *
 *
 * ============================================================
 * RESUMO MENTAL
 * ============================================================
 *
 *   ESTRUTURA MÍNIMA DE UM APP EXPRESS
 *     1. require("express")           → carrega o pacote
 *     2. const app = express()        → cria a instância
 *     3. app.use(middleware)          → opcional: parsers, logs…
 *     4. app.METODO(rota, handler)    → define cada rota
 *     5. app.listen(porta, callback)  → começa a escutar
 *
 *   HANDLER DE ROTA
 *     (req, res) => {
 *         // ler dados da requisição:  req.body, req.query,
 *         //                           req.params, req.headers
 *         // mandar resposta:          res.send, res.json,
 *         //                           res.status, res.redirect
 *     }
 *
 *   ARMADILHAS
 *     • Esquecer express.urlencoded() → req.body undefined.
 *     • Não parar o server velho      → EADDRINUSE na porta.
 *     • Mandar resposta DUAS vezes    → "headers already sent".
 *     • Esperar reload automático     → não rola sem nodemon.
 *     • Usar o botão Play do VS Code  → processos zumbis.
 * ============================================================
 */
