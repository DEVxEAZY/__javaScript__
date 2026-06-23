# Prisma neste projeto — guia contextualizado

Este diretório (`prisma/`) é o **centro da persistência** do lab **API REST** (`src/03_module/API`). O projeto usa **Prisma ORM 7.8** com **SQLite** local (`better-sqlite3`) e **ESM** (`"type": "module"`). A stack substitui o **Sequelize** da aula de referência por um fluxo declarativo: schema → migrate → client gerado → queries tipadas.

Documentação oficial (consultada via Context7): [prisma.io/docs](https://www.prisma.io/docs).

---

## 1. O que o Prisma faz aqui (visão geral)

O Prisma divide o trabalho em três camadas que você enxerga no repositório:

| Camada | Onde fica | Papel neste lab |
|--------|-----------|-----------------|
| **Schema** | `prisma/schema.prisma` | Define modelos (`Aluno`), tipos, nomes de tabela/coluna (`@@map`, `@map`) |
| **Migrações** | `prisma/migrations/` | SQL versionado que cria/altera `database/app.db` |
| **Client** | `generated/prisma/` (gitignore) | API JavaScript gerada: `prisma.aluno.create(...)`, etc. |

Fluxo mental:

```mermaid
flowchart LR
  A[schema.prisma] -->|prisma migrate dev| B[migrations/*.sql]
  B --> C[(database/app.db)]
  A -->|prisma generate| D[generated/prisma]
  D --> E[database/prisma.js]
  E --> F[controllers / rotas Express]
```

**Diferença central vs Sequelize:** você não mantém `models/aluno.js` + `migrations/*.js` à mão. O modelo vive no schema; o SQL de migração é gerado; o client é gerado a partir do mesmo schema.

---

## 2. Como isso se encaixa na estrutura do projeto

```
src/03_module/API/
├── .env                          # DATABASE_URL (CLI + runtime)
├── prisma.config.ts              # Config do Prisma CLI (v7): schema, migrations, URL
├── prisma/                       # ← VOCÊ ESTÁ AQUI
│   ├── schema.prisma             # Modelo Aluno → tabela alunos
│   ├── migrations/               # Histórico SQL (não editar migração já aplicada)
│   └── README.md                 # Este guia
├── generated/prisma/             # Client gerado (não commitar)
├── database/
│   ├── prisma.js                 # Singleton PrismaClient + adapter SQLite
│   └── app.db                    # Arquivo SQLite (não commitar)
├── server.js                     # Carrega dotenv + side-effect de prisma.js
├── app.js / routes / controllers # Ainda sem CRUD de aluno; Prisma já está pronto
└── API_REST.MD                   # Visão geral da API + mapa Sequelize ↔ Prisma
```

### Arquivos que “conversam” com `prisma/`

| Arquivo | Relação com `prisma/` |
|---------|------------------------|
| `prisma.config.ts` | Diz ao CLI onde está o schema, pasta de migrations e `DATABASE_URL` |
| `database/prisma.js` | Instancia `PrismaClient` com adapter; importa de `generated/prisma/client.ts` |
| `server.js` | `import './database/prisma.js'` garante client carregado ao subir o servidor |
| `package.json` | Scripts `db:migrate`, `db:generate`, `postinstall` |
| `.env` | `DATABASE_URL="file:./database/app.db"` — mesma URL para CLI e app |

---

## 3. Prisma 7 — mudanças que importam neste lab

### 3.1 `prisma.config.ts` (URL fora do schema)

No Prisma 7, a **URL do banco não fica** no bloco `datasource` do `schema.prisma`. Fica em `prisma.config.ts` (CLI) e, com **driver adapter**, também na **aplicação** (`database/prisma.js`).

```prisma
// prisma/schema.prisma — sem url aqui
datasource db {
  provider = "sqlite"
}
```

```ts
// prisma.config.ts (raiz do projeto)
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: process.env["DATABASE_URL"] },
});
```

### 3.2 Driver adapter (SQLite)

Prisma 7 exige **adapter** para SQLite em runtime. Este projeto usa `@prisma/adapter-better-sqlite3`:

```js
// database/prisma.js
const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
```

A URL em produção/desenvolvimento vem de `.env`; o CLI usa a mesma variável via `prisma.config.ts`.

### 3.3 Generator `prisma-client` + output customizado

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}
```

Após `npm run db:generate`, importe:

```js
import { PrismaClient } from '../generated/prisma/client.ts';
```

O diretório `generated/prisma` está no `.gitignore`; `postinstall` roda `prisma generate` após `npm install`.

---

## 4. O schema deste projeto (`schema.prisma`)

```prisma
model Aluno {
  id        Int      @id @default(autoincrement())
  nome      String
  sobrenome String
  email     String
  idade     Int
  peso      Float
  altura    Float
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("alunos")
}
```

### Convenções de nome

| No schema | No banco | No Prisma Client |
|-----------|----------|------------------|
| `model Aluno` | tabela `alunos` (`@@map`) | `prisma.aluno` (camelCase do model) |
| `createdAt` | coluna `created_at` (`@map`) | `createdAt` nos objetos JS |
| `updatedAt` | `updated_at` | Preenchido automaticamente em updates |

Isso alinha o lab à aula Sequelize (tabela `alunos`, timestamps snake_case) sem forçar snake_case no código da API.

### Migração inicial já aplicada

`prisma/migrations/20260531131537_init_alunos/migration.sql` cria:

- Tabela `alunos` com colunas da aula (`nome`, `sobrenome`, `email`, `idade`, `peso`, `altura`, `created_at`, `updated_at`).

`migration_lock.toml` fixa `provider = "sqlite"` para o histórico de migrations.

---

## 5. Mapa Sequelize (aula) ↔ Prisma (este lab)

| Conceito / arquivo (aula) | Equivalente aqui |
|---------------------------|------------------|
| `.env` + `dotenv` | `.env` + `import 'dotenv/config'` em `server.js` e `prisma.config.ts` |
| `.sequelizerc` | `prisma.config.ts` + pasta `prisma/` |
| `config/database.js` | `DATABASE_URL` em `.env`; export opcional em `config/database.js` |
| `database/migrations/*.js` | `prisma/migrations/<timestamp>_<nome>/migration.sql` |
| `models/aluno.js` | `model Aluno` em `schema.prisma` |
| `database/index.js` (init) | `database/prisma.js` (singleton) |
| `sequelize-cli migration:generate` | Editar `schema.prisma` → `npm run db:migrate` |
| `sequelize-cli db:migrate` | Incluso em `prisma migrate dev` |
| `Aluno.create({ ... })` | `prisma.aluno.create({ data: { ... } })` |
| `Aluno.findAll()` | `prisma.aluno.findMany()` |
| `Aluno.findByPk(id)` | `prisma.aluno.findUnique({ where: { id } })` |
| `aluno.update({ ... })` | `prisma.aluno.update({ where: { id }, data: { ... } })` |
| `aluno.destroy()` | `prisma.aluno.delete({ where: { id } })` |

---

## 6. Comandos do dia a dia

Execute na raiz do projeto (`src/03_module/API`):

```bash
npm install              # postinstall → prisma generate
npm run db:migrate       # prisma migrate dev — cria/aplica migrations
npm run db:generate      # regenera client após mudar schema.prisma
npm run db:studio        # UI para ver/editar dados
npm run dev              # Express na porta 3001
```

### Quando usar cada um

| Situação | Comando |
|----------|---------|
| Primeira vez no repo / clone novo | `npm install` → `npm run db:migrate` |
| Alterou `schema.prisma` (novo campo, model) | `npm run db:migrate` (nome da migration interativo ou `--name`) |
| Só mudou schema e migrate já rodou | `npm run db:generate` (migrate dev já gera client na maioria dos casos) |
| Client desatualizado / erro de import | `npm run db:generate` |
| Explorar dados na `app.db` | `npm run db:studio` |

### Fluxo recomendado ao evoluir o modelo

1. Editar `prisma/schema.prisma`.
2. `npm run db:migrate` — Prisma compara schema com o banco, gera SQL em `prisma/migrations/`, aplica e regenera o client.
3. Usar o novo campo/model em controllers com `import prisma from '../database/prisma.js'`.

**Regra:** não edite manualmente uma pasta de migration já aplicada em ambientes compartilhados; crie uma nova migration.

---

## 7. Usar o Prisma Client nos controllers (próximo passo do lab)

O `HomeController` ainda não usa o banco. O encaixe previsto:

```js
// Exemplo: controllers/AlunoController.js (a criar)
import prisma from '../database/prisma.js';

// CREATE — equivalente a Aluno.create()
const aluno = await prisma.aluno.create({
  data: {
    nome: 'Luiz',
    sobrenome: 'Otávio',
    email: 'luiz@example.com',
    idade: 30,
    peso: 70,
    altura: 1.75,
  },
});

// READ — um registro
const um = await prisma.aluno.findUnique({ where: { id: 1 } });

// READ — lista
const todos = await prisma.aluno.findMany({
  orderBy: { id: 'asc' },
});

// UPDATE
const atualizado = await prisma.aluno.update({
  where: { id: 1 },
  data: { nome: 'Luiz Atualizado' },
});

// DELETE
await prisma.aluno.delete({ where: { id: 1 } });
```

### Padrões úteis para a API REST

```js
// Filtro + paginação simples
const pagina = await prisma.aluno.findMany({
  where: { idade: { gte: 18 } },
  take: 10,
  skip: 0,
  orderBy: { nome: 'asc' },
});

// Contagem
const total = await prisma.aluno.count();

// Upsert (cria ou atualiza por chave única — quando tiver @unique em email, por exemplo)
// await prisma.aluno.upsert({ where: { email: '...' }, create: {...}, update: {...} });
```

### Tratamento de erros (Express)

Erros comuns do client:

- `P2025` — registro não encontrado (`findUnique` / `update` / `delete`).
- `P2002` — violação de unique (quando adicionar `@unique` em `email`).

Exemplo em rota:

```js
try {
  const aluno = await prisma.aluno.findUniqueOrThrow({ where: { id: Number(req.params.id) } });
  return res.json(aluno);
} catch (e) {
  if (e.code === 'P2025') return res.status(404).json({ error: 'Aluno não encontrado' });
  throw e;
}
```

### Encerramento limpo (opcional)

Em scripts ou shutdown do servidor:

```js
await prisma.$disconnect();
```

---

## 8. Variáveis de ambiente

`.env.example`:

```env
DATABASE_URL="file:./database/app.db"
```

- Caminho **relativo à raiz do projeto** (`API/`), não à pasta `prisma/`.
- CLI (`migrate`, `studio`) e runtime (`PrismaBetterSqlite3`) devem usar a **mesma** URL.

### Trocar para MariaDB/MySQL (como na aula)

1. Criar schema `escola` no servidor.
2. Em `schema.prisma`: `provider = "mysql"` (ou `postgresql` conforme o servidor).
3. `.env`: `DATABASE_URL="mysql://usuario:senha@host:3306/escola"`.
4. Remover adapter SQLite de `database/prisma.js` e instanciar `PrismaClient` conforme [docs do provider](https://www.prisma.io/docs/orm/overview/databases/mysql).
5. `npm run db:migrate` — novo histórico ou baseline conforme ambiente.

`migration_lock.toml` deve refletir o provider (`sqlite` → `mysql`).

---

## 9. O que **não** commitar

| Item | Motivo |
|------|--------|
| `generated/prisma/` | Gerado por `prisma generate` |
| `database/app.db` | Dados locais SQLite |
| `.env` | Segredos / URL com senha |

Migrations em `prisma/migrations/` **devem** ir para o Git (histórico do schema).

---

## 10. Checklist: “está tudo certo?”

- [ ] `.env` existe com `DATABASE_URL` apontando para `database/app.db`
- [ ] `npm install` rodou sem erro (`postinstall` → generate)
- [ ] `npm run db:migrate` aplicou `init_alunos`
- [ ] `generated/prisma/client.ts` existe localmente
- [ ] `server.js` importa `./database/prisma.js`
- [ ] Controllers importam `prisma` default de `database/prisma.js`

---

## 11. Referências oficiais

- [SQLite + driver adapters](https://www.prisma.io/docs/orm/overview/databases/sqlite)
- [Upgrade to Prisma 7](https://www.prisma.io/docs/guides/upgrade-prisma-orm/v7)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
- [Custom model/field names (`@map`, `@@map`)](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/custom-model-and-field-names)
- [CRUD com Prisma Client](https://www.prisma.io/docs/orm/prisma-client/queries/crud)

Visão resumida da API: `../API_REST.MD`.
