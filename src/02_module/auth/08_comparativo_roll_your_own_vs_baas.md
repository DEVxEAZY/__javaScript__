# 08 — Comparativo: roll your own vs BaaS

Escolha de arquitetura de auth — não existe “sempre Supabase” nem “sempre Express session”. Existe **contexto**.

---

## Três arquiteturas comuns

| | Express + Postgres + bcrypt + session | Express + JWT | Supabase Auth + RLS |
|---|----------------------------------------|---------------|---------------------|
| **AuthN** | Login próprio, cookie | Login emite JWT | GoTrue |
| **Estado** | Sessão no servidor/Mongo | No token | JWT + refresh Supabase |
| **AuthZ** | Middleware + queries `WHERE` | Middleware + claims | **RLS no Postgres** |
| **CSRF** | Sim (forms HTML) | Não (Bearer) | Client REST + JWT header |
| **Ops** | Você cuida de tudo | Você cuida de segredos/TTL | Menos código auth |
| **OAuth / MFA** | Integrar manualmente | Integrar manualmente | Muitos fluxos prontos |

---

## Trade-offs

### Roll your own (Express + bcrypt)

**Prós:** Controle total; sem vendor lock-in; encaixa em curso que já usa Express.

**Contras:** Fácil esquecer checklist (CSRF, rate limit, regenerar sessão); você mantém patches de segurança.

**No repo:** teoria em `auth/`; Helmet/CSRF/session em [`express/08`](../express/08_mongodb_session_seguranca/).

---

### JWT stateless

**Prós:** Escala horizontal simples; bom para mobile e SPA com API dedicada.

**Contras:** Revogação difícil; cuidado com armazenamento no client; refresh flow obrigatório.

**No repo:** [`05_jwt_stateless_apis.md`](05_jwt_stateless_apis.md), cenário em [`00_mapa_auth.html`](00_mapa_auth.html).

---

### Supabase (BaaS)

**Prós:** Auth + API + RLS integrados; menos código boilerplate; policies centralizadas no banco.

**Contras:** Curva RLS; dependência do provedor; `service_role` é faca de dois gumes.

**No repo:** [`07_supabase_auth_postgres_rls.md`](07_supabase_auth_postgres_rls.md), [`supabase_arquitetura.html`](supabase_arquitetura.html).

---

## Árvore de decisão rápida

```
Precisa de formulários HTML + sessão no mesmo domínio?
  └─ Sim → Express session + CSRF (08) + bcrypt
  └─ Não → API pura?
        └─ Quer AuthZ forte no banco sem reimplementar em todo controller?
              └─ Sim → Supabase RLS
              └─ Não → JWT + middleware Express
```

---

## Compliance e equipe

| Fator | Roll your own | BaaS |
|-------|---------------|------|
| Auditoria | Você documenta | Contrato + SOC do provedor |
| Dados na UE | Você escolhe região do Postgres | Região do projeto Supabase |
| Custom auth (LDAP) | Possível | Pode precisar de bridge |

---

## O que estudar neste repositório (ordem)

1. Checklist [`02_checklist_seguranca_web.md`](02_checklist_seguranca_web.md)
2. Praticar `express/08` (Helmet, CSRF, sessão)
3. Postgres conceitual [`06_`](06_postgres_usuarios_e_queries.md) + HTML
4. Supabase [`07_`](07_supabase_auth_postgres_rls.md) + HTML
5. Fixação [`__test__/`](__test__/)
