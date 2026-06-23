# 04 — Sessões e cookies no Express

Sessão = estado do usuário no **servidor** (ou em store externo), identificado por um **cookie** opaco no browser (`connect.sid`).

A teoria longa (cookie, `httpOnly`, `sameSite`, `express-session`, `connect-mongo`, flash) está em [`MONGODB_SESSION_SEGURANCA.md`](../express/08_mongodb_session_seguranca/MONGODB_SESSION_SEGURANCA.md) §5–9. Este capítulo acrescenta só o que falta para **auth completo** sem repetir páginas inteiras.

---

## O que já está no lab `08`

| Recurso | Arquivo |
|---------|---------|
| `express-session` + store Mongo | [`server.js` L153–169](../express/08_mongodb_session_seguranca/server.js) |
| `saveUninitialized: false` | Mesmo bloco |
| Cookie `httpOnly`, `sameSite: "lax"`, `secure` em prod | L163–168 |
| Flash + `injetarLocals` | [`injetarLocals.js`](../express/08_mongodb_session_seguranca/middlewares/injetarLocals.js) |

---

## Regenerar sessão após login (session fixation)

Se o atacante fixar um `session id` antes do login da vítima, após login ele poderia herdar a sessão autenticada.

**Mitigação:** `req.session.regenerate()` **depois** de validar credenciais e **antes** de gravar `req.session.usuario`.

```js
req.session.regenerate((err) => {
  if (err) return next(err);
  req.session.usuario = { id: usuario.id, nome: usuario.nome };
  res.redirect("/painel");
});
```

---

## O que gravar em `req.session.usuario`

| Pode | Não pode |
|------|----------|
| `id`, `nome`, `papel` | Senha, hash, token de refresh |

Views leem via `res.locals` se você injetar no middleware (padrão do `injetarLocals` para CSRF — estenda para `usuario` quando implementar login).

---

## Logout

```js
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Erro ao sair");
    res.clearCookie("connect.sid"); // nome padrão; confira se customizou
    res.redirect("/login");
  });
}
```

---

## SameSite vs CSRF

`sameSite: "lax"` no cookie **reduz** alguns cenários de CSRF, mas **não elimina** todos (ex.: subdomínios, métodos GET state-changing em apps mal projetadas). Com formulários HTML e cookie de sessão, mantenha **token CSRF** — ver [`02_checklist_seguranca_web.md`](02_checklist_seguranca_web.md) e `08`.

---

## Sessão vs JWT

| | Sessão + cookie | JWT stateless |
|---|-----------------|---------------|
| Estado | No servidor / Mongo / Redis | No token (claims) |
| Revogação | `destroy` imediato | Precisa blacklist ou TTL curto |
| CSRF | Sim, em forms HTML | Não (se só Bearer header) |
| Onde estudar | Este arquivo + `08` | [`05_jwt_stateless_apis.md`](05_jwt_stateless_apis.md) |

---

## Prática

1. Leia `express/08_mongodb_session_seguranca/MONGODB_SESSION_SEGURANCA.md` §5–6.
2. Rode `npm start` no `08` e observe cookie no DevTools → Application → Cookies.
3. (Opcional) Implemente login pelo roteiro [`express/08/__test__/02-login-com-sessao.md`](../express/08_mongodb_session_seguranca/__test__/02-login-com-sessao.md).

Próximo: [`05_jwt_stateless_apis.md`](05_jwt_stateless_apis.md).
