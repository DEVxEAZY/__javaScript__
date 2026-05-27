# 01 — Autenticação vs autorização

Dois verbos que parecem sinônimos mas **não são**.

## Autenticação (AuthN)

**Pergunta:** “Quem é você?”

- Login com email/senha
- OAuth (“Entrar com Google”)
- Passkeys / WebAuthn (menção: padrão moderno sem senha no servidor)

O resultado costuma ser uma **identidade** ligada à requisição: `req.session.usuario`, `req.usuario` (JWT), ou claims no token Supabase (`sub`).

## Autorização (AuthZ)

**Pergunta:** “O que você pode fazer?”

- Usuário A pode editar **só** o produto dele
- Admin pode apagar qualquer post
- Visitante só lê a lista pública

AuthN sem AuthZ é perigoso: “está logado” não significa “pode fazer tudo”.

## Onde cada decisão vive

| Camada | AuthN | AuthZ |
|--------|-------|-------|
| **Middleware** | `exigirLogin`, validar JWT | `exigirAdmin`, checar dono do recurso |
| **Controller** | Montar sessão após login | Comparar `req.params.id` com `req.session.usuario.id` |
| **Banco / RLS** | Tabela `usuarios`, hash de senha | Policy `auth.uid() = dono_id` (Supabase) |

Regra prática: **nunca confie só no front** (botão escondido). Toda ação sensível valida no servidor (e, quando possível, no banco).

## Fluxo mental

```
1. AuthN  →  prova identidade  →  sessão ou JWT
2. AuthZ  →  para esta rota/recurso, esta identidade pode?
3. Negado →  401 (não autenticado) ou 403 (autenticado mas sem permissão)
```

## Próximo passo

[02_checklist_seguranca_web.md](02_checklist_seguranca_web.md) — ameaças e defesas antes de implementar login de verdade.
