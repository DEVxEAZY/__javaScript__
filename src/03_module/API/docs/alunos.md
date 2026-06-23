# Alunos — do átomo à API

Este guia explica **onde** os dados de aluno vivem, **como** entram no banco (seed e API) e **como** erros são tratados — na ordem em que o sistema foi construído.

---

## 1. Átomo: o arquivo de banco

Persistência local: **SQLite**, um único arquivo:

```text
database/app.db
```

Configurado em `.env`:

```env
DATABASE_URL="file:./database/app.db"
```

Dentro do arquivo existe a tabela física **`alunos`** (nome plural, snake_case nas colunas de data). O Express **não** abre o `.db` diretamente; só o **Prisma** fala com ele via `database/prisma.js`.

---

## 2. Modelo declarativo: `prisma/schema.prisma`

O “contrato” do que um aluno é no código:

```prisma
model Aluno {
  id        Int      @id @default(autoincrement())
  nome      String
  sobrenome String
  email     String   @unique
  sexo      String   // "M" ou "F"
  idade     Int
  peso      Float
  altura    Float
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("alunos")
}
```

| Campo Prisma | Coluna SQLite | Papel |
|--------------|---------------|--------|
| `id` | `id` | Chave primária, auto-incremento |
| `nome`, `sobrenome`, `email`, `sexo` | TEXT | Strings |
| `idade` | INTEGER | Inteiro |
| `peso`, `altura` | REAL | Números decimais |
| `createdAt` | `created_at` | Preenchido na criação |
| `updatedAt` | `updated_at` | Atualizado pelo Prisma em cada `update` |

`@@map("alunos")` → tabela no banco se chama `alunos`, mas no JS usamos `prisma.aluno` (singular, camelCase).

---

## 3. Histórico de estrutura: `prisma/migrations/`

Cada pasta em `migrations/` é um passo de **DDL** (criar/alterar tabela), não inserção de alunos.

Exemplos neste lab:

1. `20260531131537_init_alunos` — cria tabela `alunos` inicial.
2. `20260601142647_add_aluno_sexo_email_unique` — adiciona `sexo`, índice único em `email`.

Comando para aplicar:

```bash
npm run db:migrate
```

**Schema** = como o mundo deve ser **hoje**. **Migrations** = roteiro de como o banco chegou lá (reproduzível em outra máquina).

---

## 4. Client gerado: `generated/prisma/`

Após mudar o schema:

```bash
npm run db:generate
```

O Prisma gera tipos e métodos (`prisma.aluno.create`, `findMany`, etc.). A aplicação importa:

```js
import prisma from '../database/prisma.js';
```

---

## 5. Duas formas de **inserir** alunos

### 5.1 Seed (script, fora da API)

Arquivo: `prisma/seed.js`.

| Aspecto | Detalhe |
|---------|---------|
| Quando usar | Ambiente de estudo, popular 20 alunos fictícios |
| Comando | `npm run db:seed` |
| Comportamento | Apaga **todos** os alunos e insere 20 registros fixos do array no script |
| Passa por HTTP? | **Não** |
| Validação | Nenhuma em runtime — dados já são válidos no array |

Fluxo:

```text
node prisma/seed.js
  → prisma.aluno.deleteMany()  (se houver registros)
  → prisma.aluno.createMany({ data: alunos })
  → database/app.db
```

### 5.2 API REST (produção do lab)

Inserção “real” via HTTP, com validação e erros HTTP.

| Método | URL | Ação |
|--------|-----|------|
| `GET` | `/alunos` | Lista todos (ordenados por `id`) |
| `POST` | `/alunos` | Cria um aluno |
| `GET` | `/alunos/:id` | Busca por id |

Montagem em `app.js`:

```js
this.app.use('/alunos', alunoRoutes);
```

Rotas relativas em `routes/alunoRoutes.js`:

```js
router.get('/', alunoController.index);
router.post('/', alunoController.store);
router.get('/:id', alunoController.show);
```

---

## 6. Fluxo completo do `POST /alunos` (camadas)

```text
Cliente
  │  POST /alunos
  │  Content-Type: application/json
  │  Body: { nome, sobrenome, email, sexo, idade, peso, altura }
  ▼
app.js
  │  express.json()  → req.body
  ▼
routes/alunoRoutes.js
  │  router.post('/', alunoController.store)
  ▼
controllers/AlunoController.js
  │  alunoService.criar(req.body)
  │  erro de domínio → responderErroDeDominio → status JSON
  ▼
services/AlunoService.js
  │  validarPayload(body)
  │  prisma.aluno.create({ data })
  ▼
database/prisma.js  →  database/app.db (tabela alunos)
```

O controller **não** valida regra de negócio nem chama Prisma; só traduz HTTP ↔ service.

---

## 7. Tipos de dados aceitos na API

Corpo JSON (`POST /alunos`). Campos **obrigatórios**:

| Campo | Tipo no JSON | Regras no `AlunoService` |
|-------|----------------|-------------------------|
| `nome` | string | Não vazio após `trim` |
| `sobrenome` | string | Não vazio após `trim` |
| `email` | string | Formato email; salvo em minúsculas; **único** no banco |
| `sexo` | string | `"M"` ou `"F"` (maiúscula/minúscula aceita na entrada, normalizado para maiúscula) |
| `idade` | number | Inteiro entre **5** e **120** |
| `peso` | number | Entre **20** e **300** (kg) |
| `altura` | number | Entre **0.5** e **2.5** (metros, ex.: `1.72`) |

Campos **não** enviados pelo cliente (gerados pelo sistema):

| Campo | Quem define |
|-------|-------------|
| `id` | SQLite / autoincrement |
| `createdAt`, `updatedAt` | Prisma (`@default`, `@updatedAt`) |

### Exemplo de body válido

```json
{
  "nome": "Luiz",
  "sobrenome": "Otávio",
  "email": "luiz.otavio@escola.lab",
  "sexo": "M",
  "idade": 17,
  "peso": 70.5,
  "altura": 1.75
}
```

### Resposta de sucesso (`201 Created`)

Objeto completo do aluno, incluindo `id` e timestamps ISO 8601.

---

## 8. Tratamento de erros

### 8.1 Erros de domínio (service)

Arquivo: `errors/domainErrors.js`.

| Classe | Significado | HTTP (no controller) |
|--------|-------------|----------------------|
| `ValidationError` | Dados inválidos ou faltando | **400** |
| `ConflictError` | Email duplicado (`P2002` Prisma) | **409** |
| `NotFoundError` | `GET /alunos/:id` sem registro | **404** |

O service **lança** essas classes; não usa `res.status`.

Exemplos de mensagens **400**:

- `nome é obrigatório`
- `email inválido`
- `sexo deve ser "M" ou "F"`
- `idade deve ser um inteiro entre 5 e 120`
- `id inválido` (em `GET /alunos/abc`)

### 8.2 Mapeamento HTTP (controller)

Arquivo: `utils/responderErroDeDominio.js`.

```js
ValidationError  → 400  { "error": "mensagem" }
ConflictError    → 409  { "error": "mensagem" }
NotFoundError    → 404  { "error": "mensagem" }
```

Se o erro **não** for de domínio (bug, falha do Prisma inesperada), o controller faz `throw err` e o Express responde **500** (comportamento padrão).

### 8.3 Erros do Prisma tratados no service

| Código Prisma | Situação | Tratamento |
|---------------|----------|------------|
| `P2002` | Unique em `email` | `ConflictError('email já cadastrado')` |
| Outros | Falha não prevista | Propagados (`throw err`) |

### 8.4 Tabela rápida para testes

| Cenário | Status | Body exemplo |
|---------|--------|----------------|
| Cadastro OK | 201 | objeto aluno |
| Campo faltando | 400 | `{ "error": "email é obrigatório" }` |
| Email repetido | 409 | `{ "error": "email já cadastrado" }` |
| Id inexistente | 404 | `{ "error": "aluno não encontrado" }` |
| `GET /alunos/xyz` | 400 | `{ "error": "id inválido" }` |

---

## 9. Comandos úteis

```bash
cd src/03_module/API
npm run db:migrate   # estrutura
npm run db:seed      # 20 alunos + 8 usuários (ver docs/usuarios.md)
npm run dev          # API na porta 3001
npm run db:studio    # inspecionar app.db
```

### Exemplos curl

Listar:

```bash
curl http://localhost:3001/alunos
```

Criar:

```bash
curl -X POST http://localhost:3001/alunos \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Teste\",\"sobrenome\":\"Lab\",\"email\":\"teste.lab@escola.lab\",\"sexo\":\"F\",\"idade\":16,\"peso\":55,\"altura\":1.6}"
```

Buscar por id:

```bash
curl http://localhost:3001/alunos/1
```

---

## 10. Arquivos envolvidos (checklist)

| Arquivo | Função |
|---------|--------|
| `prisma/schema.prisma` | Modelo `Aluno` |
| `prisma/migrations/*` | SQL de evolução da tabela |
| `prisma/seed.js` | 20 alunos de demonstração |
| `database/prisma.js` | Conexão Prisma + SQLite |
| `services/AlunoService.js` | Validação + `create` / `findMany` / `findUnique` |
| `controllers/AlunoController.js` | HTTP |
| `routes/alunoRoutes.js` | Rotas |
| `errors/domainErrors.js` | Erros sem status HTTP |
| `utils/responderErroDeDominio.js` | Domínio → status JSON |
| `app.js` | `app.use('/alunos', alunoRoutes)` |

---

## 11. Seed vs API — quando usar qual

| | Seed | `POST /alunos` |
|--|------|----------------|
| Objetivo | Massa de dados para estudar | Um cadastro validado como na vida real |
| Validação | Não (dados fixos no código) | Sim (`AlunoService`) |
| Apaga existentes | Sim (`deleteMany` antes) | Não |
| Ideal para | Repor os 20 alunos após apagar o `.db` | Testar formulário, erros 400/409 |

Ambos gravam na **mesma** tabela `alunos`; o que muda é o **caminho** até o Prisma.
