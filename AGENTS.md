## Learned User Preferences

- Ao enriquecer comentários ou explicações em materiais dentro de `src/02_module/express/`, acrescentar só o que não for redundante com o restante de `src/02_module/`.
- Em perguntas de «varredura» ou «o que falta?» sobre uma pasta de aula Express, responder com vista checklist (peças técnicas, lacunas opcionais, coerência com o roteiro da aula).
- Ao explicar código assíncrono (promessas, `async`/`await`, `.then`), manter recomendações coerentes ao longo da conversa e indicar quando cada estilo faz sentido, evitando instruções contraditórias sobre «uma única forma certa» quando ambas são válidas.
- No módulo `src/02_module/auth/`, Helmet e CSRF ficam só como referência + checklist para `express/08_mongodb_session_seguranca/` — não duplicar implementação num novo servidor.
- Visualizações HTML de fluxo (auth, express) devem manter rastreabilidade persistente: passos concluídos permanecem visíveis e legíveis após a animação, com histórico cumulativo.
- Módulos de estudo em `src/02_module/` devem combinar documentação com lab `lab_*` contendo `.js` comentado e robusto como referência executável (ex.: `auth/lab_auth_referencia/`, `mongoDB/lab_dotenv_mongoose/`).
- Em labs, preferir `AULA.md` detalhado no próprio laboratório que documente o código e preencha lacunas conceituais, com links cruzados em vez de repetir outras pastas.

## Learned Workspace Facts

- As aulas Express deste repo estão em `src/02_module/express/`, em subpastas numeradas por tema (ex.: `03_router_e_controllers`, `06_webpack`, `07_middlewares`).
- Existem outras zonas de estudo na raíz do repo, além de `src/`: `__console__/`, `___projects___/` (mini-projetos) e materiais sob `__ref__/`.
- O módulo de autenticação e segurança web está em `src/02_module/auth/` (markdown, HTML interativo, `__test__/` e lab `lab_auth_referencia/`).
- O módulo MongoDB está em `src/02_module/mongoDB/` (guias numerados `01_`–`03_` e lab `lab_dotenv_mongoose/`).
- Em `auth/`, Postgres e Supabase são explicados via HTML interativo sem exigir banco local; código executável fica no lab de referência.
