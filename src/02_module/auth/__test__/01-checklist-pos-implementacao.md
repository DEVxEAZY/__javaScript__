# Checklist pós-implementação (leitura + `express/08`)

Marque após ler [`../02_checklist_seguranca_web.md`](../02_checklist_seguranca_web.md) e revisar o projeto [`express/08`](../../express/08_mongodb_session_seguranca/).

---

## Fundamentos

- [ ] Explico AuthN vs AuthZ com um exemplo cada.
- [ ] Sei em qual camada fica RLS (Postgres) vs middleware Express.

## CSRF

- [ ] Descrevo o ataque CSRF em uma frase.
- [ ] Sei por que `_csrf` vai no body do form.
- [ ] Localizo `app.use(csrf())` no `server.js` do `08`.
- [ ] Localizo onde `csrfToken` entra em `res.locals`.
- [ ] Sei o código de erro `EBADCSRFTOKEN`.
- [ ] Testei POST sem `_csrf` (ou li o roteiro que pede isso).
- [ ] Sei quando API Bearer dispensa CSRF.

## Helmet

- [ ] Listo dois headers que Helmet ajuda a definir.
- [ ] Sei por que CSP pode quebrar dev local.
- [ ] Vi `contentSecurityPolicy: ehProducao` no `08`.

## Sessão

- [ ] Explico `saveUninitialized: false`.
- [ ] Sei o que é session fixation e `regenerate`.
- [ ] Sei o que **não** guardar em `req.session.usuario`.
- [ ] Descrevo logout com `destroy`.

## Senhas

- [ ] Nunca armazeno plaintext.
- [ ] Uso `bcrypt.compare` no login.
- [ ] Mensagem genérica no login falho.

## JWT

- [ ] Nomeio as três partes do JWT.
- [ ] Sei risco de `localStorage` para token.
- [ ] Escrevo pseudo-código de `exigirJwt`.

## Postgres

- [ ] Escrevo `INSERT` com `$1,$2,$3`.
- [ ] Explico SQL injection por concatenação.
- [ ] Usei toggle no `postgres_fluxo.html`.

## Supabase

- [ ] Diferencio `anon` e `service_role`.
- [ ] Explico o que `auth.uid()` faz numa policy.
- [ ] Vi alerta de `service_role` no frontend no HTML.

## Secrets

- [ ] `.env` não vai ao Git.
- [ ] Não commitaria `JWT_SECRET` nem `service_role`.

## Erros e UX de segurança

- [ ] Resposta CSRF não revela stack.
- [ ] Entendo trade-off 403 texto vs `render("404")`.

## Ordem de middlewares

- [ ] Recito a ordem: helmet → … → csurf → injetarLocals → rotas.
- [ ] Explico por que `csurf` vem depois de `session`.

## Prática opcional no `08`

- [ ] Rodei `npm start` no `08` e abri `/produtos/novo`.
- [ ] Li [`express/08/__test__/02-login-com-sessao.md`](../../express/08_mongodb_session_seguranca/__test__/02-login-com-sessao.md).
- [ ] Li [`express/08/__test__/03-rate-limit-e-csp.md`](../../express/08_mongodb_session_seguranca/__test__/03-rate-limit-e-csp.md).

## HTML deste módulo

- [ ] Percorri todos os cenários de `00_mapa_auth.html`.
- [ ] Percorri todos os cenários de `postgres_fluxo.html`.
- [ ] Percorri todos os cenários de `supabase_arquitetura.html`.
- [ ] Console do browser sem erros JS.

## Comparativo final

- [ ] Escolheria session vs JWT vs Supabase para: blog admin, SPA, app mobile — e justifico.
