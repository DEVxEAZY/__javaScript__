/**
 * ============================================================
 * EXPRESS — ROUTER e CONTROLLERS
 * ============================================================
 *
 * Como rodar:
 *   cd src/02_module/express/03_router_e_controllers
 *   npm install
 *   node server.js
 *
 * Abra:
 *   http://localhost:3000/
 *   http://localhost:3000/produtos
 *   http://localhost:3000/produtos/1
 *   http://localhost:3000/usuarios
 *
 *
 * ============================================================
 * O PROBLEMA: server.js gigante
 * ============================================================
 *
 * No exercicio anterior tudo cabia num server.js so. Mas ai
 * voce adiciona /produtos, /produtos/:id, POST /produtos,
 * /usuarios, /usuarios/:id, /pedidos, /login, /logout, /admin/...
 *
 * Em poucas semanas voce tem um server.js de 800 linhas onde
 * tudo se mistura. Difi de achar coisa, conflitos no git,
 * mudar uma rota assusta porque voce nao sabe o que mais ela
 * pode quebrar.
 *
 * SOLUCAO: separar a aplicacao em PEDACOS por dominio.
 *
 *
 * ============================================================
 * ROUTER  —  agrupando rotas por contexto
 * ============================================================
 *
 *   const router = express.Router();
 *
 * Cria um "mini-app" Express. Tem os mesmos metodos (.get, .post,
 * .use, etc.), mas e PLUGAVEL: voce pode "encaixar" ele no app
 * principal num PREFIXO especifico:
 *
 *   app.use("/produtos", produtosRouter);
 *
 * ↑ tudo que produtosRouter define como "/" passa a viver em
 *   "/produtos", "/" → "/produtos", "/:id" → "/produtos/:id".
 *
 * Ganhos:
 *   • Cada arquivo cuida de UM dominio (produtos, usuarios...).
 *   • server.js vira um indice: "tem rotas em /produtos,
 *     /usuarios, /pedidos..." e pronto.
 *   • Trocar o prefixo (versao da API, por exemplo) fica trivial:
 *         app.use("/v2/produtos", produtosRouter);
 *
 *
 * ============================================================
 * CONTROLLER  —  separando a LOGICA da rota
 * ============================================================
 *
 * Mesmo dentro de um router, misturar "como chega" (path, verbo)
 * com "o que faz" (logica) atrapalha. O padrao MVC simplificado:
 *
 *   ROTA (router) → diz que GET /produtos/:id chama tal funcao.
 *   CONTROLLER    → essa funcao. Le req, monta resposta.
 *   MODEL         → (proxima aula) acesso a dados/banco.
 *
 * Ai cada um faz uma coisa so. Pra TESTAR a logica voce nem
 * precisa subir o servidor: importa o controller direto.
 *
 *
 * ============================================================
 * ESTRUTURA DESTA AULA
 * ============================================================
 *
 *   server.js                          ← este arquivo (so monta tudo)
 *   routes/produtos.js                 ← Router de produtos
 *   routes/usuarios.js                 ← Router de usuarios
 *   controllers/produtosController.js  ← logica de produtos
 *   controllers/usuariosController.js  ← logica de usuarios
 * ============================================================
 */


const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ────────────────────────────────────────────────────────────
// IMPORT dos routers
// ────────────────────────────────────────────────────────────
//
// Os caminhos comecam com "./" porque sao MODULOS LOCAIS (nao
// pacotes do node_modules). O Node resolve isso pra
// ./routes/produtos.js automaticamente.
const produtosRouter = require("./routes/produtos");
const usuariosRouter = require("./routes/usuarios");


// ────────────────────────────────────────────────────────────
// "MONTAGEM" dos routers no app
// ────────────────────────────────────────────────────────────
//
// app.use(prefixo, router) faz o "encaixe". A partir daqui:
//
//   GET  /produtos       → produtosRouter trata como "/"
//   GET  /produtos/42    → produtosRouter trata como "/:id"
//   POST /produtos       → produtosRouter trata como "/"
//
// Voce nao precisa mexer nos arquivos de router se quiser mudar
// o prefixo — e so trocar aqui.
app.use("/produtos", produtosRouter);
app.use("/usuarios", usuariosRouter);


// Home — so um indice manual pra navegar
app.get("/", (req, res) => {
    res.send(`
        <h1>Router e Controllers</h1>
        <ul>
            <li><a href="/produtos">/produtos</a> (lista)</li>
            <li><a href="/produtos/1">/produtos/1</a> (detalhe)</li>
            <li><a href="/usuarios">/usuarios</a> (lista)</li>
            <li><a href="/usuarios/1">/usuarios/1</a> (detalhe)</li>
        </ul>
        <p>Veja <code>routes/</code> e <code>controllers/</code> pra entender
        como cada pedaco esta separado.</p>
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
 *   ROUTER     = mini-app Express, plugado num prefixo.
 *   CONTROLLER = funcao que sabe lidar com (req, res).
 *
 *   server.js fica magrinho — so monta routers.
 *   routes/X.js faz o "mapa": qual verbo+path chama qual funcao.
 *   controllers/X.js implementa cada funcao.
 *
 *   Na proxima evolucao do projeto entram MODELS (dados/banco)
 *   e o controller passa a delegar pra eles. MVC classico.
 * ============================================================
 */
