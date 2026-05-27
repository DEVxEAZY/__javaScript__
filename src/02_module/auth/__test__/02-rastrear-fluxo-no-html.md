# Rastrear fluxo nos HTML

Responda **sem olhar** o código-fonte do HTML na primeira tentativa; depois confira animando o cenário.

---

## `postgres_fluxo.html`

### Cadastro

1. Em qual passo o `bcrypt.hash` roda?
2. Quantos placeholders `$n` aparecem no `INSERT`?
3. Qual status HTTP típico após cadastro bem-sucedido (redirect)?

### Login OK

4. Em qual passo o cookie `connect.sid` é emitido?
5. O que é gravado em `req.session.usuario`?
6. Qual query SQL busca o usuário?

### Login falha

7. A mensagem ao usuário diferencia “e-mail não existe” de “senha errada”?
8. Quantas linhas o `SELECT` retorna quando o e-mail não existe?

### Rota protegida

9. Sem sessão, qual status/redirecionamento o middleware devolve?
10. Qual campo da sessão o middleware verifica?

### SQL injection

11. No modo vulnerável, o que o atacante coloca no campo `email`?
12. No modo parametrizado, o payload malicioso vira parte do SQL ou valor separado?

---

## `00_mapa_auth.html`

13. Quantos cenários o hub lista no seletor principal?
14. Qual cenário leva você a pensar em `Authorization: Bearer`?
15. Onde o hub aponta para o fluxo Postgres detalhado?

---

## `supabase_arquitetura.html`

16. Qual componente emite o JWT após `signInWithPassword`?
17. Quem aplica a policy RLS — browser ou Postgres?
18. O que acontece se você usar `service_role` no React (anti-padrão do HTML)?

---

## Ligação com `express/08`

19. No lab `08`, em qual arquivo está o `<input name="_csrf">`?
20. O `postgres_fluxo.html` simula CSRF token? Por quê faz sentido não simular no cenário de login Postgres puro?

---

## Gabarito rápido (não abra antes de tentar)

<details>
<summary>Clique para revelar</summary>

1. Passo “hash senha” / controller cadastrar  
2. Três (`$1,$2,$3`)  
3. 302 para `/login`  
4. Após `session.regenerate` + Set-Cookie  
5. `{ id, nome }` — sem senha  
6. `SELECT ... WHERE email = $1`  
7. Não — mensagem única  
8. Zero rows  
9. 302 para `/login`  
10. `req.session.usuario.id`  
11. `' OR '1'='1` (exemplo clássico)  
12. Valor separado — query segura  
13. Cinco no hub (incl. links)  
14. POST /login (JWT) ou supabase-sign-in  
15. Link/botão para `postgres_fluxo.html`  
16. GoTrue / Supabase Auth  
17. Postgres (via PostgREST com role authenticated)  
18. Bypass RLS — acesso total — vazamento catastrófico  
19. `views/produtos/novo.ejs`  
20. Não — foco é SQL/sessão; CSRF é tema do `08` com forms lá

</details>
