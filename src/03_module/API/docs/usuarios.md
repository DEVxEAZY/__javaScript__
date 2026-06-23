# Usuários — do átomo ao seed (com senha)

Guia do recurso **usuários**: conta com **email + senha**, armazenamento seguro (`senha_hash`) e população via **seed** (sem expor senha na API).

---

## 1. Átomo: tabela `usuarios`

Arquivo SQLite: `database/app.db`, tabela **`usuarios`**.

| Coluna SQLite | Campo Prisma | Tipo | Observação |
|---------------|--------------|------|------------|
| `id` | `id` | INTEGER PK | Auto-incremento |
| `email` | `email` | TEXT UNIQUE | Login / identificador |
| `senha_hash` | `senhaHash` | TEXT | **bcrypt** — nunca a senha em claro |
| `created_at` | `createdAt` | DATETIME | Criação |
| `updated_at` | `updatedAt` | DATETIME | Atualização automática |

Modelo em `prisma/schema.prisma`:

```prisma
model Usuario {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  senhaHash String   @map("senha_hash")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("usuarios")
}
```

Não há campo `senha` no banco — só o hash.

---

## 2. Senha: texto → hash (bcrypt)

Utilitário: `utils/password.js`.

```js
import bcrypt from 'bcrypt';

export async function hashSenha(senha) {
  return bcrypt.hash(senha, 10);
}
```

| Etapa | Onde | O quê |
|-------|------|--------|
| Entrada | Body da API ou seed | Senha em texto (ex. `escola123`) |
| Processamento | `hashSenha()` | Gera string bcrypt (`$2b$10$...`) |
| Persistência | coluna `senha_hash` | Só o hash |
| Resposta HTTP | `UsuarioService` / controller | **Nunca** inclui `senha` nem `senhaHash` |

Função auxiliar no service:

```js
function usuarioPublico(usuario) {
  const { senhaHash, ...rest } = usuario;
  return rest;
}
```

---

## 3. Duas formas de criar usuário

### 3.1 Seed (recomendado para o lab)

| Item | Detalhe |
|------|---------|
| Comando | `npm run db:seed` |
| Dados | `prisma/seed-data/usuarios.demo.js` |
| Quantidade | 8 usuários fictícios |
| Senha no banco | Sempre **hash** via `hashSenha()` em `prisma/seed.js` |
| Apaga antes? | Sim — `deleteMany()` em `usuarios` e `alunos` |

Fluxo:

```text
npm run db:seed
  → seedAlunos()     (20 alunos)
  → seedUsuarios()
       para cada usuariosDemo:
         email normalizado (minúsculas)
         senhaHash = await hashSenha(senhaPlana)
         prisma.usuario.create({ email, senhaHash })
  → console: tabela de credenciais do lab
```

### 3.2 API `POST /usuarios`

Mesma regra de hash, com validação em `UsuarioService.criar()`:

| Campo body | Regra |
|------------|--------|
| `email` | Obrigatório, formato válido, minúsculas ao salvar |
| `senha` | Obrigatória, mínimo **6** caracteres |

Erros comuns: **400** validação, **409** email duplicado.

```bash
curl -X POST http://localhost:3001/usuarios \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"novo@escola.lab\",\"senha\":\"minhasenha1\"}"
```

Resposta **201** (sem senha):

```json
{
  "id": 9,
  "email": "novo@escola.lab",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 4. Credenciais do seed (desenvolvimento)

Definidas em `prisma/seed-data/usuarios.demo.js`. **Não use em produção.**

| Email | Senha (texto, só no lab) | Perfil |
|-------|--------------------------|--------|
| `admin@escola.lab` | `admin2026` | Administrador |
| `maria.prof@escola.lab` | `escola123` | Professora |
| `joao.coord@escola.lab` | `escola123` | Coordenador |
| `ana.aluna@escola.lab` | `escola123` | Aluna (portal) |
| `bruno.aluno@escola.lab` | `escola123` | Aluno (portal) |
| `secretaria@escola.lab` | `escola123` | Secretaria |
| `suporte@escola.lab` | `escola123` | Suporte |
| `visitante@escola.lab` | `escola123` | Visitante demo |

Constantes no código:

- `SENHA_PADRAO_LAB = 'escola123'`
- `SENHA_ADMIN_LAB = 'admin2026'`

Ao rodar o seed, a lista é impressa no terminal.

---

## 5. Fluxo HTTP (cadastro e perfil público)

### `POST /usuarios` — criar conta

```text
Cliente → POST /usuarios { email, senha }
  → usuarioRoutes → UsuarioController.store
  → UsuarioService.criar
       validarCadastro
       hashSenha(senha)
       prisma.usuario.create
  → 201 + usuarioPublico (sem senhaHash)
```

### `GET /usuarios/:id` — perfil público

Retorna só: `id`, `email`, `createdAt`, `updatedAt`.

```text
UsuarioService.buscarPerfilPublico(id)
  → NotFoundError se não existir → 404
```

**Não** expõe senha nem hash.

---

## 6. Tratamento de erros

| Origem | Erro | HTTP | Exemplo |
|--------|------|------|---------|
| Service | `ValidationError` | 400 | `email inválido`, `senha deve ter no mínimo 6 caracteres` |
| Prisma `P2002` | `ConflictError` | 409 | `email já cadastrado` |
| Id inexistente | `NotFoundError` | 404 | `usuario não encontrado` |
| Id malformado | `ValidationError` | 400 | `id inválido` |

Mapeamento: `utils/responderErroDeDominio.js` nos controllers.

---

## 7. Seed vs API — usuário “completo”

| Aspecto | Seed | `POST /usuarios` |
|---------|------|------------------|
| Email + senha | Sim (arquivo demo) | Sim (JSON) |
| Hash bcrypt | Sim | Sim |
| Perfil fictício (`perfil`) | Só no arquivo demo, **não** no banco | Não existe no model ainda |
| Uso | Repor ambiente de teste | Simular cadastro real |

O model `Usuario` hoje é mínimo (email + senha). Campos como nome ou papel podem ser adicionados depois com nova migration.

---

## 8. Comandos

```bash
cd src/03_module/API
npm run db:migrate   # se ainda não aplicou migrations de usuarios
npm run db:seed      # 20 alunos + 8 usuários com hash
npm run dev
```

Testar perfil público do admin (id pode variar após seed; use Studio ou liste por lógica):

```bash
curl http://localhost:3001/usuarios/1
```

Verificar que **não** há `senha` nem `senhaHash` no JSON.

---

## 9. Arquivos envolvidos

| Arquivo | Função |
|---------|--------|
| `prisma/schema.prisma` | `model Usuario` |
| `prisma/seed-data/usuarios.demo.js` | Emails + senhas em texto (só lab) |
| `prisma/seed.js` | `seedUsuarios()` + hash |
| `utils/password.js` | `hashSenha` |
| `services/UsuarioService.js` | Validação, create, perfil público |
| `controllers/UsuarioController.js` | HTTP |
| `routes/usuarioRoutes.js` | Rotas |
| `errors/domainErrors.js` | Erros de domínio |

---

## 10. Segurança (lab)

- Senhas do seed são **públicas de propósito** para estudo — não commitar `.env` com segredos reais.
- Em produção: senhas fortes, variável de ambiente, rate limit no login (ainda não implementado).
- Login/JWT é passo futuro; o seed já deixa contas prontas para quando existir `POST /login`.
