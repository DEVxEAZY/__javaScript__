/**
 * ============================================================
 * EXPRESS — MIDDLEWARES + ROTAS + SQLite
 * ============================================================
 *
 * Complemento da aula 07: mesmo pipeline de middlewares do
 * server.js, mas com persistência real em SQLite (arquivo local).
 *
 * Como rodar:
 *   cd src/02_module/express/07_middlewares
 *   npm install
 *   npm run start:sqlite
 *
 * Abra:
 *   http://localhost:3001/                    (índice + links)
 *   http://localhost:3001/tarefas             (lista do banco)
 *   http://localhost:3001/tarefas/1           (uma tarefa)
 *   POST http://localhost:3001/tarefas        (JSON { "titulo": "..." })
 *   http://localhost:3001/admin               (401)
 *   http://localhost:3001/admin?token=42       (ok)
 *
 * Fluxo visual (sem subir servidor):
 *   middleware_sqlite_fluxo.html
 * ============================================================
 */

const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");

const PORTA = 3001;
const DB_PATH = path.join(__dirname, "tarefas.db");

// --- SQLite: arquivo local, zero config de servidor externo ---
const db = new Database(DB_PATH);
db.exec(`
  CREATE TABLE IF NOT EXISTS tarefas (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    feita  INTEGER NOT NULL DEFAULT 0
  );
`);
const count = db.prepare("SELECT COUNT(*) AS n FROM tarefas").get().n;
if (count === 0) {
  const insert = db.prepare("INSERT INTO tarefas (titulo, feita) VALUES (?, ?)");
  insert.run("Estudar middlewares", 0);
  insert.run("Rodar middleware_sqlite_fluxo.html", 0);
}

const app = express();

// 1) Body parsers — middlewares embutidos do Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) Logger global — roda em TODA request
app.use((req, res, next) => {
  const inicio = Date.now();
  console.log(`→ ${req.method} ${req.url}`);
  res.on("finish", () => {
    console.log(`← ${req.method} ${req.url} ${res.statusCode} (${Date.now() - inicio}ms)`);
  });
  next();
});

// 3) Injeta db no req — padrão comum: middleware prepara contexto
app.use((req, res, next) => {
  req.db = db;
  next();
});

// 4) Middleware DE ROTA — só em /admin/*
function autenticar(req, res, next) {
  if (req.query.token === "42") {
    req.user = { nome: "Admin" };
    return next();
  }
  res.status(401).send(`
    <h1>401 — Não autorizado</h1>
    <p>Middleware <code>autenticar</code> barrou antes de chegar na rota.</p>
    <p><a href="/admin?token=42">/admin?token=42</a></p>
  `);
}
app.use("/admin", autenticar);

// 5) Middleware POR HANDLER — validação só no POST /tarefas
function validarTarefa(req, res, next) {
  const titulo = (req.body.titulo || "").trim();
  if (titulo.length < 2) {
    return res.status(400).json({ erro: "titulo muito curto (mín. 2 caracteres)" });
  }
  req.tituloValidado = titulo;
  next();
}

// --- ROTAS ---

app.get("/", (req, res) => {
  res.send(`
    <h1>Middlewares + SQLite</h1>
    <p>Veja o terminal: cada request passa pelo logger e recebe <code>req.db</code>.</p>
    <ul>
      <li><a href="/tarefas">GET /tarefas</a> — SELECT no SQLite</li>
      <li><a href="/tarefas/1">GET /tarefas/1</a></li>
      <li><a href="/admin">GET /admin</a> (401 — middleware de rota)</li>
      <li><a href="/admin?token=42">GET /admin?token=42</a></li>
      <li><a href="/rota-inexistente">404 catch-all</a></li>
      <li><a href="/erro">GET /erro</a> — error handler</li>
    </ul>
    <p>POST /tarefas com JSON: <code>{ "titulo": "Nova tarefa" }</code></p>
    <p><a href="middleware_sqlite_fluxo.html">Abrir fluxo visual HTML</a></p>
  `);
});

app.get("/tarefas", (req, res) => {
  const rows = req.db.prepare("SELECT id, titulo, feita FROM tarefas ORDER BY id").all();
  res.json(rows);
});

app.get("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erro: "id inválido" });
  }
  const row = req.db.prepare("SELECT id, titulo, feita FROM tarefas WHERE id = ?").get(id);
  if (!row) {
    return res.status(404).json({ erro: "tarefa não encontrada" });
  }
  res.json(row);
});

app.post("/tarefas", validarTarefa, (req, res) => {
  const info = req.db
    .prepare("INSERT INTO tarefas (titulo) VALUES (?)")
    .run(req.tituloValidado);
  const criada = req.db
    .prepare("SELECT id, titulo, feita FROM tarefas WHERE id = ?")
    .get(info.lastInsertRowid);
  res.status(201).json(criada);
});

app.get("/admin", (req, res) => {
  res.send(`<h1>Admin</h1><p>Olá, ${req.user.nome}. Passou pelo middleware de rota.</p>`);
});

app.get("/erro", () => {
  throw new Error("Erro proposital para o middleware de 4 argumentos");
});

// 6) 404 — depois de todas as rotas
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 — Não encontrado</h1>
    <p>Nenhuma rota casou com <code>${req.method} ${req.url}</code>.</p>
  `);
});

// 7) Error handler — SEMPRE por último, 4 argumentos
app.use((err, req, res, next) => {
  console.error("ERRO:", err.message);
  res.status(500).send(`
    <h1>500 — Erro interno</h1>
    <p>O middleware de erro capturou: ${err.message}</p>
  `);
});

app.listen(PORTA, () => {
  console.log(`SQLite em ${DB_PATH}`);
  console.log(`Servidor em http://localhost:${PORTA}`);
});
