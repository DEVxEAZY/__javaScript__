# Módulo Auth — índice mestre

Documentação contínua sobre autenticação, autorização, Postgres e Supabase. A pasta `auth/` em si não exige servidor — leia os `.md`, abra os `.html` no navegador. Para **código de referência** executável (Express + Postgres + bcrypt + sessão), use [`lab_auth_referencia/`](lab_auth_referencia/). Helmet/CSRF/sessão com views: [`../express/08_mongodb_session_seguranca/`](../express/08_mongodb_session_seguranca/).

---

## Índice dos capítulos

| # | Arquivo | Conteúdo |
|---|---------|----------|
| — | [README.md](README.md) | Mapa do módulo, pré-requisitos |
| **09** | **[09_arquitetura_auth_profissional.md](09_arquitetura_auth_profissional.md)** | **Referência elite** — fluxos, ameaças, stateful/JWT/BFF, observabilidade |
| 01 | [01_autenticacao_autorizacao.md](01_autenticacao_autorizacao.md) | AuthN vs AuthZ |
| 02 | [02_checklist_seguranca_web.md](02_checklist_seguranca_web.md) | Checklist + mapeamento transcrição → `express/08` |
| 03 | [03_senhas_armazenamento_bcrypt.md](03_senhas_armazenamento_bcrypt.md) | bcrypt, cadastro, login |
| 04 | [04_sessoes_cookies_express.md](04_sessoes_cookies_express.md) | Sessão, fixation, logout |
| 05 | [05_jwt_stateless_apis.md](05_jwt_stateless_apis.md) | JWT, Bearer, middleware |
| 06 | [06_postgres_usuarios_e_queries.md](06_postgres_usuarios_e_queries.md) | Schema, SQL parametrizado |
| — | [lab_auth_referencia/](lab_auth_referencia/) | **Código de referência** — Express + pg + auth completo |
| 07 | [07_supabase_auth_postgres_rls.md](07_supabase_auth_postgres_rls.md) | GoTrue, RLS, chaves |
| 08 | [08_comparativo_roll_your_own_vs_baas.md](08_comparativo_roll_your_own_vs_baas.md) | Trade-offs |

---

## HTML interativos

| Arquivo | Uso |
|---------|-----|
| [00_mapa_auth.html](00_mapa_auth.html) | Hub — escolher cenário |
| [postgres_fluxo.html](postgres_fluxo.html) | Cadastro, login, rota protegida, SQL injection |
| [supabase_arquitetura.html](supabase_arquitetura.html) | Auth, PostgREST, JWT, RLS |

---

## Roteiro da transcrição (Helmet + CSRF) → `express/08`

Uma página — detalhes e checkboxes em [02_checklist_seguranca_web.md](02_checklist_seguranca_web.md#aula-helmet--csrf--mapeamento-da-transcrição--express08).

1. Pacotes `helmet` + `csurf` → [`express/08/package.json`](../express/08_mongodb_session_seguranca/package.json)
2. `app.use(helmet(...))` → [`server.js` L117–124](../express/08_mongodb_session_seguranca/server.js)
3. Ordem: session → flash → **csurf** → injetarLocals → rotas → [`server.js` L34–51](../express/08_mongodb_session_seguranca/server.js)
4. `res.locals.csrfToken` → [`middlewares/injetarLocals.js`](../express/08_mongodb_session_seguranca/middlewares/injetarLocals.js)
5. Form `_csrf` → [`views/produtos/novo.ejs`](../express/08_mongodb_session_seguranca/views/produtos/novo.ejs)
6. `EBADCSRFTOKEN` → [`server.js` L244–248](../express/08_mongodb_session_seguranca/server.js)
7. Teoria: [`express/08/AULA.md`](../express/08_mongodb_session_seguranca/AULA.md) §10–12
8. Desafios: [`express/08/__test__/`](../express/08_mongodb_session_seguranca/__test__/)

---

## Ordem de estudo sugerida

1. [09_arquitetura_auth_profissional.md](09_arquitetura_auth_profissional.md) — mapa mental completo (leia primeiro ou logo após o `01`)
2. [01_autenticacao_autorizacao.md](01_autenticacao_autorizacao.md)
3. [02_checklist_seguranca_web.md](02_checklist_seguranca_web.md) (marque enquanto lê o `08`)
4. [03_senhas_armazenamento_bcrypt.md](03_senhas_armazenamento_bcrypt.md) → [04_sessoes_cookies_express.md](04_sessoes_cookies_express.md)
5. Rodar ou ler [`express/08`](../express/08_mongodb_session_seguranca/)
6. [05_jwt_stateless_apis.md](05_jwt_stateless_apis.md)
7. [06_postgres_usuarios_e_queries.md](06_postgres_usuarios_e_queries.md) + [postgres_fluxo.html](postgres_fluxo.html)
8. **Código de referência:** [lab_auth_referencia/](lab_auth_referencia/) + [lab_auth_referencia/AULA.md](lab_auth_referencia/AULA.md) (opcional — exige Postgres)
9. [07_supabase_auth_postgres_rls.md](07_supabase_auth_postgres_rls.md) + [supabase_arquitetura.html](supabase_arquitetura.html)
10. [08_comparativo_roll_your_own_vs_baas.md](08_comparativo_roll_your_own_vs_baas.md)
11. [__test__/01-checklist-pos-implementacao.md](__test__/01-checklist-pos-implementacao.md)

---

## Glossário

| Termo | Significado |
|-------|-------------|
| **AuthN** | Autenticação — provar identidade |
| **AuthZ** | Autorização — permissão sobre recurso |
| **CSRF** | Request forjado em outro site usando seu cookie |
| **Helmet** | Middleware que define headers HTTP de segurança |
| **CSP** | Content-Security-Policy — restringe origens de script/style |
| **RLS** | Row Level Security — filtro no Postgres por linha |
| **JWT** | Token assinado stateless |
| **GoTrue** | Serviço de auth do Supabase |
| **PostgREST** | API REST gerada sobre Postgres |
| **EBADCSRFTOKEN** | Código de erro do `csurf` quando token inválido |
| **Session fixation** | Atacante fixa session id antes do login da vítima |
| **anon / service_role** | Chaves Supabase — anon com RLS; service bypassa RLS |

---

## Fixação sem servidor em `auth/`

- [__test__/README.md](__test__/README.md)
- [__test__/01-checklist-pos-implementacao.md](__test__/01-checklist-pos-implementacao.md)
- [__test__/02-rastrear-fluxo-no-html.md](__test__/02-rastrear-fluxo-no-html.md)
