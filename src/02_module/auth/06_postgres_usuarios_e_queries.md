# 06 — Postgres: usuários, login e queries parametrizadas

Modelo relacional mínimo para autenticação **sem** ORM — alinhado ao que você faria com `pg` / `node-postgres` em Express.

> Não é necessário Postgres rodando para estudar: use [`postgres_fluxo.html`](postgres_fluxo.html) e os snippets abaixo.

---

## Schema

```sql
CREATE TABLE usuarios (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  nome       TEXT NOT NULL,
  criado_em  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_usuarios_email ON usuarios (email);
```

| Coluna | Papel |
|--------|-------|
| `email` | Identificador de login — único |
| `senha_hash` | Saída de `bcrypt.hash` — nunca a senha crua |
| `nome` | Exibição no painel |

Migrations: em produção use ferramenta (`node-pg-migrate`, Prisma migrate, Supabase SQL editor) — aqui só o SQL conceitual.

---

## Cadastro (fluxo numerado)

1. Browser `POST /cadastro` com `email`, `senha`, `nome`.
2. Controller normaliza e-mail.
3. `bcrypt.hash(senha, 12)` → `senha_hash`.
4. `INSERT` parametrizado.
5. Redirect para `/login` ou login automático.

```js
await pool.query(
  `INSERT INTO usuarios (email, senha_hash, nome) VALUES ($1, $2, $3)`,
  [emailNormalizado, senha_hash, nome]
);
```

---

## Login

```js
const { rows } = await pool.query(
  "SELECT id, email, senha_hash, nome FROM usuarios WHERE email = $1",
  [emailNormalizado]
);

const ok = await bcrypt.compare(senha, rows[0]?.senha_hash);
```

| Resultado | Comportamento seguro |
|-----------|----------------------|
| 0 rows | Mesma mensagem que senha errada |
| compare false | “Credenciais inválidas” |
| compare true | `session.regenerate` + `req.session.usuario = { id, nome }` |

---

## Rota protegida

```js
function exigirLogin(req, res, next) {
  if (!req.session?.usuario?.id) {
    return res.redirect("/login?next=" + encodeURIComponent(req.originalUrl));
  }
  next();
}

app.get("/painel", exigirLogin, painelController.index);
```

---

## SQL injection — vulnerável vs seguro

**Vulnerável (nunca):**

```js
// ATACANTE: email = "' OR '1'='1"
await pool.query(
  `SELECT * FROM usuarios WHERE email = '${email}'`
);
```

**Seguro:**

```js
await pool.query(
  "SELECT id, senha_hash FROM usuarios WHERE email = $1",
  [email]
);
```

O driver envia parâmetros **separados** do comando SQL. Teste o contraste em [`postgres_fluxo.html`](postgres_fluxo.html) → cenário “Ataque SQL injection”.

---

## Contraste com Mongo (este repo)

| | Mongoose (`mongoDB/`, `express/08`) | Postgres |
|---|-------------------------------------|----------|
| Unidade | Documento `{ email, senhaHash }` | Linha em `usuarios` |
| Busca | `Usuario.findOne({ email })` | `WHERE email = $1` |
| Injeção | NoSQL injection em `$where` mal usado | SQL injection em concatenação |

---

## Pool de conexão

```js
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
});
```

`DATABASE_URL` só no `.env` — nunca no Git.

---

## Próximo

- Visual: [`postgres_fluxo.html`](postgres_fluxo.html)
- BaaS: [`07_supabase_auth_postgres_rls.md`](07_supabase_auth_postgres_rls.md)
