/**
 * ============================================================
 * LAB AUTH REFERENCIA — Express + Postgres + Sessao + bcrypt
 * ============================================================
 *
 * Codigo de referencia do modulo auth/ — leia os comentarios no codigo
 * e a documentacao em ../README.md (modulo) e README.md (desta pasta).
 *
 * Como rodar:
 *   cd src/02_module/auth/lab_auth_referencia
 *   cp .env.example .env          # DATABASE_URL + SESSION_SECRET
 *   npm install
 *   psql "$DATABASE_URL" -f src/sql/schema.sql   # ou SQL Editor Supabase/Neon
 *   npm start
 *
 * Teste rapido (curl ou Postman — guarde cookie connect.sid):
 *   POST http://localhost:3000/cadastro  {"email":"a@b.com","senha":"12345678","nome":"Ana"}
 *   POST http://localhost:3000/login     {"email":"a@b.com","senha":"12345678"}
 *   GET  http://localhost:3000/painel    (com cookie)
 *   POST http://localhost:3000/logout
 *
 * Helmet + CSRF (formularios HTML):
 *   NAO duplicamos a stack completa aqui — veja express/08_mongodb_session_seguranca/
 *   Bloco comentado abaixo mostra onde encaixar helmet + csurf se migrar para EJS.
 *
 * ============================================================
 * ORDEM DOS MIDDLEWARES
 * ============================================================
 *
 *   express.json / urlencoded     <- parse do body
 *   express-session (+ pg store)  <- cookie connect.sid
 *   injetarUsuario                <- res.locals.usuario (padrao views)
 *   rotas /cadastro, /login, /painel
 *   404
 *   handler de erro
 *
 * Se adicionar helmet + csurf (express/08):
 *   helmet -> parsers -> session -> csurf -> injetarUsuario -> rotas
 * ============================================================
 */

"use strict";

require("dotenv").config();

// ============================================================
// VALIDACAO DE AMBIENTE — Postgres obrigatorio neste lab
// ============================================================
//
// Os HTML em auth/ funcionam sem banco; este lab e opcional e exige
// DATABASE_URL. Free tier: Supabase ou Neon (ver README.md).
// Checamos ANTES de require("./src/db/pool") — pool.js falha se URI ausente.
const DATABASE_URL = process.env.DATABASE_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!DATABASE_URL) {
    console.error(
        "✗ DATABASE_URL nao definida.\n" +
            "  Copie .env.example para .env e cole a connection string do Postgres.\n" +
            "  Supabase: Settings > Database > URI\n" +
            "  Neon: Dashboard > Connection string"
    );
    process.exit(1);
}

const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const pool = require("./src/db/pool");
const injetarUsuario = require("./src/middlewares/injetarUsuario");
const authRoutes = require("./src/routes/auth");
const protegidaRoutes = require("./src/routes/protegida");

const app = express();

if (!SESSION_SECRET || SESSION_SECRET === "troque-isso-por-um-segredo-longo-em-producao") {
    console.warn(
        "⚠ SESSION_SECRET padrao ou vazio — OK em dev local, troque em producao."
    );
}

const ehProducao = process.env.NODE_ENV === "production";

// ============================================================
// HELMET + CSRF — opcional (comentado)
// ============================================================
//
// Para forms HTML com cookie de sessao, copie o bloco de express/08:
//   const helmet = require("helmet");
//   const csrf = require("csurf");
//   app.use(helmet({ contentSecurityPolicy: ehProducao, hsts: ehProducao }));
//   ... session ...
//   app.use(csrf());
//   ... injetarLocals com csrfToken ...
// Ver: express/08_mongodb_session_seguranca/server.js L117–218

// ============================================================
// PARSERS
// ============================================================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ============================================================
// SESSAO + STORE NO POSTGRES (connect-pg-simple)
// ============================================================
//
// Por que persistir sessao no Postgres?
//   Memoria do processo perde tudo no restart e nao compartilha entre
//   instancias. pg store sobrevive restart e funciona com o mesmo banco
//   que ja usamos para usuarios (lab simples; Redis e comum em escala).
//
// createTableIfMissing: true cria tabela "session" automaticamente.
app.use(
    session({
        secret: SESSION_SECRET || "dev-secret-apenas-local",
        resave: false,
        saveUninitialized: false,
        store: new pgSession({
            pool,
            tableName: "session",
            createTableIfMissing: true,
        }),
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: ehProducao,
            sameSite: "lax",
        },
    })
);

app.use(injetarUsuario);

// ============================================================
// ROTAS
// ============================================================
app.get("/", (_req, res) => {
    res.json({
        lab: "auth_referencia",
        rotas: {
            cadastro: "POST /cadastro",
            login: "POST /login",
            logout: "POST /logout",
            painel: "GET /painel (requer sessao)",
        },
        docs: "../README.md",
    });
});

app.use("/", authRoutes);
app.use("/", protegidaRoutes);

// ============================================================
// 404
// ============================================================
app.use((_req, res) => {
    res.status(404).json({ erro: "Rota nao encontrada." });
});

// ============================================================
// HANDLER DE ERRO
// ============================================================
app.use((err, _req, res, _next) => {
    // Se ativar csurf (express/08): if (err.code === "EBADCSRFTOKEN") ...
    console.error(err);
    res.status(500).json({ erro: "Erro interno." });
});

// ============================================================
// START — testa conexao antes de listen
// ============================================================
const PORTA = Number(process.env.PORTA) || 3000;

pool
    .query("SELECT 1")
    .then(() => {
        console.log("✓ Postgres conectado");
        app.listen(PORTA, () => {
            console.log(`Servidor em http://localhost:${PORTA}`);
        });
    })
    .catch((err) => {
        console.error("✗ Falha ao conectar no Postgres:", err.message);
        process.exit(1);
    });
