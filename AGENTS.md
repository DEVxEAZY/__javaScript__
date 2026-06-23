## Learned User Preferences

- Ao enriquecer comentários ou explicações em materiais dentro de `src/02_module/express/`, acrescentar só o que não for redundante com o restante de `src/02_module/`.
- Em perguntas de «varredura» ou «o que falta?» sobre uma pasta de aula Express, responder com vista checklist (peças técnicas, lacunas opcionais, coerência com o roteiro da aula).
- Ao explicar código assíncrono (promessas, `async`/`await`, `.then`), manter recomendações coerentes ao longo da conversa e indicar quando cada estilo faz sentido, evitando instruções contraditórias sobre «uma única forma certa» quando ambas são válidas.
- No módulo `src/02_module/auth/`, Helmet e CSRF ficam só como referência + checklist para `express/08_mongodb_session_seguranca/` — não duplicar implementação num novo servidor.
- Visualizações HTML de fluxo (auth, express) seguem `__ref__/00_fluxo_visual.md` e skill `fluxo-visual-html`: revelação progressiva passo a passo (`.future`/`.current`/`.done`), rastro cumulativo detalhado por camada (não resumo abreviado), reset voltando ao estado idle; passos concluídos permanecem legíveis após a animação.
- Em labs e código de referência executável (`lab_*`), comentários pt-BR devem enfatizar o por quê (segurança, ordem de middlewares), no tom de `express/08`.
- Módulos de estudo em `src/02_module/` devem combinar documentação com lab `lab_*` contendo `.js` comentado e robusto como referência executável (ex.: `auth/lab_auth_referencia/`, `mongoDB/lab_dotenv_mongoose/`).
- Em labs, preferir guia temático no próprio laboratório (ex.: `ESLINT.md`, `DOTENV_MONGOOSE.md`, `LAB_AUTH_REFERENCIA.md`) que documente o código e preencha lacunas conceituais, com links cruzados em vez de repetir outras pastas.
- Em fluxos git automatizados (ex. comando `/git-update`), fazer add → commit → push na branch atual (`git push` ou `git push -u origin HEAD`); não assumir `main` nem branch fixa.
- Ao explicar o lab `src/03_module/API/`, traçar o fluxo da requisição quando fizer sentido: prefixo em `app.use` → rota no router → controller (HTTP) → service (regra + Prisma), não parar só em rotas ou só no controller.
- No lab `src/03_module/API/`, validação de payload e regras de negócio ficam no **service** (helpers no topo do arquivo, ex. `validarPayload`, `parseId`); controller só orquestra HTTP — padrão de `AlunoService`, `UsuarioService` e `HobbyService`.

## Learned Workspace Facts

- As aulas Express deste repo estão em `src/02_module/express/`, em subpastas numeradas por tema (ex.: `03_router_e_controllers`, `06_webpack`, `07_middlewares`).
- Existem outras zonas de estudo na raíz do repo, além de `src/`: `__console__/`, `___projects___/` (mini-projetos) e materiais sob `__ref__/` (fluxos HTML: spec em `__ref__/00_fluxo_visual.md`, skill documentada em `__ref__/fluxo-visual-html/`; Cursor usa `.cursor/skills/fluxo-visual-html/`).
- O módulo de autenticação e segurança web está em `src/02_module/auth/` (guias `01_`–`09_`, HTML interativo, `__test__/` e lab `lab_auth_referencia/`).
- A aula `express/07_middlewares/` inclui complemento SQLite: `server_sqlite.js` e `middleware_sqlite_fluxo.html`.
- A aula `express/03_router_e_controllers/` inclui `rotas_fluxo.html` (básico → padrões elite: Router, controllers, `router.param`, `router.route`, `mergeParams`).
- O módulo MongoDB está em `src/02_module/mongoDB/` (guias numerados `01_`–`03_` e lab `lab_dotenv_mongoose/`).
- Em `auth/`, Postgres e Supabase são explicados via HTML interativo sem exigir banco local; código executável fica no lab de referência.
- O módulo `src/03_module/` começa por qualidade de código: `editorconfig/EDITORCONFIG.md`, pasta `eslint/` com `ESLINT.md`, `eslint.config.mjs` (flat config + Airbnb via `FlatCompat`), lab `app.js` e `.vscode` para auto-fix.
- Lab `src/03_module/API/` — API REST Express em ESM; camadas routes → controller fino (HTTP) → service (validação + regras + Prisma) → `database/app.db` (SQLite); montar recurso só com `app.use('/recurso', router)` e paths relativos no router; erros de domínio em `errors/domainErrors.js`, mapeamento HTTP em `utils/responderErroDeDominio.js`; recursos `usuarios` e `alunos`; seed `npm run db:seed` (`prisma/seed.js`, `prisma/seed-data/`); guias “do átomo” por recurso em `docs/`; **Prisma 7** + `better-sqlite3`; visão geral em `API_REST.MD`.
- Com Prisma no lab API, pasta `models/` (padrão Sequelize) fica obsoleta — modelos em `prisma/schema.prisma`, acesso via services; não recriar `models/`.
