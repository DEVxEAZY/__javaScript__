# Módulo Auth — segurança web, Postgres e Supabase

Trilha de estudo sobre **autenticação**, **autorização** e defesas comuns em apps web. A maior parte é **documentação + HTML interativo** (sem `npm install`). Opcionalmente, rode o **lab com código real**: [`lab_auth_referencia/`](lab_auth_referencia/) (Express + Postgres).

## Pré-requisitos

| Antes de começar | Por quê |
|------------------|---------|
| Express `01`–`07` em [`../express/`](../express/) | Rotas, middlewares, views |
| Ler ou rodar [`../express/08_mongodb_session_seguranca/`](../express/08_mongodb_session_seguranca/) | Helmet, CSRF, sessão, flash — **implementação viva** da aula de segurança |
| Opcional: [`../mongoDB/`](../mongoDB/) | Contraste documento (Mongo) vs linha (Postgres) |

## Ordem de leitura sugerida

1. [AUTH.md](AUTH.md) — índice e roteiro da transcrição (Helmet + CSRF → express/08)
2. **[09_arquitetura_auth_profissional.md](09_arquitetura_auth_profissional.md)** — visão ponta a ponta (fluxos, ameaças, stateful vs JWT vs BFF)
3. [01_autenticacao_autorizacao.md](01_autenticacao_autorizacao.md)
4. [02_checklist_seguranca_web.md](02_checklist_seguranca_web.md)
5. [03_senhas_armazenamento_bcrypt.md](03_senhas_armazenamento_bcrypt.md)
6. [04_sessoes_cookies_express.md](04_sessoes_cookies_express.md)
7. [05_jwt_stateless_apis.md](05_jwt_stateless_apis.md)
8. [06_postgres_usuarios_e_queries.md](06_postgres_usuarios_e_queries.md) + abrir [postgres_fluxo.html](postgres_fluxo.html)
9. **Opcional (código):** [`lab_auth_referencia/`](lab_auth_referencia/) — Express + pg + bcrypt + sessão
10. [07_supabase_auth_postgres_rls.md](07_supabase_auth_postgres_rls.md) + abrir [supabase_arquitetura.html](supabase_arquitetura.html)
11. [08_comparativo_roll_your_own_vs_baas.md](08_comparativo_roll_your_own_vs_baas.md)
12. Hub visual: [00_mapa_auth.html](00_mapa_auth.html)
13. Fixação: [__test__/README.md](__test__/README.md)

## Onde está o quê

| Tema | Neste módulo (`auth/`) | Lab Express com código |
|------|------------------------|-------------------------|
| Arquitetura auth ponta a ponta | [`09_arquitetura_auth_profissional.md`](09_arquitetura_auth_profissional.md) | Conceitos no lab + `express/08` |
| Helmet, CSRF, sessão, flash | Checklist + links | [`08_mongodb_session_seguranca`](../express/08_mongodb_session_seguranca/) |
| Login com bcrypt (prática) | Teoria em `03`–`04` | Desafio em [`08/__test__/02-login-com-sessao.md`](../express/08_mongodb_session_seguranca/__test__/02-login-com-sessao.md) |
| Postgres + SQL parametrizado | `06` + `postgres_fluxo.html` | [`lab_auth_referencia/`](lab_auth_referencia/) |
| Login bcrypt + sessão + regenerate | `03`–`04` | [`lab_auth_referencia/`](lab_auth_referencia/) |
| Supabase Auth + RLS | `07` + `supabase_arquitetura.html` | — (conceitual) |
| Rate limit no login | Checklist | [`08/__test__/03-rate-limit-e-csp.md`](../express/08_mongodb_session_seguranca/__test__/03-rate-limit-e-csp.md) |

## Como abrir os HTML

Abra no navegador (duplo clique ou “Open with Live Server”):

- `00_mapa_auth.html`
- `postgres_fluxo.html`
- `supabase_arquitetura.html`

Os HTML simulam fluxos HTTP → Express → banco **sem Node**. Para código executável com Postgres, use [`lab_auth_referencia/`](lab_auth_referencia/).
