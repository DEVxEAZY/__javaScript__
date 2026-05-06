/**
 * ============================================================
 * EXPRESS + MONGODB + SESSION + FLASH + HELMET + CSRF
 *                              (Aulas 138 — 146)
 * ============================================================
 *
 * Como rodar:
 *   cd src/02_module/express/08_mongodb_session_seguranca
 *   cp .env.example .env        # ajuste MONGO_URI/SESSION_SECRET
 *   npm install
 *   npm start
 *
 * Abra:
 *   http://localhost:3000/produtos
 *   http://localhost:3000/produtos/novo
 *
 *
 * ============================================================
 * MAPA DAS AULAS
 * ============================================================
 *   138 Servidor MongoDB (local) — alternativa: Atlas + Compass
 *   139 Atlas/Compass quando o local da problema
 *   140 Mongoose: conexao + primeiro Model        (./models)
 *   141 Erros do connect-mongo (versao desatualizada -> use 5.x)
 *   142 express-session + connect-flash
 *   143 connect-mongo correto: { mongoUrl } em vez de { mongooseConnection }
 *   144 Injetar dados em todas as views via res.locals
 *   145 helmet + csurf
 *   146 Em localhost o Helmet pode quebrar HMR/dev — cuide das
 *       politicas (CSP, HSTS) ou desligue em ambiente local.
 *
 *
 * ============================================================
 * ORDEM DOS MIDDLEWARES — IMPORTANTISSIMO
 * ============================================================
 *
 *   helmet                                    ← primeiro: headers
 *   express.urlencoded / express.json         ← parse do body
 *   express.static                            ← assets (escapam de CSRF)
 *   express-session                           ← cookie da sessao
 *   connect-flash                             ← depende de session
 *   csurf                                     ← depende de session
 *   injetarLocals (flash + csrfToken em res.locals)
 *   rotas
 *   404
 *   handler de erro
 *
 * Trocar a ordem geralmente nao "explode", mas faz feature
 * silenciosamente nao funcionar (flash sumindo, CSRF rejeitando
 * tudo, etc.). A regra geral: cada middleware depende do que
 * vem ANTES dele.
 * ============================================================
 */

require("dotenv").config();

const path           = require("path");
const express        = require("express");
const mongoose       = require("mongoose");
const session        = require("express-session");
const MongoStore     = require("connect-mongo");
const flash          = require("connect-flash");
const helmet         = require("helmet");
const csrf           = require("csurf");

const injetarLocals  = require("./middlewares/injetarLocals");
const produtosRoutes = require("./routes/produtos");

const app = express();


// ============================================================
// 1) CONEXAO COM O MONGO            (Aulas 140, 141, 143)
// ============================================================
//
// mongoose.connect retorna uma Promise — fazemos o connect ANTES
// de chamar app.listen. Em dev voce pode at-startup; em prod
// muitos times preferem iniciar o servidor mesmo sem Mongo
// pronto e tratar reconexao por evento.
//
// Em caso de erro tipico (Atlas IP nao liberado, senha errada,
// porta 27017 fechada): a stack do Mongoose e bem clara — leia
// a primeira linha em vez de googlar a stack inteira.
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/aulas";

mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✓ MongoDB conectado"))
    .catch((err) => {
        console.error("✗ Falha ao conectar no Mongo:", err.message);
        process.exit(1);
    });


// ============================================================
// 2) VIEW ENGINE                                  (Aula 144)
// ============================================================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// ============================================================
// 3) HELMET                                       (Aula 145, 146)
// ============================================================
//
// helmet() adiciona headers HTTP de seguranca: X-Content-Type-
// Options, X-Frame-Options, Strict-Transport-Security (HSTS),
// Content-Security-Policy (CSP), entre outros. E o setup
// minimo recomendado pra qualquer app web.
//
// Aula 146 — "EVITE em localhost": a CSP padrao do Helmet bloqueia
// scripts/styles inline e recursos de outras origens, o que pode
// quebrar paginas em dev (CDNs, hot reload, ferramentas embutidas).
// Em dev voce normalmente:
//   • Desliga a CSP local      (contentSecurityPolicy: false), ou
//   • Customiza as directives  pra liberar o que precisa.
const ehProducao = process.env.NODE_ENV === "production";
app.use(
    helmet({
        // Em localhost, HSTS pode "lockar" o browser em https e
        // confundir dev. Por isso so ligamos em prod.
        contentSecurityPolicy: ehProducao,
        hsts: ehProducao,
    })
);


// ============================================================
// 4) PARSERS DE BODY E ESTATICOS
// ============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


// ============================================================
// 5) SESSION + STORE NO MONGO          (Aulas 141, 142, 143)
// ============================================================
//
// Por que Mongo como store?
//   Sem store, a sessao fica em memoria do processo. Ao reiniciar
//   o servidor TODO MUNDO perde sessao; pior, em multiplos
//   processos cada um tem sua memoria propria. Persistir num
//   storage externo (Mongo, Redis...) resolve.
//
// connect-mongo 5.x — API moderna:
//   MongoStore.create({ mongoUrl: "..." })
//
// Versoes antigas (3.x) usavam { mongooseConnection: ... } e e a
// causa #1 de tutoriais quebrados (a aula 141 cita esse erro).
// Se aparecer "MongoStore is not a constructor" voce esta misturando
// API antiga com import novo: confira o package.json.
app.use(
    session({
        secret: process.env.SESSION_SECRET || "dev-secret",
        resave: false,             // nao re-salva se nada mudou
        saveUninitialized: false,  // nao cria sessao vazia pra todo visitante
        store: MongoStore.create({
            mongoUrl: MONGO_URI,
            collectionName: "sessions",
            ttl: 60 * 60 * 24 * 7, // 7 dias (em segundos)
        }),
        cookie: {
            httpOnly: true,                          // bloqueia JS lendo via document.cookie
            maxAge:   1000 * 60 * 60 * 24 * 7,       // 7 dias (em ms)
            secure:   ehProducao,                    // so em https em prod
            sameSite: "lax",                         // mitiga CSRF
        },
    })
);


// ============================================================
// 6) FLASH MESSAGES                               (Aula 142)
// ============================================================
//
// req.flash("chave", "msg")  → guarda
// req.flash("chave")          → le E LIMPA
//
// O ciclo classico e:
//   POST /produtos
//     -> grava no Mongo
//     -> req.flash("sucesso", "Salvo!")
//     -> res.redirect("/produtos")
//   GET /produtos (ja noutra request)
//     -> middleware le req.flash("sucesso") pra res.locals
//     -> view exibe e some
app.use(flash());


// ============================================================
// 7) CSRF                                         (Aula 145)
// ============================================================
//
// CSRF (Cross-Site Request Forgery): site malicioso embute um
// <form action="https://seu-app/produtos" method="POST"> e usa a
// SUA sessao logada pra fazer acoes em seu nome.
//
// Defesa: em todo POST/PUT/DELETE exigir um token unico por
// sessao que so o seu HTML legitimo conhece. csurf gera o token
// (req.csrfToken()) e valida em requests mutantes.
//
// Como ativar em UM form:
//   <input type="hidden" name="_csrf" value="<%= csrfToken %>">
//
// Em APIs JSON puras (sem cookie) voce normalmente NAO precisa
// de CSRF — basta autenticar via Authorization header. Aqui temos
// formularios HTML, entao precisamos.
app.use(csrf());


// ============================================================
// 8) INJETAR LOCALS (flash, csrfToken, ...)       (Aula 144)
// ============================================================
//
// Vem DEPOIS de session/flash/csurf — porque le coisas que esses
// middlewares produzem.
app.use(injetarLocals);


// ============================================================
// 9) ROTAS
// ============================================================
app.get("/", (req, res) => res.redirect("/produtos"));
app.use("/produtos", produtosRoutes);


// ============================================================
// 10) 404
// ============================================================
app.use((req, res) => {
    res.status(404).render("404", { titulo: "Nao encontrado" });
});


// ============================================================
// 11) HANDLER DE ERRO (4 args)
// ============================================================
//
// Casos importantes que caem aqui:
//   • Token CSRF invalido  →  err.code === "EBADCSRFTOKEN"
//   • Erro de conexao com o Mongo durante uma operacao
//   • Validacao Mongoose nao tratada no controller
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).send(
            "Sessao invalida ou formulario expirado. Volte e tente de novo."
        );
    }
    console.error(err);
    res.status(500).send("Erro interno");
});


const PORTA = Number(process.env.PORTA) || 3000;
app.listen(PORTA, () => {
    console.log(`Servidor em http://localhost:${PORTA}`);
});


/**
 * ============================================================
 * RESUMO MENTAL
 * ============================================================
 *
 *   MongoDB / Mongoose
 *     - mongoose.connect(URI)         -> abre pool de conexao
 *     - mongoose.Schema + .model()    -> ganha validacao, hooks
 *     - timestamps: true              -> createdAt/updatedAt automatico
 *
 *   Session + connect-mongo
 *     - cookie httpOnly + sameSite    -> defesa basica
 *     - store em Mongo                -> sobrevive a restart e multi-proc
 *     - connect-mongo 5.x usa { mongoUrl }  (NAO { mongooseConnection })
 *
 *   Flash
 *     - req.flash(chave, msg)         no POST
 *     - req.flash(chave)              le e limpa no GET seguinte
 *     - injete em res.locals pra view ler de graca
 *
 *   Helmet
 *     - 1 linha = pacote inteiro de headers de seguranca
 *     - em DEV cuide do CSP/HSTS, podem atrapalhar (Aula 146)
 *
 *   CSRF
 *     - todo form HTML precisa de <input name="_csrf">
 *     - APIs JSON com auth por header geralmente nao precisam
 *     - erro EBADCSRFTOKEN -> trate no error handler
 * ============================================================
 */
