# Desafio 2 — Login com sessao e rota protegida

> **Nivel:** medio
> **Tempo estimado:** 1.5–3h
> **Conceitos exercitados:** Mongoose com hook pre-save, bcrypt,
> express-session (gravando dados do usuario), middleware de
> autenticacao, flash em fluxo de erro de login, injecao de
> usuario em `res.locals` para o header.

---

## Contexto

Hoje qualquer pessoa cria/edita/exclui produtos. Em qualquer app
real, esse tipo de operacao exige **estar logado**. Voce vai
adicionar um sistema minimo de autenticacao usando sessao
(o que ja temos infra-estrutura pronta).

## Objetivo

1. Cadastro e login de usuario.
2. As rotas de criar/excluir produtos so devem funcionar para
   usuario logado.
3. O nome do usuario aparece no header. Se deslogado, aparece
   um link "Entrar".

---

## Roteiro tecnico

### 1. Model `models/Usuario.js`

```js
const usuarioSchema = new mongoose.Schema({
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    senhaHash: { type: String, required: true },
    nome:     { type: String, required: true, trim: true },
}, { timestamps: true });
```

> **Nunca** salve a senha em texto puro. Use **bcrypt**:
>
> ```js
> const bcrypt = require("bcryptjs");
> usuarioSchema.statics.criar = async function ({ email, senha, nome }) {
>     const senhaHash = await bcrypt.hash(senha, 10);
>     return this.create({ email, senhaHash, nome });
> };
> usuarioSchema.methods.confereSenha = function (senha) {
>     return bcrypt.compare(senha, this.senhaHash);
> };
> ```
>
> Adicione `bcryptjs` ao `package.json` (`npm i bcryptjs`).

### 2. Rotas `routes/auth.js`

```
GET   /cadastro    → form
POST  /cadastro    → cria usuario, faz login automatico, redirect /produtos
GET   /login       → form
POST  /login       → valida e salva em req.session.usuario
POST  /logout      → req.session.destroy + redirect
```

### 3. Controller `controllers/authController.js`

Pontos para acertar:

- No login bem sucedido:
  ```js
  req.session.usuario = { id: u._id, nome: u.nome, email: u.email };
  req.flash("sucesso", `Bem-vindo, ${u.nome}.`);
  res.redirect("/produtos");
  ```
- No login com erro: `req.flash("erro", "Credenciais invalidas.")`
  e redirect pro form. **Nunca** diga "email nao existe" vs
  "senha errada" — entrega lista de emails validos pra atacante.
- No logout: `req.session.destroy(() => res.redirect("/login"))`.

### 4. Middleware `middlewares/exigeLogin.js`

```js
module.exports = function exigeLogin(req, res, next) {
    if (!req.session.usuario) {
        req.flash("erro", "Faca login para continuar.");
        return res.redirect("/login");
    }
    next();
};
```

Aplique em rotas mutantes:

```js
router.get("/novo", exigeLogin, ctrl.formNovo);
router.post("/", exigeLogin, ctrl.criar);
router.post("/:id/excluir", exigeLogin, ctrl.excluir);
```

### 5. Header dinamico

No `injetarLocals.js`:

```js
res.locals.usuario = req.session.usuario || null;
```

No `views/partials/header.ejs`, no nav:

```html
<% if (usuario) { %>
    <span>Ola, <%= usuario.nome %></span>
    <form action="/logout" method="POST" class="inline-form">
        <input type="hidden" name="_csrf" value="<%= csrfToken %>">
        <button type="submit">Sair</button>
    </form>
<% } else { %>
    <a href="/login">Entrar</a>
    <a href="/cadastro">Cadastrar</a>
<% } %>
```

---

## Criterios de aceite

- [ ] Cadastro grava `senhaHash` (verifique no Compass — **nunca**
      a senha em texto).
- [ ] Login com credenciais validas: redireciona, flash de
      sucesso, header passa a mostrar nome.
- [ ] Login com credenciais invalidas: redireciona pro form com
      flash de erro; **a mensagem nao distingue** "email errado"
      de "senha errada".
- [ ] Tentar `GET /produtos/novo` sem login redireciona pro login
      com flash.
- [ ] Tentar `POST /produtos` sem login (curl, fetch) tambem e
      bloqueado — nao basta esconder o link.
- [ ] `POST /logout` zera a sessao e o header volta pra "Entrar".
- [ ] Cadastrar com email duplicado mostra erro tratado (nao 500).

---

## Armadilhas que voce vai cair

1. **Senha em texto puro**: aconteceu com Adobe, com LinkedIn, com
   um numero embaracoso de empresas. Se voce salvou direto e foi
   esperar pra trocar depois, ja errou. Bcrypt do dia 1.
2. **Esconder o link != proteger**: muita gente protege so a UI e
   esquece o backend. Se nao tiver `exigeLogin` na rota POST, um
   `curl -X POST` resolve facil.
3. **Sessao com dados pesados**: nao salve o documento inteiro do
   usuario em `req.session.usuario`. So id + nome + email.
   Quando precisar de mais, vai no Mongo.
4. **Flash de "ja logado"**: se o usuario logado acessa `/login`,
   nao deixe ele cair no form de novo. Redirecione pra
   `/produtos`.

---

## Bonus

- Adicione **lockout** apos 5 tentativas falhas em 10 minutos.
  Pode usar so a sessao (contador), ou subir um Map em memoria,
  ou um campo no usuario. Cada abordagem tem trade-off.
- Adicione **"lembrar de mim"**: cookie de longa duracao com um
  token aleatorio gravado no usuario. Quando ele volta sem
  sessao, voce le o token e cria sessao. Cuidado para
  invalidar todos os tokens em logout-de-todos-dispositivos.
