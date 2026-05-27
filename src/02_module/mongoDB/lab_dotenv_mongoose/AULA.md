# Laboratório MongoDB — `dotenv`, Mongoose, Express e ordem da conexão

Este arquivo documenta **tudo que este projeto implementa**, alinhado às transcrições de aula sobre primeira conexão ao MongoDB, segurança de credenciais, **Schema**/Model do Mongoose e o padrão **“Mongo primeiro, HTTP depois”**. Para materiais escritos paralelos sobre Atlas ou teoria rápida, veja também:

- [`../01_servidor_atlas.md`](../01_servidor_atlas.md)
- [`../02_projeto_atlas_do_zero.md`](../02_projeto_atlas_do_zero.md)
- [`../03_dotenv_mongoose_conexao_e_model.md`](../03_dotenv_mongoose_conexao_e_model.md)

O laboratório completo com sessões, segurança e CRUD maior continua em **`../../express/08_mongodb_session_seguranca/`** (relativo a esta pasta do lab).

---

## Índice

1. [O que você aprende com este projeto](#1-o-que-você-aprende-com-este-projeto)
2. [Estrutura de pastas e responsabilidades](#2-estrutura-de-pastas-e-responsabilidades)
3. [Pacotes instalados (`package.json`)](#3-pacotes-instalados-packagejson)
4. [Variáveis de ambiente: `.env`, `.env.example` e `.gitignore`](#4-variáveis-de-ambiente-env-envexample-e-gitignore)
5. [O papel do `dotenv`](#5-o-papel-do-dotenv)
6. [O arquivo `server.js` passo a passo](#6-o-arquivo-serverjs-passo-a-passo)
7. [Esperar o Mongo antes de iniciar o HTTP](#7-esperar-o-mongo-antes-de-iniciar-o-http)
8. [`mongoose.connect`: promessa, sucesso e falha](#8-mongooseconnect-promessa-sucesso-e-falha)
9. [Modelo Mongoose (`src/models/HomeModel.js`)](#9-modelo-mongoose-srcmodelshomemodeljs)
10. [Controller (`src/controllers/homeController.js`)](#10-controller-srccontrollershomecontrollerjs)
11. [Rotas (`src/routes/homeRoutes.js`)](#11-rotas-srcrouteshomeroutesjs)
12. [Script `seed.js` — inserção única sem conflitar com nodemon](#12-script-seedjs--inserção-única-sem-conflitar-com-nodemon)
13. [Como executar na sua máquina](#13-como-executar-na-sua-máquina)
14. [O que aparece no MongoDB Atlas (Compass ou Browse Collections)](#14-o-que-aparece-no-mongodb-atlas-compass-ou-browse-collections)
15. [Lacunas comuns na URI e sintomas rápidos](#15-lacunas-comuns-na-uri-e-sintomas-rápidos)
16. [Próximo nível — arquitetura e limitações deste lab](#16-próximo-nível--arquitetura-e-limitações-deste-lab)
17. [Glossário](#17-glossário)

---

## 1. O que você aprende com este projeto

| Tema | Como aparece aqui |
|------|-------------------|
| Não guardar URI/senhas no código | `MONGO_URI` só existe em `.env`, versionado apenas em `.env.example` |
| Carregar `.env` no Node | Primeira linha útil relevante é `require("dotenv").config()` antes de ler `process.env` |
| Conectar ao MongoDB | `mongoose.connect(MONGO_URI)` retorna uma **Promise** |
| Aceitar HTTP **só** depois da conexão | `mongoose.connect(...).then(() => app.emit("pronto"));` + `app.once("pronto", () => app.listen(...))` |
| Definir forma dos documentos | `mongoose.Schema` com campos obrigatórios |
| “Classe” de acesso aos dados | `mongoose.model(...)` exportado por `HomeModel.js` |
| Dividir projeto em camadas simples | `routes` chamam `controllers`; model fica sob `models` |
| Inserção de exemplo sem espalhar código no controller | script `seed.js` e `npm run seed` |

---

## 2. Estrutura de pastas e responsabilidades

```
lab_dotenv_mongoose/
├── .env.example      # modelo de variáveis (sem segredos reais) — vai pro Git
├── .gitignore        # garante que .env e node_modules não vão ao repositório
├── package.json      # dependências e scripts npm
├── server.js         # ponto de entrada: Express + conexão + listen
├── seed.js           # executável à parte — um INSERT de exemplo
├── AULA.md           # esta documentação
└── src/
    ├── models/
    │   └── HomeModel.js       # Schema + model "Home"
    ├── controllers/
    │   └── homeController.js # lógica HTTP que usa o model (listar documentos)
    └── routes/
        └── homeRoutes.js     # só declara método + caminho → controller
```

**Por usar `src/`?** Nos cursos consolidados você costuma ter `models`, `controllers`, `routes` separados conforme um **padrão MVC simplificado**. Aqui já fica evidente onde **não misturar** definição de dados (schema) com roteamento ou com script de migração/seed separado.

---

## 3. Pacotes instalados (`package.json`)

| Pacote | Papel neste projeto |
|--------|---------------------|
| **express** | Servidor HTTP: rotas GET, middlewares (`express.json`), `listen` na porta configurável |
| **mongoose** | Conexão com MongoDB na nuvem ou local **e** Schema/Model/query (`connect`, `find`, `create`) |
| **dotenv** | Lê arquivo `.env` na raiz (por omissão) e preenche `process.env` |

Todos são **`dependencies`** (não `devDependencies`): em produção o processo também precisa deles — não apenas na sua máquina de desenvolvimento.

**Scripts definidos:**

- `npm start` → `node server.js` — sobe o servidor **com** todas as rotas.
- `npm run seed` → `node seed.js` — apenas conecta, insere **um** documento e fecha a conexão.

---

## 4. Variáveis de ambiente: `.env`, `.env.example` e `.gitignore`

### Por que arquivo `.env`?

A **URI** do Atlas contém **usuário e senha**. Colar isso em `server.js` e dar `git push` expõe credenciais. A prática habitual é:

- Colocar **apenas nome da variável e valor secreto** no `.env` na raiz deste projeto.
- **Nunca** versionar `.env`; versionar apenas **`.env.example`** com placeholders (como em `mongodb+srv://USUARIO:SENHA@...`).

### Formato das linhas no `.env`

- Uma linha por variável no formato **`NOME_DA_VARIAVEL=valor`** (sem espaços antes ou depois do `=` quando o valor é simples).
- **Não** é JavaScript: sem `const`, sem aspas obrigatórias (você só as usa quando o valor embute espaços ou caracteres que confundiriam o parser).
- Comentários começando com **`#`** na mesma sintaxe aceita em `.env.example`.

### Este laboratório espera pelo menos:

- **`MONGO_URI`** — string completa incluindo usuário/senha/host/database path.
- **`PORTA`** (opcional; padrão 3000 se ausente ou inválido) — veja `server.js`: `Number(process.env.PORTA) || 3000`.

### Por que nome `MONGO_URI`?

Nome é convenção próxima ao usado na pasta maior **`08_mongodb_session_seguranca`**, onde aparece **`MONGO_URI`** em `.env.example`. O importante é **ser igual** ao que o código lê (`process.env.MONGO_URI`).

### `.gitignore`

Contém **`node_modules/`** e **`.env`**. Assim, um `git add .` habitual **não** envia pacotes externos nem seu segredo. Se no futuro aparecer arquivo com credenciais com outro nome, **adicione esse nome também** ao `.gitignore`.

---

## 5. O papel do `dotenv`

Chamar **`require("dotenv").config()`** o mais **cedo possível** (no topo de `server.js` e igualmente em `seed.js`) garante:

1. Ao avaliar **`const MONGO_URI = process.env.MONGO_URI`** a variável **já** foi hidratada a partir do `.env`.

`dotenv` **não** “cria” variáveis de ambiente mágicas fora deste arquivo: ele apenas **lê o disco** e **preenche** `process.env` para este processo Node.

**Em produção**, muitos provedores (**Render**, **Railway**, **Fly.io**, Kubernetes, etc.) **não** usam arquivo `.env` no disco; você configura **`MONGO_URI` no painel** e ele já chega em `process.env`. O mesmo código **`process.env.MONGO_URI`** funciona nos dois cenários desde que você carregue `dotenv` só em desenvolvimento se quiser otimização — não é necessário mudar este lab para já entender esse desdobramento.

---

## 6. O arquivo `server.js` passo a passo

Ordem recomendada de leitura do código atual:

### 6.1. Carregar `.env`

```javascript
require("dotenv").config();
```

Primeiro efeito colateral importante do programa.

### 6.2. Importar bibliotecas e rotas

- `express()` cria **`app`**.
- `mongoose` será usado depois apenas para **`connect`** neste arquivo.
- **`homeRoutes`** traz todas as URLs deste exemplo montadas sob `/`.

### 6.3. Middlewares globais antes do primeiro request

```javascript
app.use(express.json());
app.use("/", homeRoutes);
```

**`express.json()`** permite `req.body` JSON em métodos POST/PUT quando você estender o projeto — aqui já deixa **padrão de app real**. **Rotas** montadas logo em seguida.

### 6.4. Fallback 404 + handler de erro

```javascript
app.use((_req, res) => { res.status(404).send("Nao encontrado"); });
app.use((err, _req, res, _next) => { ... });
```

- O middleware **404** não recebe **`next`** porque ele **terminaliza** sem erros.
- O middleware **`(err, req, res, next)` com 4 parâmetros** é convenção Express: apenas erros lançados com `next(err)` nos controllers são tratados aí neste projeto (exemplo: falha ao falar com Mongo dentro de **`homeController.listar`**).

### 6.5. Ler portas e validar **`MONGO_URI`**

Sem URI o processo **encerra explicitamente com código 1**:

```javascript
if (!MONGO_URI) {
    console.error("Defina MONGO_URI...");
    process.exit(1);
}
```

Isso evita comportamento estranho (listener subindo mas conexão inexistente) em ambiente novo mal configurado.

### 6.6. `mongoose.connect`, `emit("pronto")` e `app.once(...)`

Trecho principal (promessa resolve → log → evento único antes do `listen`):

```52:61:c:/__dev_ops__/___study___/__javaScript__/src/02_module/mongoDB/lab_dotenv_mongoose/server.js
mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Conectei na base de dados.");
        app.emit("pronto");
    })
    .catch((err) => {
        console.error("Erro na conexao com o Mongo:", err.message);
        process.exit(1);
    });
```

Registro do ouvinte (no arquivo aparece logo abaixo do bloco anterior):

```63:67:c:/__dev_ops__/___study___/__javaScript__/src/02_module/mongoDB/lab_dotenv_mongoose/server.js
app.once("pronto", () => {
    app.listen(PORTA, () => {
        console.log(`Aplicativo escutando em http://localhost:${PORTA}`);
    });
});
```

Por que **`once`** em vez de **`on`?** Como o evento **“pronto”** deve disparar só **uma vez** quando a conexão Mongo termina bem, **`once`** impede registros acidentais múltiplos se futuramente alguém chamar **`emit`** de novo ao refatorar.

---

## 7. Esperar o Mongo antes de iniciar o HTTP

### O problema informal

Na aula aparece assim: se você chama **`app.listen`** logo após iniciar **`mongoose.connect`**, mas **antes** da promessa resolver, um cliente **teoricamente poderia** bater uma rota no intervalo curto até o handshake com o Atlas terminar — e dependendo do primeiro handler, isso aparece como falha estranha.

Na prática, com **`mongoose`**, há **buffer temporário**: em muitos casos a primeira operação apenas **demora até conectar**. Mas filosoficamente a aula diz: **servidor público só depois da dependência estar pronta** — é um bom exercício sobre **coordenar trabalho assíncrono**.

### Como as peças se encaixam

| Passo cronológico | O que você observa no terminal |
|-------------------|------------------------|
| 1 Processo Node inicia | Middlewares já existem mas **idealmente** ainda não devia haver servidor ouvindo (aqui garantimos esperando **`emit`**). |
| 2 Promise de **`connect`** resolve | Log `"Conectei na base de dados."` aparece primeiro. |
| 3 **`app.emit("pronto")`** | Listener cadastrado com **`once`** corre. |
| 4 **`app.listen`** | Log da porta aparece só depois. |

### Alternativa igualmente válida (só menos “event-bus” neste arquivo)

Às vezes você vê apenas:

```javascript
mongoose.connect(MONGO_URI)
  .then(() => app.listen(PORTO, ...))
  .catch(...)
```

Funcionalmente garante **`listen`** após **`connect`** sem recorrer a eventos próprios do **`app`**. **`app`** no Express também é um **`EventEmitter`**, por isso o padrão **`emit` / `once`** aparece com frequência nos cursos para ensinar esse encadeamento.

---

## 8. `mongoose.connect`: promessa, sucesso e falha

### O que **`connect`** realmente faz

Abre gerenciamento de **pool de conexões TCP** até o servidor Mongo (Atlas ou **`mongod` local**). Com **`mongoose`** você **costuma usar um único** **`connect`** global — não há necessidade típica de ligar/desligar a cada query no servidor web.

### Promessa: `then` e `catch`

- **`then`**: apenas log + **`emit("pronto")`** em caso de **sucesso**.
- **`catch`**: registra erro e **`process.exit(1)`**. Em produção o orquestrador (systemd/Docker/etc.) poderia reiniciar o processo com essa política.

### Mongoose neste laboratório (versão 8.x no `package.json`)

Comentários no topo do `server.js` lembram que em **Mongoose ≥ 8** muitos avisos de versões antigas sobre **`useUnifiedTopology`** já não aparecem. Vídeos gravados sobre **5.x** às vezes copiam um **segundo argumento** em `mongoose.connect`; se o seu projeto mostrar **`warning`** apontando opções específicas, siga o texto oficial da **versão exata** instalada (`npm list mongoose`).

---

## 9. Modelo Mongoose (`src/models/HomeModel.js`)

```5:16:c:/__dev_ops__/___study___/__javaScript__/src/02_module/mongoDB/lab_dotenv_mongoose/src/models/HomeModel.js
const homeSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Home", homeSchema);
```

### Conceito: Schema Mongoose versus Mongo “puro”

Mongo armazena **BSON** (documentos) sem obrigar que todos os documentos de uma coleção tenham os mesmos campos. Ou seja, **MongoDB sozinho não aplica obrigatoriedade de campos antes de você gravar**; quem garante formato e validações ao usar estas APIs são os **schemas** do Mongoose e as operações pelo **Model**.

### Campos

- **`type: String`**: valores não string podem até ser convertidos/coagidos segundo regras do Mongoose; por ora pense apenas “texto”.
- **`required: true`**: tentativas de **`create`** ou **`save`** sem **`titulo`** ou **`descrição`** devem falhar por validação (tipicamente erro de validação Mongoose antes da persistência ser aceita segundo o schema).

### `mongoose.model("Home", ...)` versus nome físico na base

O primeiro argumento **`"Home"`** é o nome **singular** do model registrado dentro do Mongoose.

**Regra habitual do Mongoose:** pluralização próxima de inglês leva coleção física **`homes`** dentro do database mencionado no path da **`MONGO_URI`**.

Ou seja, no Atlas: database com o nome do **último segmento** antes de `?` na URI de exemplo (**`aulas`** no `.env.example`, se você não mudou path) → collection **`homes`** → vários documentos.

Se na aula o professor usasse **`mongoose.model('Room')`**, apareceria **`rooms`** como nome de coleção.

### Export **CommonJS**: **`module.exports = ...`**  

Compatível com todo o restante do curso usando **`require`**.

---

## 10. Controller (`src/controllers/homeController.js`)

```5:11:c:/__dev_ops__/___study___/__javaScript__/src/02_module/mongoDB/lab_dotenv_mongoose/src/controllers/homeController.js
exports.listar = async (_req, res, next) => {
    try {
        const documentos = await Home.find({}).lean();
        res.json(documentos);
    } catch (err) {
        next(err);
    }
};
```

### Por **`async`/await

**`await Home.find`** deixa esse handler legível; é equivalente a **`Home.find({}).then(...).catch`** — escolha de estilo. O curso já falou sobre promessas: aqui há **mais **`await`** aninhável se você aumentar código.

### Por **`{}.lean()`**

Por padrão Mongoose envolve resultado em documentos **`Mongoose` com comportamento próprio **`save`/`toObject`/...**. **`lean()`** devolve objetos JS **simples**. Para **lista JSON em API** você **reduz trabalho**. Se precisasse chamar método de instance no objeto retornado, **não** usaria **`lean()`**.

### Por **`next(err)` em caso falha Mongo

Delega erro ao middleware de erro com **4 argumentos**, retornando resposta **`500`** genérica neste lab.

Na aula aparece também o arquiteto ideal eventual: **controllers finos**, **business rules** dentro de classe de serviço ou métodos estácticos sobre model quando sistema cresce — aqui ainda há **consulta trivial** apenas para didática.

---

## 11. Rotas (`src/routes/homeRoutes.js`)

Há dois endpoints:

| Método caminho | O que faz |
|----------------|-----------|
| **`GET /`** | Página texto simples com instruções (`.type("html")` + **`pre`**) |
| **`GET /documentos`** | Chama **`homeController.listar`** → **`JSON`** array |

**Por montar **`app.use("/", homeRoutes)`** no servidor:

Tudo prefixado relativamente **`/`**. Se houvesse **`app.use("/api", router)`**, precisarias ajustes.

---

## 12. Script `seed.js` — inserção única sem conflitar com nodemon

### Situação didática reproduzida

No vídeo, colocava-se **`Home.create`** no controller e rodava servidor com **`nodemon`**: **cada save** repetia **`create`** ⇒ **spam de registros**.

### Como isolamos problema

**`seed.js`** separado:

```22:32:c:/__dev_ops__/___study___/__javaScript__/src/02_module/mongoDB/lab_dotenv_mongoose/seed.js
mongoose
    .connect(MONGO_URI)
    .then(async () => {
        const doc = await Home.create({
            titulo: "Titulo de teste",
            descricao: "Descricao exemplo — seed da aula.",
        });
        console.log("Documento criado:");
        console.log(doc.toObject());
        await mongoose.connection.close();
        process.exit(0);
    })
```

- Conecta, insere documento válido segundo schema, faz log, fecha conexão, encerra **process.exit(0)**.
- Rode **`npm run seed`** apenas quando quer popular — **servidor **`server.js`** não precisa estar rodando simultaneamente** (você até pode, porque Atlas aceita multitarefa, só costuma causar menos confuso separar.)

### **`toObject()`** no **`console.log`**

Mostra **POJO plain** omitindo internals extras do **`Document`** do Mongoose quando conveniente apenas para ler no terminal.

---

## 13. Como executar na sua máquina

Fluxo esperado primeira vez Windows/**Git Bash**/**PowerShell** (ajuste comandos **`cp`**):

```bash
cd src/02_module/mongoDB/lab_dotenv_mongoose

# criar seu .env a partir do template
cp .env.example .env           # Bash / Git Bash macOS/Linux
copy .env.example .env         # cmd Windows clássico

# edição manual obrigatória: coloque MONGO_URI real com senha atualizada Atlas

npm install
npm run seed      # opcional — cria exemplo
npm start
```

**Abrir**:

- **`http://localhost:3000/`** — página de texto de ajuda
- **`http://localhost:3000/documentos`** — JSON (**`[]`** se coleção sem documentos até rodar **`seed`**)

### Testando API via **`curl`** (opcional):

```bash
curl -s http://localhost:3000/documentos
```

---

## 14. O que aparece no MongoDB Atlas (Compass ou Browse Collections)

Após seed ou primeira inserção real:

**Database**: nome igual ao último segmento path da **`MONGO_URI`** (exemplo template: **`aulas`**, **mudável** só editando texto final da sua string).

**Collection**: **`homes`**.

Um documento de exemplo contém os campos:

- **`_id`**: **`ObjectId` gerado automaticamente**
- **`__v`** (version key padrão em schema simples primeiro insert) — comportamento opcional configurável (**`optimisticConcurrency`** tema avançado; ignore por ora)
- **`titulo`/`descricao`** string

Rodar **`seed`** múltiplas vezes cria vários registros válidos repetidos — apenas saiba diferenciar de produção onde seed costuma deduplicação.

---

## 15. Lacunas comuns na URI e sintomas rápidos

| Sintoma rápido | Causas frequentes |
|----------------|-------------------|
| **`authentication failed`** | Senha/usuário errados **ou caracteres especiais na senha** sem **`encodeURIComponent` na URI antes de interpolar `@`** |
| Timeout / servidor selecionar host falha Network | **`Network Access` Atlas** pendente ou IP não liberado; firewall corporativo bloqueando **SRV**/TLS |
| Banco aparece só após primeira gravação | Normal — Mongo só materializa coleção física primeiro insert |
| `[]` sempre em **`/documentos`** | Seeds nunca foram executados e ninguém **`create`** ainda pela app |
| `Cannot find module 'dotenv'` (ou similar) | Rode **`npm install`** na pasta **`lab_dotenv_mongoose`** |

Documentação maior sobre erros típicos: **`express/08_mongodb_session_seguranca/AULA.md`**.

---

## 16. Próximo nível — arquitetura e limitações deste lab

**Propositalmente simples**:

- Um único arquivo de servidor com conexão (em apps maiores separa arquivo **`database.js`**).
- Middleware Global de erro apenas genérico.
- Sem timeouts customizados, sem reconectar event loop após **`disconnected`**.
- Sem **`helmet`/CSRF**/sessões — porque foco inicial é apenas **persistência primeiro passo.**

**Orientação próximos passos**:

- Migrar **`create`/validações com regras** para camada própria.
- Produção usar variáveis de ambiente hospedagem + talvez arquivo **secrets manager**.
- Índices, paginação, filtros **`find`**, sanitização entrada HTTP.

Projeto já existente combinando segurança: **`src/02_module/express/08_mongodb_session_seguranca/`**.

---

## 17. Glossário

| Termo | Significado rápido |
|-------|----------------------|
| **URI / connection string** | Texto **`mongodb+srv://`** ou **`mongodb://`** mais credenciais e path database |
| **Atlas** | Hospedagem MongoDB gerenciada na nuvem |
| **`dotenv`** | Pacote que lê o arquivo `.env` e preenche `process.env` |
| **`process.env`** | Mapa runtime de strings ambiente vista pelo processo atual |
| **Schema Mongoose** | Definição de campos/validações de documentos |
| **Model** | API JS para CRUD usando schema compilado (`Home.find`, **`Home.create`**) |
| **Collection** | “Tabela lógica” Mongo — aqui **`homes`** |
| **ODM** | *Object Document Mapper* — mongoose encaixa documentos OO em JS sobre driver Mongo |

---

Ao final você consegue explicar: credenciais fora do Git; `dotenv.config()` no topo; `mongoose.connect` concluído antes de `app.listen` neste projeto (via `emit('pronto')` + `once`); Schema + Model + controllers + routes mínimos; e `seed.js` opcional para a primeira gravação.

Se algo da interface Atlas mudar, continue tratando apenas **nome variável igual ao código**, **IPs liberados**, e **usuário/password coerentes** — o Node deste projeto permanece igual.
