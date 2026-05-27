# dotenv + Mongoose — conexão, ordem do `listen` e primeiro model

Fala pessoal. Nesta aula fazemos três blocos relacionados aos **módulos** da app: garantir uma **URI segura fora do código**, **conectar ao MongoDB** antes de aceitar HTTP, e **modelar dados** com **Mongoose** (schema + primeiro documento de teste). Pressupõe projeto copiado da aula anterior, `npm install` já rodado nos pacotes já listados naquele projeto.

Este texto segue transcrições de aulas; o laboratório completo do mesmo arco está em **`src/02_module/express/08_mongodb_session_seguranca/`**. Lá você encontra `MONGO_URI`, `mongoose`, models e tratamento de erros em contexto maior (sessão, Helmet etc.).

Atlas / URI já preparados → [`01_servidor_atlas.md`](./01_servidor_atlas.md), [`02_projeto_atlas_do_zero.md`](./02_projeto_atlas_do_zero.md).

**Laboratório mínimo com o mesmo tema** (conexão, `emit("pronto")`, model, `.env`): pasta **`mongoDB/lab_dotenv_mongoose/`** — lá estão `server.js`, `src/models/HomeModel.js`, rotas/controlador exemplo, **`npm run seed`** para um insert sem ficar repetindo salvando arquivo com nodemon e o guia **`lab_dotenv_mongoose/AULA.md`** com explicações passo a passo deste projeto.

---

## 1. Pacotes novos nesta aula

São dependências da aplicação (não apenas de desenvolvimento):

```bash
npm install dotenv mongoose
```

- **`dotenv`** — ao carregar, lê arquivo **`.env`** na raiz (por convenção) e preenche `process.env.CHAVE`.
- **`mongoose`** — cliente ODM: abre pool de conexão, aceita **`mongoose.Schema`**, registra **`mongoose.model`** e validações (`required`, `type`, …) que o Mongo puro não impõe sozinho.

---

## 2. Boas práticas: não publicar URI nem senhas

Copiar connection string dentro de **`server.js`** funciona até alguém subir esse arquivo para GitHub. O hábito certo é:

1. `.env` na raiz com pares **`NOME_DA_VARIAVEL=valor`** — **não** é JavaScript: sem `const`, sem vírgulas; uma chave por linha.
2. No código, apenas `process.env.NOME_DA_VARIAVEL`.
3. `.gitignore` com **`.env`** e **`node_modules/`** para nunca irem para o remote.
4. No repositório do curso só um **`.env.example`** sem segredos, documentando nomes esperados das variáveis (neste repo, por exemplo **`MONGO_URI`**).

Primeira linha do entrypoint (antes de ler `process.env…` ligado ao deploy):

```js
require("dotenv").config();
```

No vídeo aparece exemplo com chave algo como **`CONNECTION_STRING`**; aqui em materiais combinamos **`MONGO_URI`** quando alinhamos com **`.env.example`** da pasta 08 — o nome importa menos que **ser o mesmo em `.env` e no código**.

---

## 3. Primeira conexão: `mongoose.connect`

```js
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI; // ou nome que você criou no .env

mongoose.connect(uri /*, opções segundo aviso da sua versão do Mongoose */);
```

A URI segue o que você montou nas aulas de Atlas (`mongodb+srv://…` ou `mongodb://127.0.0.1:27017/nome_do_banco`). O último segmento do path antes de `?` é o nome lógico do **database**.

Se o terminal mostrar **avisos de deprecação**, o próprio Mongoose costuma indicar um **segundo argumento** objeto (historicamente algo como usar API de topologia moderna — em versões novas vários defaults já mudaram). Siga sempre a mensagem/impressão da **versão que está instalada** no seu projeto.

---

## 4. Por que “conectar primeiro” e só depois `app.listen`

`mongoose.connect` devolve uma **Promessa**: você não controla milissegundos exatos até o cluster responder.

Se o Express já estiver **`listen`** antes do Mongo ficar estável:

- você pode até ver servidor “rodando”, mas alguma primeira requisição que toque código que usa o banco pode falhar de forma estranha;
- em cenários lentos ou com rede ruim isso aparece mais.

No vídeo usa-se uma ordem estrita:

1. Quando **`connect` resolver**, o app emite um evento (`app.emit('pronto')`).
2. Só dentro de **`app.once('pronto', …)`** (ou nome equivalente) você chama **`app.listen`** e loga algo como “servidor ouvindo”.

Fluxo esperado nos logs:

1. Conectei à base de dados.
2. Aplicação começou a escutar na porta.

Se preferir menos “event emitter” na app, você pode fazer **`mongoose.connect(uri).then(() => app.listen(porta)).catch(...)`**, que garante **listen após promise resolvida** — o importante é não expor HTTP como “pronto” antes do modelo de dados estar utilizável quando a rota depender disso.

**Nota sobre o laboratório atual em `08_…/server.js`:** hoje há `mongoose.connect(...).then/catch` no topo e **`app.listen`** depois das rotas sem estar encapsulado nesse mesmo `.then`; isso pode aceitar uma janela mínima de corrida até o primeiro `connect` completar. O padrão do vídeo (emit/`listen` após resolver) elimina mais essa janela se você aplicar igual no seu servidor.

Para falha irreversível de conexão, um **`.catch(err => { … })`** deve ao menos registrar o erro; em produção muitos processos fazem **`process.exit(1)`** após log para o orquestrador reiniciar o container/processo.

---

## 5. Modelo Mongoose para quem já veio do SQL

- **`mongoose.Schema`** — descreve **forma e regras** dos documentos (`type`, `required`, comprimentos, etc.).
- **`mongoose.model('NomeSingular', schema)`** — gera uma “classe de acesso”: create, find, etc.

MongoDB em si aceita qualquer formato de documento; **quem aplica tipo e obrigatoriedade** é o Mongoose antes de gravar quando você usa esse model.

Pluralização típica: model **`Room`** pode mapear collection **`rooms`** (regra plural em inglês do Mongoose). No Atlas / Compass você enxerga **database → collection → documents**.

Ao **gravar pela primeira vez**, Mongoose (e o servidor) criam lazy o **database** e a **collection** se não existirem — não é obrigatório criá-los primeiro no Atlas.

---

## 6. Exemplo mínimo de arquivo model

Algo no espírito do vídeo (`models/NomeModel.js`, nome PascalCase como “classe”):

```js
const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
});

module.exports = mongoose.model("Home", homeSchema);
```

No controller/route (só como demonstração rápida; em apps maiores você move lógica para camada dedicada):

```js
const MeuModel = require("./models/NomeModel");

MeuModel.create({ titulo: "…", descricao: "…" })
    .then((doc) => console.log(doc))
    .catch((err) => console.error(err));
```

Para **consultar vários**:

```js
MeuModel.find({}).then((lista) => console.log(lista));
```

`.create()` e `.find()` retornam promessas; em código novo também é comum `async`/`await` dentro de handlers.

---

## 7. O que o vídeo fecha com “ideal arquitetural”

Manipular **`Model.create`** direto no controller ensina fluência rápida, mas não é onde costuma ficar a regra de negócio. Padrões comuns: **camada repository / service**, ou método estático/instance no próprio schema, para validar fluxos antes de criar registros públicos pela rota HTTP.

Para um CRUD completo e segurança de sessões no mesmo projeto de estudo, continue em **`express/08_mongodb_session_seguranca/AULA.md`** (mapa lista aulas 138–146).

---

## Checklist rápido

| Feito | |
|-------|---|
| `npm install dotenv mongoose` | |
| `.env` com URI (`MONGO_URI` ou nome documentado em `.env.example`) | |
| `require('dotenv').config()` no topo | |
| `.gitignore` com `.env` e `node_modules` | |
| `mongoose.connect` + ordem antes de aceitar requests críticas | |
| `models/` + `Schema` + `model` + `create`/`find` smoke test | |

Grande abraço.
