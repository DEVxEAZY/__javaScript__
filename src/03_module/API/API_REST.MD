 # API REST — lab (`src/03_module/API`)

Projeto Express em **ESM** (`"type": "module"`). Persistência com **Prisma 7** (em vez de Sequelize da aula de referência).

## Prisma vs Sequelize (mapa mental)

| Aula (Sequelize) | Este lab (Prisma) |
|------------------|-------------------|
| `.env` + `dotenv` | Igual: `.env` + `import 'dotenv/config'` em `server.js` e `prisma.config.ts` |
| `.sequelizerc` (caminhos) | `prisma.config.ts` + pasta `prisma/` |
| `src/config/database.js` | `DATABASE_URL` no `.env`; CLI lê via `prisma.config.ts` |
| `src/database/migrations/*.js` | `prisma/migrations/` geradas por `npm run db:migrate` |
| `src/models/aluno.js` | `model Aluno` em `prisma/schema.prisma` |
| `src/database/index.js` (init models) | `database/prisma.js` (singleton `PrismaClient`) |
| `npx sequelize-cli migration:generate` | `npx prisma migrate dev --name nome_da_mudanca` |
| `npx sequelize-cli db:migrate` | incluso em `prisma migrate dev` |
| `Aluno.create({ ... })` | `prisma.aluno.create({ data: { ... } })` |

## Estrutura

```
API/
├── prisma/
│   ├── schema.prisma      # modelos + provider (sqlite | mysql)
│   └── migrations/        # histórico (nunca editar migração já aplicada em produção)
├── generated/prisma/      # client gerado (gitignore); import em `database/prisma.js` usa `client.ts`
├── database/
│   ├── prisma.js          # PrismaClient + adapter better-sqlite3
│   └── app.db             # SQLite local (gitignore)
├── prisma.config.ts
├── .env / .env.example
└── ...
```

## Comandos

```bash
cd src/03_module/API
npm install
npm run db:migrate    # cria/aplica migrações (ex.: tabela alunos)
npm run db:generate   # regenera o client após mudar schema.prisma
npm run dev
```

## Camadas (usuários)

| Pasta | Papel |
|-------|--------|
| `routes/` | URL + método HTTP |
| `controllers/` | `req`/`res` → chama service → status JSON |
| `services/` | Regras de negócio + Prisma |
| `errors/domainErrors.js` | Erros de domínio (sem código HTTP) |

Fluxo: `POST|GET /usuarios` → `UsuarioController` → `UsuarioService` → `database/prisma.js`.  
Alunos: `GET|POST /alunos`, `GET /alunos/:id` → `AlunoController` → `AlunoService`.

## Usuários

Documentação completa (senha, bcrypt, seed): **[docs/usuarios.md](./docs/usuarios.md)**.

| Item | Detalhe |
|------|---------|
| Tabela | `usuarios` (`model Usuario`) |
| Campos | `email` (unique), `senha_hash` (bcrypt, nunca retornado na API) |
| Rota | `POST /usuarios` — body: `{ "email", "senha" }` |
| Rota | `GET /usuarios/:id` — perfil público (id, email, timestamps) |
| Seed | 8 contas em `prisma/seed-data/usuarios.demo.js` — `npm run db:seed` |

## Alunos

Documentação completa (átomo → API → erros): **[docs/alunos.md](./docs/alunos.md)**.

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/alunos` | Lista todos |
| `POST` | `/alunos` | Cria (body validado em `AlunoService`) |
| `GET` | `/alunos/:id` | Um aluno por id |

**Seed:** `npm run db:seed` — 20 alunos + 8 usuários com senha hasheada — ver `docs/alunos.md` e `docs/usuarios.md`.

## MariaDB na nuvem (opcional)

1. Criar schema `escola` no servidor (como na aula).
2. Em `prisma/schema.prisma`, trocar `provider = "sqlite"` por `provider = "mysql"`.
3. No `.env`: `DATABASE_URL="mysql://usuario:senha@host:3306/escola"`.
4. `npm run db:migrate`.

## Referências

- [Prisma — SQLite](https://www.prisma.io/docs/orm/overview/databases/sqlite)
- [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate)
