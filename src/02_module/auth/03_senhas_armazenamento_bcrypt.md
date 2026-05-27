# 03 — Senhas: armazenamento com bcrypt

Senha **nunca** vai para o banco em texto puro. O servidor guarda um **hash** irreversível (na prática) e compara no login com `bcrypt.compare`.

---

## Cadastro

```
plaintext (form)  →  bcrypt.hash(senha, rounds)  →  coluna senha_hash
```

Exemplo (Express + `bcryptjs` ou `bcrypt`):

```js
const bcrypt = require("bcryptjs");
const ROUNDS = 12;

async function cadastrar(req, res) {
  const { email, senha, nome } = req.body;
  const emailNormalizado = String(email).trim().toLowerCase();

  const senha_hash = await bcrypt.hash(senha, ROUNDS);

  await pool.query(
    `INSERT INTO usuarios (email, senha_hash, nome) VALUES ($1, $2, $3)`,
    [emailNormalizado, senha_hash, nome]
  );

  return res.redirect("/login");
}
```

| Ponto | Detalhe |
|-------|---------|
| `ROUNDS` (cost) | Maior = mais lento para atacante e para seu servidor; 10–12 é comum em 2024+ |
| Normalizar e-mail | `trim` + `toLowerCase` evita duplicata `User@x.com` vs `user@x.com` |

---

## Login

```js
const { rows } = await pool.query(
  "SELECT id, email, senha_hash, nome FROM usuarios WHERE email = $1",
  [emailNormalizado]
);

const usuario = rows[0];
const senhaOk = usuario && (await bcrypt.compare(senha, usuario.senha_hash));

if (!senhaOk) {
  return res.status(401).render("login", {
    erro: "Credenciais inválidas",
  });
}

// AuthN ok — gravar sessão (ver 04_)
req.session.regenerate((err) => {
  if (err) return next(err);
  req.session.usuario = { id: usuario.id, nome: usuario.nome };
  res.redirect("/painel");
});
```

**Mensagem única:** “Credenciais inválidas” tanto para e-mail inexistente quanto para senha errada — impede **enumeração de usuários**.

---

## O que não fazer

| Anti-padrão | Por quê |
|-------------|---------|
| `senha === usuario.senha` | Expõe timing e raramente há senha em claro no banco |
| MD5 / SHA1 “rápido” | Quebrável com rainbow tables / GPU |
| Hash sem salt | bcrypt já embute salt por design |
| Logar `req.body.senha` | Vazamento em logs/agregadores |

---

## Pepper (opcional)

Segredo extra em `process.env.PEPPER` concatenado antes do hash. **Não substitui** bcrypt — só adiciona camada se o dump do banco vazar sem o pepper do servidor.

---

## Timing

Use sempre `bcrypt.compare` do pacote. Não compare strings de hash manualmente para “otimizar”.

---

## Mongo vs Postgres neste repo

| | Mongo (`express/08` + Mongoose) | Postgres (`06_`) |
|---|--------------------------------|------------------|
| Campo | `senha` ou `senhaHash` no Schema | `senha_hash TEXT` |
| Query login | `Usuario.findOne({ email })` | `SELECT ... WHERE email = $1` |

Lab Mongo: [`mongoDB/lab_dotenv_mongoose/`](../mongoDB/lab_dotenv_mongoose/). Login prático opcional: [`express/08/__test__/02-login-com-sessao.md`](../express/08_mongodb_session_seguranca/__test__/02-login-com-sessao.md).

Visualize cadastro/login: [`postgres_fluxo.html`](postgres_fluxo.html).

Próximo: [`04_sessoes_cookies_express.md`](04_sessoes_cookies_express.md).
