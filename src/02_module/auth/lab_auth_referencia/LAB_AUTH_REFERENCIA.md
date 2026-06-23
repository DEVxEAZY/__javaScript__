# Lab Auth Referência (código ↔ conceitos)

Este laboratório é a **implementação executável** dos capítulos `03`–`04` e da seção de sessão Postgres em [09_arquitetura_auth_profissional.md](../09_arquitetura_auth_profissional.md). Não reimplementa Helmet/CSRF — isso fica em [`express/08_mongodb_session_seguranca/`](../../express/08_mongodb_session_seguranca/).

**Como rodar:** [README.md](README.md).

---

## Mapa conceito → arquivo → linha de raciocínio

| Conceito (doc `09`) | Onde no lab | O que observar |
|---------------------|-------------|----------------|
| **SQL parametrizado** | `src/controllers/authController.js` | `INSERT`/`SELECT` com `$1`, `$2` — nunca concatena `email` na string SQL |
| **Hash bcrypt (cost 12)** | `authController.cadastrar` | `bcrypt.hash(senha, BCRYPT_ROUNDS)` antes do `INSERT` |
| **AuthN no login** | `authController.login` | `bcrypt.compare` só após `SELECT` por e-mail normalizado |
| **Anti-enumeração** | `login` + `cadastrar` (catch `23505`) | Mesma mensagem para credenciais inválidas; cadastro duplicado genérico |
| **Session fixation** | `authController.login` | `req.session.regenerate()` **antes** de `req.session.usuario = {...}` |
| **O que vai na sessão** | `req.session.usuario` | Só `id`, `nome`, `email` — sem senha/hash |
| **Logout completo** | `authController.logout` | `session.destroy` + `clearCookie('connect.sid')` |
| **AuthZ mínima** | `src/middlewares/exigirLogin.js` | 401 JSON se não há `req.session.usuario.id` |
| **Rate limit login** | `src/middlewares/rateLimitLogin.js` | Aplicado na rota `POST /login` em `src/routes/auth.js` |
| **Sessão persistida** | `server.js` | `connect-pg-simple` — store na mesma base que `usuarios` |
| **Cookie seguro** | `server.js` (bloco `session`) | `httpOnly`, `sameSite: 'lax'`, `secure` em `NODE_ENV=production` |
| **`saveUninitialized: false`** | `server.js` | Não cria sessão vazia para visitante anônimo |
| **Ordem de middlewares** | Comentários no topo de `server.js` | parsers → session → `injetarUsuario` → rotas |
| **Helmet + CSRF** | Comentário em `server.js` L85–96 | Copiar de `express/08` se migrar para EJS/forms HTML |

---

## Roteiro sugerido (30–45 min)

1. Leia [09_arquitetura_auth_profissional.md](../09_arquitetura_auth_profissional.md) §3.1–3.3 (registro, login, logout).
2. Abra `src/sql/schema.sql` — tabela `usuarios` e índice único em `email`.
3. Siga `authController.js` na ordem: `cadastrar` → `login` → `logout`.
4. Rode os curls do [README.md](README.md); no DevTools → Application → Cookies, veja `connect.sid` após login.
5. `GET /painel` sem cookie → 401; com cookie → JSON do usuário.
6. Compare com [postgres_fluxo.html](../postgres_fluxo.html) (mesmo fluxo, sem Node).
7. Para camada Helmet/CSRF: abra `express/08/server.js` lado a lado com o bloco comentado deste `server.js`.

---

## O que este lab **não** cobre (propositalmente)

| Tópico | Onde estudar |
|--------|----------------|
| JWT access/refresh | [05_jwt_stateless_apis.md](../05_jwt_stateless_apis.md) |
| Helmet, CSP, CSRF em forms | [express/08](../../express/08_mongodb_session_seguranca/) |
| RLS + GoTrue | [07](../07_supabase_auth_postgres_rls.md) + [supabase_arquitetura.html](../supabase_arquitetura.html) |
| Recuperação de senha, e-mail verify, MFA | [09](../09_arquitetura_auth_profissional.md) §3.5–3.6 (conceitual) |

---

## Perguntas de fixação

1. Por que `regenerate()` vem **depois** do `bcrypt.compare` e **antes** de gravar `usuario`?
2. Se remover `saveUninitialized: false`, o que muda para quem só abre `GET /`?
3. Por que rate limit no login não substitui mensagem genérica de credenciais?
4. Onde você adicionaria checagem “só o dono edita este `produto_id`” — neste middleware ou no controller da rota?

Respostas curtas: [09](../09_arquitetura_auth_profissional.md) §5 e §3; AuthZ de dono = controller/query, não só `exigirLogin`.
