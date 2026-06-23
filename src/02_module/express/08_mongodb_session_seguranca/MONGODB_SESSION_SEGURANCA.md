# MongoDB, Sessao e Seguranca em Express

> Aulas 138 a 146 — uma viagem pelo que separa um servidor "ola
> mundo" de uma aplicacao web pronta pra receber usuarios reais.
>
> Este arquivo e a aula. O codigo da pasta e o laboratorio.

---

## Indice

1. [Visao geral: o que estamos construindo e por que](#1-visao-geral)
2. [MongoDB — o banco de documentos](#2-mongodb)
3. [Mongoose — Schema, Model, conexao](#3-mongoose)
4. [Atlas, Compass e o ambiente local](#4-atlas-compass)
5. [Cookies, sessao e o problema do estado](#5-cookies-sessao)
6. [Express Session](#6-express-session)
7. [connect-mongo — persistir sessao no banco](#7-connect-mongo)
8. [Flash Messages](#8-flash-messages)
9. [res.locals — injetando dados em todas as views](#9-res-locals)
10. [Helmet — headers de seguranca HTTP](#10-helmet)
11. [CSRF — o ataque e a defesa com csurf](#11-csrf)
12. [A ordem dos middlewares](#12-ordem-middlewares)
13. [Erros comuns e como diagnosticar](#13-erros-comuns)
14. [Glossario rapido](#14-glossario)

---

<a id="1-visao-geral"></a>

## 1. Visao geral

Ate aqui voce ja viu Express, rotas, middlewares, EJS, controllers
e arquivos estaticos. O proximo salto exige tres ingredientes que
toda app web "de verdade" tem:

1. **Persistencia** — guardar dados depois que o servidor reinicia.
   Aqui usamos **MongoDB** + **Mongoose**.
2. **Estado entre requisicoes** — lembrar quem e o usuario, exibir
   mensagens depois de um redirect, manter carrinho de compras.
   Usamos **express-session** + **connect-mongo** + **connect-flash**.
3. **Seguranca minima** — headers HTTP corretos e protecao contra
   ataques classicos. Usamos **helmet** + **csurf**.

O exemplo da pasta e um CRUD simples de produtos. Pequeno por fora,
mas conceitualmente tem toda a estrutura de um app sério.

```
Browser  ──HTTP──▶  Express  ──Mongoose──▶  MongoDB
                      │
                      ├─ helmet         (headers)
                      ├─ session        (cookie + store no Mongo)
                      ├─ flash          (mensagens entre requests)
                      ├─ csurf          (token anti-CSRF)
                      └─ ejs            (HTML renderizado no servidor)
```

---

<a id="2-mongodb"></a>

## 2. MongoDB — o banco de documentos

### 2.1 SQL vs NoSQL em uma frase

- **SQL** (Postgres, MySQL): voce define **tabelas** com colunas
  fixas; cada linha tem exatamente aquelas colunas. Linguagem
  declarativa (`SELECT … WHERE …`). Excelente para dados
  estruturados, joins, transacoes.
- **NoSQL de documentos** (MongoDB): voce salva **documentos JSON**
  em **collections**. Cada documento pode ter campos diferentes do
  vizinho. Excelente para dados que mudam de forma com o tempo, ou
  quando voce quer um "objeto inteiro" salvo de uma vez.

### 2.2 Vocabulario equivalente

| SQL          | MongoDB         |
|--------------|------------------|
| Database     | Database         |
| Tabela       | Collection       |
| Linha        | Document         |
| Coluna       | Campo (field)    |
| `id` (PK)    | `_id` (ObjectId) |
| JOIN         | (nao tem nativo — voce embute ou popula) |

### 2.3 O documento

```js
{
    _id: ObjectId("66b1f5d6e3a4d2c0a4f3a1b1"),
    nome: "Teclado mecanico",
    preco: 350,
    categoria: "eletronico",
    ativo: true,
    createdAt: ISODate("2025-08-06T12:00:00Z"),
    updatedAt: ISODate("2025-08-06T12:00:00Z")
}
```

`_id` e gerado pelo Mongo automaticamente como um **ObjectId** de
12 bytes (timestamp + random + counter). Voce nao precisa criar
sequencias — eles sao globalmente unicos.

### 2.4 Por que ele caiu nas gracas do JS

Porque o "documento" do Mongo e literalmente JSON. Voce salva o
mesmo objeto que tem na memoria; le, modifica, salva. Sem mapear
linha-pra-objeto manualmente. Junto com Node.js virou um padrao
quase default em projetos pequenos e medios.

### 2.5 O custo

Sem disciplina, vira bagunca. Como o schema e livre, nada impede
de salvar `{ nome: "x" }` num lugar e `{ name: "x" }` no outro.
Por isso usamos **Mongoose**, que reintroduz schema do lado da
aplicacao.

---

<a id="3-mongoose"></a>

## 3. Mongoose — Schema, Model, conexao

Mongoose e um **ODM** (Object Document Mapper). Ele fica entre
seu codigo e o driver oficial do Mongo, oferecendo:

- **Schema**: definicao formal dos campos, tipos, defaults,
  validacoes.
- **Model**: a classe que voce usa para CRUD (`Produto.find()`,
  `produto.save()`).
- **Hooks**: codigo que roda antes/depois de save/find/etc.
- **Casts e validacoes** automaticas.

### 3.1 Schema

```js
const produtoSchema = new mongoose.Schema(
    {
        nome:      { type: String,  required: true, trim: true, minlength: 2 },
        preco:     { type: Number,  required: true, min: 0 },
        categoria: { type: String,  enum: ["eletronico", "vestuario", "alimento", "outro"], default: "outro" },
        ativo:     { type: Boolean, default: true },
    },
    { timestamps: true }
);
```

Pontos a notar:

- Cada campo pode ser `tipo` direto ou `objeto` com regras.
- `required`, `min`, `enum`, `default`, `trim`, `lowercase` ja vem
  prontos. Se a validacao falhar, o Mongoose levanta um
  `ValidationError` e o documento **nao** vai pro banco.
- `timestamps: true` e a opcao que voce sempre vai querer ativar:
  cria `createdAt` e `updatedAt` sozinho.

### 3.2 Model

```js
const Produto = mongoose.model("Produto", produtoSchema);
```

Isso faz duas coisas:

1. Cria uma classe `Produto` com metodos como `find`, `findById`,
   `create`, `updateOne`, `findByIdAndDelete`, etc.
2. Liga essa classe a uma **collection** no Mongo. A convencao
   pluraliza e poe em minusculas: `"Produto"` → `produtos`.

### 3.3 CRUD basico

```js
// CREATE
await Produto.create({ nome: "Mouse", preco: 180 });

// READ
const todos    = await Produto.find();
const um       = await Produto.findById(id);
const baratos  = await Produto.find({ preco: { $lt: 100 } });

// UPDATE
await Produto.findByIdAndUpdate(id, { preco: 120 });

// DELETE
await Produto.findByIdAndDelete(id);
```

### 3.4 Conexao

```js
mongoose.connect(MONGO_URI);
```

A funcao retorna uma **Promise**. Internamente o Mongoose mantem
um pool de conexoes e reusa. Voce **nao** precisa `connect` em
cada request — chama uma vez no startup.

```js
mongoose.connect(MONGO_URI)
    .then(() => console.log("✓ MongoDB conectado"))
    .catch((err) => {
        console.error("✗ Falha:", err.message);
        process.exit(1);
    });
```

Em prod, alguns times preferem **nao** matar o processo e em vez
disso ouvir `mongoose.connection.on("error", …)` e
`"disconnected"` para tentar reconectar — depende da estrategia
de orquestracao (Kubernetes vai matar e subir de novo de graca).

### 3.5 Modulo cache do Node e o model

Voce **so registra um model uma vez por processo**. `require()` do
Node tem cache: chamar `require("./models/Produto")` em N arquivos
retorna sempre a mesma instancia. Por isso nao se preocupe em
"importar duas vezes" — nao vai duplicar.

---

<a id="4-atlas-compass"></a>

## 4. Atlas, Compass e o ambiente local

### 4.1 Mongo local

`mongod` e o processo do servidor MongoDB rodando na sua maquina,
escutando por padrao em **27017**. Connection string:

```
mongodb://127.0.0.1:27017/aulas
```

A "database" `aulas` e criada na primeira escrita (Mongo nao
exige `CREATE DATABASE`).

### 4.2 Atlas

**MongoDB Atlas** e o servico hospedado oficial. O tier free
(M0) basta para estudo. Voce ganha:

- Servidor real, fora da sua maquina (resiliente a "desliguei o
  notebook").
- Painel web para inspecionar, criar usuarios, etc.
- Network Access: voce **precisa** liberar seu IP (ou `0.0.0.0/0`
  em estudos — **nunca** em prod).

Connection string Atlas:

```
mongodb+srv://USUARIO:SENHA@cluster0.xxxxx.mongodb.net/aulas
```

O `+srv` significa que ele faz lookup DNS pra descobrir os hosts
do cluster, em vez de voce listar todos.

### 4.3 Compass

**Compass** e um cliente desktop oficial. Conecta com a mesma
connection string e te mostra:

- Lista de databases e collections.
- Documentos com filtros e edicao visual.
- Plano de execucao de queries (`explain`).

E pra Mongo o que pgAdmin/DBeaver e pra Postgres. Indispensavel
para diagnosticar "salvei isso? a query bateu?".

### 4.4 Pontos de falha mais comuns

1. **Atlas + IP nao liberado** → `ETIMEDOUT` ou
   `MongooseServerSelectionError`. Solucao: Network Access → Add
   IP.
2. **Senha errada** → `Authentication failed`. Recriar usuario no
   Atlas → Database Access.
3. **Caracteres especiais na senha** sem URL-encode → connection
   string quebra. Use uma senha so com letras/numeros ou faca
   `encodeURIComponent`.
4. **Local com `mongod` nao rodando** → `ECONNREFUSED`. Subir o
   servico ou usar Docker.

---

<a id="5-cookies-sessao"></a>

## 5. Cookies, sessao e o problema do estado

### 5.1 HTTP nao tem memoria

Cada requisicao HTTP e independente. O servidor **nao sabe**, sem
ajuda, que dois pedidos vieram da mesma pessoa. Para "lembrar"
algo entre requests existem dois caminhos:

| Onde guardo o dado | Como o cliente identifica | Exemplo  |
|--------------------|---------------------------|----------|
| No **cliente**, no proprio cookie | O cookie carrega a info | JWT |
| No **servidor**, indexado por chave; cliente guarda so a chave em cookie | Cookie com `sessionId` | express-session |

A escolha 2 e o que chamamos de **sessao**.

### 5.2 O cookie

Um cookie e um par `nome=valor` que o servidor envia em `Set-Cookie:`
e o browser **devolve em toda requisicao seguinte** para o mesmo
dominio. Atributos importantes:

- `HttpOnly` — JavaScript da pagina **nao consegue** ler. Bloqueia
  XSS de roubar a sessao.
- `Secure` — so vai em conexoes HTTPS. Em prod, sempre.
- `SameSite=Lax|Strict|None` — controla se o cookie e enviado em
  navegacao cross-site. `Lax` e um bom default — bloqueia CSRF
  em POST de outros sites mas mantem GET top-level.
- `Max-Age` / `Expires` — quando expira. Sem isso, expira ao
  fechar o browser ("session cookie").

### 5.3 O ciclo de uma sessao server-side

```
1. Primeiro acesso:
   Browser ─────────────────▶ Servidor
                              gera sessionId
   Browser ◀─ Set-Cookie: sid=abc; HttpOnly; SameSite=Lax
              (servidor guarda sid -> { dados } no store)

2. Acessos seguintes:
   Browser ─ Cookie: sid=abc ─▶ Servidor
                                le store[sid] -> { dados }
                                req.session = dados
```

O ID e opaco e aleatorio. Os **dados** ficam no servidor (em
memoria, Mongo, Redis…).

---

<a id="6-express-session"></a>

## 6. Express Session

`express-session` e o middleware que implementa esse fluxo.

```js
app.use(session({
    secret:            process.env.SESSION_SECRET,
    resave:            false,
    saveUninitialized: false,
    store:             /* opcional — default e MemoryStore */,
    cookie: {
        httpOnly: true,
        secure:   ehProducao,
        sameSite: "lax",
        maxAge:   1000 * 60 * 60 * 24 * 7,
    },
}));
```

### 6.1 Opcoes-chave

- `secret` — string usada pra assinar o cookie. Se alguem alterar
  o `sid`, a assinatura quebra e o servidor descarta. **Nunca**
  comite. Em prod use `openssl rand -hex 32`.
- `resave: false` — nao re-salva no store se a sessao nao mudou
  (default antigo era `true` por compatibilidade).
- `saveUninitialized: false` — nao cria registro de sessao para
  visitantes que nao guardaram nada. Reduz lixo no banco e e mais
  amigavel a leis tipo cookie consent.
- `store` — onde guardar. **Default e `MemoryStore`** e o proprio
  pacote loga aviso: nao serve pra producao porque vaza memoria,
  perde tudo no restart, e nao funciona com mais de um processo.
- `cookie.maxAge` — duracao em **milissegundos**.

### 6.2 Usando

```js
// gravar
req.session.usuario = { id: u._id, nome: u.nome };

// ler
if (req.session.usuario) { /* ... */ }

// destruir (logout)
req.session.destroy(() => res.redirect("/"));
```

---

<a id="7-connect-mongo"></a>

## 7. connect-mongo — persistir sessao no banco

`connect-mongo` e um **store** para `express-session` que grava as
sessoes numa collection MongoDB.

### 7.1 Por que persistir

- O processo cai/reinicia: sem store, todo mundo perde sessao.
- Voce roda **multiplos processos** (cluster, varias maquinas
  atras de load balancer): cada um teria sua propria memoria.
  Com store compartilhado, todos enxergam a mesma sessao.

### 7.2 API moderna (5.x)

```js
const MongoStore = require("connect-mongo");

session({
    // ...
    store: MongoStore.create({
        mongoUrl:       MONGO_URI,
        collectionName: "sessions",
        ttl:            60 * 60 * 24 * 7,   // 7 dias em SEGUNDOS
    }),
});
```

O `ttl` fica em **segundos** (Mongo TTL index), enquanto
`cookie.maxAge` fica em **milissegundos**. Mantenha eles
coerentes — geralmente o mesmo intervalo.

### 7.3 O erro classico (Aula 141)

Tutoriais antigos (3.x) usam:

```js
// API VELHA — nao funciona em 5.x
new MongoStore({ mongooseConnection: mongoose.connection })
```

Sintomas tipicos quando voce mistura:

- `MongoStore is not a constructor`
- `TypeError: MongoStore.create is not a function`
- Sessao parece funcionar, mas nao persiste.

Diagnostico: confira o `package.json` — em 5.x voce **importa
direto** o pacote (sem `default.create` ou `new`):

```js
const MongoStore = require("connect-mongo");
MongoStore.create({ mongoUrl: "..." });  // 5.x correto
```

### 7.4 O que vai pro Mongo

A collection `sessions` recebe documentos como:

```js
{
    _id: "abc123sid…",
    expires: ISODate("2025-08-13T…"),
    session: "{ \"cookie\": {...}, \"usuario\": {...}, \"flash\": {...} }"
}
```

E so JSON serializado. Util saber pra debugar via Compass.

---

<a id="8-flash-messages"></a>

## 8. Flash Messages

### 8.1 O problema

Voce processa um POST e quer mostrar "salvo com sucesso". Mas a
boa pratica diz para **redirecionar** depois de POST (padrao
**Post-Redirect-Get**, pra evitar reenvio do form com F5). O
problema: redirect e uma resposta nova, que vai pro GET — e o
GET nao sabe nada do POST anterior.

```
POST /produtos  ─▶ cria  ─▶ redirect
                                │
                                ▼
                            GET /produtos  ← como mostrar "Salvo!"?
```

### 8.2 A solucao

**Flash** e uma area da sessao que serve como "caixa de saida de
um sentido": voce escreve no POST, le **uma vez** no GET seguinte,
e some.

```js
// no POST
req.flash("sucesso", "Produto cadastrado.");
res.redirect("/produtos");

// no GET (geralmente via middleware)
const msgs = req.flash("sucesso");   // ← le E LIMPA
```

`req.flash(key)` sem segundo argumento devolve um **array** com
todas as mensagens daquela chave acumuladas e remove da sessao.

### 8.3 No projeto

- Pacote: `connect-flash`. Precisa estar **depois** do
  `express-session` no `app.use`.
- Convencao usada: chaves `sucesso` e `erro`.
- Lemos no middleware `injetarLocals.js` e jogamos em
  `res.locals.sucesso` / `res.locals.erro` para qualquer view.

### 8.4 Cuidados

- `req.flash` consome. Se voce chamar duas vezes na mesma request,
  a segunda volta vazio.
- A mensagem esta na **sessao** — se a sessao nao foi inicializada
  ou o cookie nao foi salvo, somem. Em geral isso indica um bug
  de ordem de middleware.

---

<a id="9-res-locals"></a>

## 9. res.locals — injetando dados em todas as views

### 9.1 O conceito

`res.locals` e um objeto vazio que **vive durante a request**.
Tudo que voce poe nele fica visivel **dentro de qualquer view
EJS** renderizada por aquela request, sem precisar passar
manualmente em `res.render(...)`.

```js
// middleware
res.locals.usuario = req.session.usuario;
next();

// rota
res.render("home", { titulo: "Home" });
//          ^ a view ainda enxerga `usuario`
```

### 9.2 Casos tipicos

- **Mensagens flash** lidas uma vez por request.
- **Token CSRF** que todo form precisa imprimir num `<input
  hidden>`.
- **Usuario logado** (so o nome, papel, foto…), pra header
  global.
- **URL atual** para marcar item de menu ativo.

### 9.3 No projeto

`middlewares/injetarLocals.js`:

```js
res.locals.sucesso   = req.flash("sucesso");
res.locals.erro      = req.flash("erro");
res.locals.csrfToken = typeof req.csrfToken === "function" ? req.csrfToken() : "";
res.locals.urlAtual  = req.originalUrl;
next();
```

Esse middleware tem que rodar **depois** de `session`, `flash` e
`csurf`, e **antes** das rotas que vao renderizar views. E o que
o `server.js` faz.

---

<a id="10-helmet"></a>

## 10. Helmet — headers de seguranca HTTP

`helmet()` e um pacote que adiciona varios headers HTTP de
seguranca de uma vez. Pense nele como "pacote padrao de portas
fechadas".

### 10.1 O que ele faz

Headers ligados por default na ultima versao (resumo):

| Header                            | Para que serve                                                                  |
|-----------------------------------|---------------------------------------------------------------------------------|
| `Content-Security-Policy`         | Define de quais origens scripts/styles/imgs podem vir. Defesa primaria contra XSS. |
| `Strict-Transport-Security`       | Forca o browser a so falar HTTPS pelo periodo X (HSTS).                         |
| `X-Content-Type-Options: nosniff` | Browser nao "adivinha" tipo MIME.                                               |
| `X-Frame-Options: SAMEORIGIN`     | Bloqueia seu site dentro de `<iframe>` em outros dominios (clickjacking).       |
| `Referrer-Policy`                 | Controla o que vai no header `Referer` em links saindo do seu site.             |
| `Cross-Origin-Opener-Policy`      | Isolamento de janelas — defesa contra Spectre.                                  |
| `Cross-Origin-Resource-Policy`    | Quem pode embutir seus recursos.                                                |
| `Origin-Agent-Cluster`            | Isolamento de agente.                                                           |
| `X-DNS-Prefetch-Control`          | Desliga prefetch DNS.                                                           |
| `X-Download-Options`              | Forca download em vez de abrir no IE (legado).                                  |
| `X-Permitted-Cross-Domain-Policies` | Bloqueia Flash/PDF cross-domain (legado, mas custa zero).                     |

### 10.2 Como ativar

```js
app.use(helmet());
```

Uma linha. Ja vale muito. Mas a **CSP** e o **HSTS** merecem
atencao especial.

### 10.3 CSP — quando ela quebra a pagina

A CSP padrao e **estrita**: bloqueia `<script>` e `<style>`
inline, scripts de outros dominios, etc. Em apps que usam CDN
(Bootstrap, fonts.google, Stripe.js, analytics), aparece no
console:

```
Refused to load the script 'https://cdn.example.com/x.js'
because it violates the following Content Security Policy directive
```

Solucoes:

- **Customizar** a politica:

  ```js
  helmet({
      contentSecurityPolicy: {
          directives: {
              "script-src": ["'self'", "https://cdn.example.com"],
              "style-src":  ["'self'", "'unsafe-inline'"],   // se precisa de inline
              "img-src":    ["'self'", "data:", "https:"],
          },
      },
  })
  ```

- **Mover scripts** pra `public/` e referenciar por caminho
  relativo. CSP libera `'self'` sem custo.

- **Desligar** so em dev:

  ```js
  helmet({ contentSecurityPolicy: ehProducao })
  ```

### 10.4 HSTS no localhost (Aula 146)

`Strict-Transport-Security` instrui o browser: **so fale comigo
em HTTPS pelos proximos N segundos** (default longo, tipo 180
dias). O browser **memoriza** isso por dominio.

Se voce ativa Helmet com HSTS rodando em `http://localhost:3000`,
o navegador pode entrar num estado em que tenta `https://localhost`
e da erro de certificado — voce fica preso achando que e bug do
seu codigo.

Recomendacao:

```js
app.use(helmet({
    contentSecurityPolicy: ehProducao,
    hsts:                  ehProducao,
}));
```

Em prod, atras de HTTPS de verdade, deixe ligado. Em dev, off.

---

<a id="11-csrf"></a>

## 11. CSRF — o ataque e a defesa com csurf

### 11.1 O ataque

**CSRF** = Cross-Site Request Forgery. O browser **anexa o cookie
de sessao automaticamente** em qualquer requisicao para o
dominio dele. Isso permite o seguinte:

```
1. Voce faz login em meubanco.com (cookie de sessao gravado).
2. Numa outra aba voce abre malicioso.com.
3. Malicioso.com tem:
       <form action="https://meubanco.com/transferir" method="POST">
           <input name="para" value="123">
           <input name="valor" value="9999">
       </form>
       <script>document.forms[0].submit()</script>
4. O browser envia o POST com SEU cookie. O servidor ve sessao
   valida e processa.
```

O ataque nao precisa **roubar** o cookie — ele se aproveita do
fato de o browser anexar.

### 11.2 A defesa: token sincronizado

A ideia: alem da sessao, exigir um **token aleatorio** em todo
POST/PUT/DELETE. O token:

- e gerado pelo servidor por sessao,
- e impresso no HTML legitimo (oculto, em todo formulario),
- e validado a cada request mutante.

Como o site malicioso **nao sabe** o token (so o seu HTML legitimo
tem), ele nao consegue forjar o request.

### 11.3 csurf

```js
const csrf = require("csurf");
app.use(csrf());
```

Depois disso:

- Toda request **GET/HEAD/OPTIONS** ganha um `req.csrfToken()`
  que retorna o token (string opaca).
- Toda request **POST/PUT/DELETE** e validada: precisa vir com o
  token em uma das fontes (em ordem):
    1. `req.body._csrf`
    2. `req.query._csrf`
    3. headers `X-CSRF-Token` ou `X-XSRF-Token`
- Se faltar/divergir, levanta um erro com `code === "EBADCSRFTOKEN"`.

### 11.4 Em formularios HTML

```html
<form action="/produtos" method="POST">
    <input type="hidden" name="_csrf" value="<%= csrfToken %>">
    <!-- demais campos -->
    <button type="submit">Salvar</button>
</form>
```

Note que o middleware `injetarLocals.js` injeta `csrfToken` em
`res.locals` para ficar disponivel sem voce passar em todo
`render`.

### 11.5 Em fetch/AJAX

```js
fetch("/produtos/123/excluir", {
    method:  "POST",
    headers: { "X-CSRF-Token": window.csrfToken },
});
```

Voce passa o token via header. Geralmente injetado por uma
`<meta>` ou `data-` no HTML inicial.

### 11.6 APIs JSON sem cookie

Se sua API e **stateless** (autentica via header `Authorization`,
nao via cookie), CSRF **nao se aplica** — porque o browser nao
anexa headers de auth automaticamente em requests cross-site,
diferente de cookies. Voce so precisa de CSRF se **cookies** sao
sua fonte de identidade.

### 11.7 Tratando o erro

```js
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        return res.status(403).send("Sessao invalida ou form expirado.");
    }
    next(err);
});
```

Causas tipicas: usuario abriu o form, foi almocar, sessao
expirou; abriu o site em duas abas e a sessao mudou; voce
esqueceu o `<input hidden>` no form.

### 11.8 Estado do csurf

`csurf` foi **deprecado** pelos mantenedores. Para projetos
novos em prod, considere alternativas como
[`csrf-csrf`](https://www.npmjs.com/package/csrf-csrf) (padrao
double-submit). Em ambiente de aprendizado, csurf ainda funciona
e e o que aparece em 90% dos tutoriais — por isso esta aqui.

---

<a id="12-ordem-middlewares"></a>

## 12. A ordem dos middlewares

Trocar a ordem nao quebra com erro, geralmente — a feature
silenciosamente para de funcionar. Por isso decore essa ordem:

```
1. helmet                        ← headers, antes de qualquer coisa
2. express.urlencoded / json    ← parse body
3. express.static                ← assets (escapam de auth/CSRF, é desejavel)
4. express-session               ← cookie de sessao
5. connect-flash                 ← depende de session
6. csurf                         ← depende de session
7. injetarLocals                 ← depende de flash + csurf
8. rotas                         ← consomem locals
9. 404 catch-all
10. handler de erro (4 args)     ← sempre por ULTIMO
```

### 12.1 Por que essa ordem

- **helmet** primeiro pra que mesmo respostas de erro tenham os
  headers.
- **body parsers** antes das rotas, claro — senao `req.body`
  estaria vazio.
- **static** geralmente cedo: voce nao quer que arquivos publicos
  passem por session/CSRF (custo desnecessario).
- **session** antes de **flash** e **csurf**: ambos guardam
  estado dentro de `req.session`.
- **csurf** antes das rotas, para que `req.csrfToken` exista.
- **injetarLocals** depois de tudo isso e antes das rotas, para
  empacotar `res.locals` consistente.
- **erro** com 4 args sempre por ultimo, senao Express o trata
  como middleware comum.

---

<a id="13-erros-comuns"></a>

## 13. Erros comuns e como diagnosticar

### `MongooseServerSelectionError: connect ETIMEDOUT`
- Atlas: IP nao liberado em **Network Access**.
- Local: `mongod` nao esta rodando.

### `MongooseError: Operation … buffering timed out after 10000ms`
- Voce chamou um `Model.find()` antes do `mongoose.connect`
  resolver. Garanta que o `app.listen` so roda apos a Promise
  do connect — ou aceite que o Mongoose vai bufferizar e
  re-tentar quando conectar.

### `ValidationError: Path X is required`
- Validacao do schema falhou. Sempre trate no controller
  (`if (err.name === "ValidationError")`) e mande pro flash em
  vez de explodir 500.

### `MongoStore is not a constructor`
- Mistura de API antiga (3.x) com pacote novo (5.x). Use
  `MongoStore.create({ mongoUrl })`.

### Sessao "esquece" toda hora
- `cookie.secure: true` em **dev sem HTTPS** — o browser nao
  guarda o cookie e voce perde a sessao a cada request. Solucao:
  `secure: ehProducao`.
- `sameSite: "strict"` num form em outra aba/dominio.

### Flash nao aparece
- `connect-flash` registrado **antes** de `express-session`.
- Voce esta lendo `req.flash()` duas vezes na mesma request — a
  primeira esvazia.
- Esqueceu de injetar em `res.locals` e nao passou em `render`.

### `EBADCSRFTOKEN`
- Form sem `<input name="_csrf" value="<%= csrfToken %>">`.
- Sessao expirou enquanto o form estava aberto.
- `csurf` antes de `express-session` (precisa estar depois).

### Pagina sem CSS/JS no Helmet
- CSP bloqueando. Veja o console do browser para a directive
  exata que falhou e ajuste `helmet({ contentSecurityPolicy: { directives: ... }})`.

### Browser insiste em `https://localhost`
- HSTS gravado em uma execucao anterior. Nos DevTools do Chrome:
  `chrome://net-internals/#hsts` → Delete domain. E desligue HSTS
  em dev (`hsts: false`).

---

<a id="14-glossario"></a>

## 14. Glossario rapido

- **ODM** — Object Document Mapper. Mongoose para o Mongo.
- **Schema** — descricao formal da forma de um documento.
- **Model** — classe gerada pelo Mongoose para CRUD.
- **ObjectId** — chave primaria gerada pelo Mongo (12 bytes).
- **Atlas** — Mongo hospedado oficialmente.
- **Compass** — cliente desktop pra inspecionar Mongo.
- **Sessao** — estado mantido no servidor, identificado por um
  cookie no cliente.
- **Store** — backend onde a sessao e gravada. `MemoryStore`
  (default), `connect-mongo`, `connect-redis`, etc.
- **Flash** — mensagem temporaria na sessao, lida e descartada
  no proximo GET.
- **PRG** — Post-Redirect-Get. Padrao que motiva flash.
- **Helmet** — pacote que aplica varios headers de seguranca.
- **CSP** — Content Security Policy. Whitelist de origens.
- **HSTS** — HTTP Strict Transport Security. Forca HTTPS.
- **CSRF** — Cross-Site Request Forgery. Ataque que se aproveita
  do envio automatico de cookies.
- **csurf** — middleware Express que implementa token sincronizado
  contra CSRF.
- **res.locals** — objeto por-request visivel em todas as views
  renderizadas naquela request.
- **Pipeline** — sequencia de middlewares que toda request
  atravessa antes de virar resposta.

---

## Como rodar o exemplo

```bash
cd src/02_module/express/08_mongodb_session_seguranca
cp .env.example .env       # ajuste MONGO_URI/SESSION_SECRET
npm install
npm start
```

Abra:

- `http://localhost:3000/produtos` — lista
- `http://localhost:3000/produtos/novo` — formulario

Tente:

- Cadastrar um produto valido → veja a flash verde no redirect.
- Cadastrar com nome `a` → flash vermelho com erro de validacao.
- Excluir um produto → flash de sucesso.
- Remover o `<input name="_csrf">` da view e tentar postar →
  voce vai bater no `EBADCSRFTOKEN`.
- Reiniciar o servidor → a sessao continua valida (graca ao
  connect-mongo).
