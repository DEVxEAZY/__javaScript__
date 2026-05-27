# 05 — JWT e APIs stateless

**JWT** (JSON Web Token) = string assinada com três partes Base64: `header.payload.signature`.

O servidor **não** guarda sessão por request: confia na assinatura se o segredo (ou chave pública) bater.

---

## Estrutura mental

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMifQ.SflKxwRJ...
     header              payload (claims)      signature
```

Claims comuns: `sub` (id do usuário), `exp` (expiração), `iat` (emitido em).

---

## Access vs refresh

| Token | TTL | Uso |
|-------|-----|-----|
| Access | Minutos | Enviado em cada API call |
| Refresh | Dias | Só na rota `/auth/refresh` — troca por novo access |

Access curto limita dano se vazar. Refresh fica em cookie `httpOnly` ou rota protegida.

---

## Middleware Express (snippet de estudo)

```js
const jwt = require("jsonwebtoken");

function exigirJwt(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ erro: "Nao autenticado" });
  }

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ erro: "Token invalido" });
  }
}
```

Rota protegida:

```js
app.get("/api/perfil", exigirJwt, (req, res) => {
  res.json({ id: req.usuario.sub });
});
```

---

## Onde guardar no client

| Local | Risco |
|-------|-------|
| `localStorage` | Qualquer XSS lê o token |
| Cookie `httpOnly` | Melhor contra XSS; cuidado com CSRF se for cookie de sessão |
| Memória (SPA) | Some no refresh — precisa refresh flow |

Padrão comum em SPA moderna: **BFF** (Backend for Frontend) que guarda cookie httpOnly e fala com API.

---

## Quando **não** precisa CSRF

Se a API aceita **apenas** `Authorization: Bearer` e **não** usa cookie de sessão para auth, o browser de outro site não envia esse header automaticamente → CSRF clássico não se aplica.

Se você colocar JWT em **cookie** sem `SameSite=Strict`, reavalie CSRF.

---

## Validações obrigatórias

- [ ] `jwt.verify` com segredo forte (`JWT_SECRET` no `.env`)
- [ ] Conferir `exp` (biblioteca faz se usar verify)
- [ ] Algoritmo esperado (`alg: HS256`) — rejeitar `none`
- [ ] Não confiar em payload sem verificar assinatura

---

## JWT no Supabase

O GoTrue emite JWT; PostgREST usa o mesmo token para aplicar RLS — ver [`07_supabase_auth_postgres_rls.md`](07_supabase_auth_postgres_rls.md) e [`supabase_arquitetura.html`](supabase_arquitetura.html).

---

## Comparar abordagens

[`08_comparativo_roll_your_own_vs_baas.md`](08_comparativo_roll_your_own_vs_baas.md)

Hub visual JWT: [`00_mapa_auth.html`](00_mapa_auth.html) → cenário “POST /login (JWT)”.
