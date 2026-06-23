# Lab Auth Referência — Express + Postgres + sessão

Código **executável** de referência para o módulo [`../`](../) (auth). Complementa os `.md` e HTML interativos com um servidor real: cadastro, login, logout e rota protegida.

**Guia detalhado do código:** [LAB_AUTH_REFERENCIA.md](LAB_AUTH_REFERENCIA.md) (mapa conceito → arquivo). Visão ponta a ponta: [09_arquitetura_auth_profissional.md](../09_arquitetura_auth_profissional.md).

| Recurso | Onde estudar teoria |
|---------|---------------------|
| bcrypt, SQL parametrizado | [`03_senhas_armazenamento_bcrypt.md`](../03_senhas_armazenamento_bcrypt.md), [`06_postgres_usuarios_e_queries.md`](../06_postgres_usuarios_e_queries.md) |
| Sessão, regenerate, destroy | [`04_sessoes_cookies_express.md`](../04_sessoes_cookies_express.md) |
| Helmet, CSRF, flash, ordem middlewares | [`express/08_mongodb_session_seguranca/`](../../express/08_mongodb_session_seguranca/) |
| Rate limit no login | [`express/08/__test__/03-rate-limit-e-csp.md`](../../express/08_mongodb_session_seguranca/__test__/03-rate-limit-e-csp.md) |

Esta API responde **JSON** (sem EJS). Se migrar para formulários HTML, copie o padrão helmet + `csurf` do `express/08` — há bloco comentado em `server.js`.

---

## Pré-requisitos

- Node.js 18+
- Postgres acessível via URI ( **obrigatório** — sem `DATABASE_URL` o servidor encerra com mensagem clara)

### Postgres gratuito (sem Docker local)

| Serviço | Onde pegar `DATABASE_URL` |
|---------|---------------------------|
| [Supabase](https://supabase.com) | Project Settings → Database → Connection string (URI) |
| [Neon](https://neon.tech) | Dashboard → Connection details → pooled connection |

Use `?sslmode=require` na URI se o provedor exigir SSL.

---

## Como rodar

```bash
cd src/02_module/auth/lab_auth_referencia
cp .env.example .env
# Edite .env: DATABASE_URL e SESSION_SECRET

npm install

# Criar tabela usuarios (session e criada automaticamente pelo connect-pg-simple)
psql "$DATABASE_URL" -f src/sql/schema.sql
# Ou cole src/sql/schema.sql no SQL Editor do Supabase/Neon

npm start
```

Abra `http://localhost:3000/` — lista de rotas.

---

## Testar com curl

Guarde o cookie `connect.sid` entre requests (`-c` / `-b`):

```bash
# Cadastro
curl -s -X POST http://localhost:3000/cadastro \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@exemplo.com","senha":"senha12345","nome":"Ana"}'

# Login (salva cookie)
curl -s -c cookies.txt -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@exemplo.com","senha":"senha12345"}'

# Rota protegida
curl -s -b cookies.txt http://localhost:3000/painel

# Logout
curl -s -b cookies.txt -X POST http://localhost:3000/logout
```

---

## Estrutura

```
lab_auth_referencia/
├── server.js                 # ordem dos middlewares documentada
├── src/
│   ├── db/pool.js            # pg Pool
│   ├── controllers/authController.js
│   ├── middlewares/exigirLogin.js
│   ├── middlewares/rateLimitLogin.js
│   ├── middlewares/injetarUsuario.js
│   ├── routes/auth.js
│   ├── routes/protegida.js
│   └── sql/schema.sql
└── .env.example
```

---

## O que este lab demonstra

- SQL **somente** com placeholders `$1`, `$2`
- Senha **nunca** em texto puro no banco
- Mensagem **genérica** no login (e no cadastro duplicado)
- `session.regenerate()` após login bem-sucedido
- `session.destroy()` + `clearCookie` no logout
- `exigirLogin` em `/painel`
- Rate limit em `POST /login`
- Sessão persistida no Postgres (`connect-pg-simple`)

O que **não** está incluído (de propósito): helmet/csurf completos — use `express/08` como lab vivo dessa camada.
