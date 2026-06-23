> **Canônico para descoberta no Cursor:** [`.cursor/skills/fluxo-visual-html/SKILL.md`](../../.cursor/skills/fluxo-visual-html/SKILL.md) — invoque com `@fluxo-visual-html`.  
> **Esta cópia** em `__ref__/fluxo-visual-html/` é para estudo humano no repositório; mantenha as duas pastas alinhadas ao mudar o padrão.

# Fluxo visual HTML

Skill de workflow para criar ou corrigir páginas HTML interativas de fluxo (passo a passo, rastro cumulativo, revelação progressiva) neste repositório.

## Para humanos vs agente

| | Onde | Quando |
|---|------|--------|
| **Agente** | `.cursor/skills/fluxo-visual-html/` | Chat Cursor: `@fluxo-visual-html` |
| **Especificação de padrões** | [`__ref__/00_fluxo_visual.md`](../00_fluxo_visual.md) | Escolher modo (multi-coluna / SVG / linear), contrato `setAllRowStates`, checklist de verificação |
| **Esta pasta** | `__ref__/fluxo-visual-html/` | Ler no GitHub/IDE sem abrir `.cursor/`; mesmos checklists e links para `reference.md` |

O `00_fluxo_visual.md` **não** repete o workflow linha a linha — descreve o *método* reutilizável. Esta skill **complementa** com ordem de trabalho, anti-padrões e tabela de funções JS.

## Quando usar

- Criar ou estender `*_fluxo.html`, `*_arquitetura.html`, mapas em `auth/`, fluxos didáticos Express.
- Corrigir vazamento de passos futuros (tudo visível no primeiro clique).
- Alinhar rastro cumulativo ao padrão de `postgres_fluxo.html`.
- Portar `supabase_arquitetura.html` ou mapas lineares para multi-coluna com `future`/`done`.

Não use para duplicar servidor auth com Helmet/CSRF — ver `express/08_mongodb_session_seguranca/` e `AGENTS.md`.

## Workflow

1. Ler [`__ref__/00_fluxo_visual.md`](../00_fluxo_visual.md) e o exemplo canônico [`src/02_module/auth/postgres_fluxo.html`](../../src/02_module/auth/postgres_fluxo.html) (JS: `setAllRowStates`, `renderAllSteps`, `rebuildTraceThroughIndex`, `renderTrace`).
2. Confirmar o modo (multi-coluna vs SVG em [`__ref__/00_fluxo_visual.html`](../00_fluxo_visual.html) vs mapa linear — tabela na seção 1 do spec).
3. Implementar ou corrigir seguindo o contrato abaixo; snippets longos em [reference.md](./reference.md).
4. Rodar a [verificação manual](../00_fluxo_visual.md#28-verificação-manual-antes-de-dar-por-pronto) do `00_fluxo_visual.md`.

## Checklist antes de entregar

- [ ] Passos futuros com classe `future` (`display: none`), não só opacidade baixa em todos os passos visíveis.
- [ ] Primeiro “Próximo” mostra **apenas** o passo 1 (não vazar roteiro completo).
- [ ] `setAllRowStates(index, allDone)` em todas as colunas — sem loops que sobrescrevem estado linha a linha.
- [ ] `renderAllSteps` só no primeiro avanço ou no início do play; navegação usa `applyStep` + `setAllRowStates`.
- [ ] Painel de rastro cumulativo: cards permanecem após animar; `rebuildTraceThroughIndex` coerente com “Anterior”.
- [ ] `reset()` usa idle/placeholder e zera `traceSteps` / `manualIndex`.
- [ ] Troca de cenário não deixa texto do fluxo anterior.
- [ ] Comentários/docs não duplicam `src/02_module/auth/` inteiro — links cruzados.

## Contrato JS mínimo (multi-coluna)

| Função | Papel |
|--------|--------|
| `renderIdleColumns(steps)` | Estado inicial pós-reset |
| `renderAllSteps(steps)` | Monta `.step` com `data-i` em cada coluna |
| `setAllRowStates(i, allDone)` | `future` / `current` / `done` sincronizado |
| `applyStep(i, steps, opts)` | Estados + coluna ativa + rastro + log |
| `rebuildTraceThroughIndex(steps, i)` | Rastro 0..i para navegação manual |
| `renderTrace()` | DOM do painel cumulativo |
| `manualNext` / `manualPrev` | Controles; primeiro next chama `renderAllSteps` |
| `play()` | Loop async; ao fechar passo: `traceSteps[i].state = "done"`, `setAllRowStates(i, true)` |

Estados por linha: `i > currentIndex` → `future`; `allDone || i < currentIndex` → `done`; senão → `current`.

Detalhe conceitual e CSS: [`00_fluxo_visual.md` §2](../00_fluxo_visual.md#2-fluxo-multi-coluna-canônico).

## Anti-padrões

- Renderizar todos os passos visíveis e marcar pendentes só com `.pending` + opacidade.
- `setRowState` em loop sem `setAllRowStates` global.
- Limpar o rastro ao terminar `play()` sem pedido do usuário.
- Recriar `innerHTML` das colunas a cada passo (pisca e perde estado).
- Duplicar servidor auth com Helmet/CSRF — apontar para `express/08_mongodb_session_seguranca/`.

## Integração no repo

- **Auth:** seguir `postgres_fluxo.html`; mapas em `00_mapa_auth.html` / `supabase_arquitetura.html` podem usar trace `push` — ao refatorar, alinhar ao padrão `rebuildTraceThroughIndex` quando houver colunas de passo.
- **Express:** mapa SVG em `__ref__/00_fluxo_visual.html` para pipeline de middlewares; não forçar multi-coluna se o ensino for grafo.
- **AGENTS.md:** rastreabilidade persistente e labs `lab_*` com guia temático (ex. `DOTENV_MONGOOSE.md`) — HTML é visualização, código executável fica no lab.

## Recursos

- Snippets e estrutura HTML: [reference.md](./reference.md)
- Especificação de padrões: [00_fluxo_visual.md](../00_fluxo_visual.md)
- Índice desta pasta: [README.md](./README.md)
- Skill no Cursor (canônica): [`.cursor/skills/fluxo-visual-html/SKILL.md`](../../.cursor/skills/fluxo-visual-html/SKILL.md)

### Metadados Cursor (só na cópia em `.cursor/`)

```yaml
name: fluxo-visual-html
description: Builds interactive HTML flow visualizations with progressive reveal and cumulative trace.
disable-model-invocation: true
```

`disable-model-invocation: true` exige `@fluxo-visual-html` explícito — evita que o agente aplique a skill em toda edição de HTML.
