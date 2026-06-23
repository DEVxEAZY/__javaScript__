# 02 — Checklist de segurança web

Use como lista de verificação **antes** de considerar auth “pronto”. Marque `[x]` conforme revisar.

---

## Aula da transcrição: Helmet + CSRF

A implementação **não** está nesta pasta — está em [`express/08_mongodb_session_seguranca`](../express/08_mongodb_session_seguranca/).

| Passo da aula | Onde no repo |
|---------------|--------------|
| `npm i helmet csurf` | [`package.json`](../express/08_mongodb_session_seguranca/package.json) |
| `app.use(helmet())` antes das rotas | [`server.js` ~L117](../express/08_mongodb_session_seguranca/server.js) |
| `app.use(session(...))` antes do CSRF | [`server.js` ~L153](../express/08_mongodb_session_seguranca/server.js) |
| `app.use(csrf())` | [`server.js` ~L209](../express/08_mongodb_session_seguranca/server.js) |
| Token em `res.locals` | [`middlewares/injetarLocals.js`](../express/08_mongodb_session_seguranca/middlewares/injetarLocals.js) |
| `<input name="_csrf" value="<%= csrfToken %>">` | [`views/produtos/novo.ejs`](../express/08_mongodb_session_seguranca/views/produtos/novo.ejs) |
| Erro `EBADCSRFTOKEN` sem vazar stack | [`server.js` handler ~L244](../express/08_mongodb_session_seguranca/server.js) |

- [ ] Li a seção 10–11 do [MONGODB_SESSION_SEGURANCA.md do 08](../express/08_mongodb_session_seguranca/MONGODB_SESSION_SEGURANCA.md)
- [ ] Entendi por que **não** expor stack trace ao usuário (transcrição: preferir 404 genérico a `Forbidden` + detalhes internos)
- [ ] Testei enviar form **sem** `_csrf` e vi `EBADCSRFTOKEN` tratado

**Melhoria opcional no lab 08:** renderizar `404.ejs` em vez de `res.status(403).send(...)` — mesma ideia da transcrição, sem revelar que foi CSRF.

**Nota:** `csurf` está **deprecado** para projetos greenfield; em estudo ainda serve. Em produção nova, avalie [`csrf-csrf`](https://www.npmjs.com/package/csrf-csrf) (double-submit cookie).

---

## CSRF

- [ ] Formulários HTML com cookie de sessão têm token (`_csrf` ou header `X-CSRF-Token`)
- [ ] `csurf` (ou equivalente) **depois** de `express-session`
- [ ] APIs **somente** com `Authorization: Bearer` (sem cookie) — CSRF em geral **não** se aplica

## Helmet / CSP / HSTS

- [ ] `helmet()` habilitado em produção
- [ ] CSP/HSTS ajustados em **dev** (podem quebrar CDN/HMR) — ver MONGODB_SESSION_SEGURANCA §10 do 08 e [`__test__/03-rate-limit-e-csp.md`](../express/08_mongodb_session_seguranca/__test__/03-rate-limit-e-csp.md)

## XSS

- [ ] Views escapam saída (`<%= %>` no EJS, não `<%- %>` com input do usuário)
- [ ] Cookie de sessão com `httpOnly: true`
- [ ] CSP restringe scripts inline quando possível

## Vazamento de erro

- [ ] Handler de erro não envia stack para o browser em produção
- [ ] Mensagens de login genéricas (sem “email não existe”)

## Senhas

- [ ] Hash com bcrypt/argon2; nunca plaintext
- [ ] `.env` com segredos fora do git

## Enumeração e brute force

- [ ] Login: mesma resposta para email/senha inválidos
- [ ] Rate limit em `POST /login` (desafio 03 do 08)

## Sessão

- [ ] `saveUninitialized: false`
- [ ] `httpOnly`, `secure` em prod, `sameSite: 'lax'` (ou `strict`)
- [ ] Regenerar sessão após login (fixation) — ver [04](04_sessoes_cookies_express.md)
- [ ] Logout: `session.destroy`

## JWT (se usar API stateless)

- [ ] Secret forte em env; validar `alg` (rejeitar `none`)
- [ ] Access token curto; refresh com rotação se possível
- [ ] Evitar `localStorage` para token sensível em SPA — preferir httpOnly cookie ou BFF

## SQL injection

- [ ] Queries parametrizadas (`$1`, `$2`) — ver [06](06_postgres_usuarios_e_queries.md) e `postgres_fluxo.html`

## Secrets / Supabase

- [ ] `SESSION_SECRET`, `JWT_SECRET` gerados com entropia
- [ ] Chave `service_role` **nunca** no frontend — só servidor

## Autorização

- [ ] Rotas de escrita checam dono do recurso ou papel (admin)
- [ ] RLS no Supabase quando usar PostgREST direto do browser

---

## Próximo

[03_senhas_armazenamento_bcrypt.md](03_senhas_armazenamento_bcrypt.md)
