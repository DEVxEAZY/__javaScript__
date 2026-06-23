# Fluxo visual HTML — padrões do repositório

> Dois modos coexistem neste repo: **mapa cenarizado SVG** (`00_fluxo_visual.html`) e **fluxo multi-coluna com revelação progressiva** (canônico: `postgres_fluxo.html`). Este documento é a **especificação de padrões**; o workflow do agente e snippets estão na skill — Cursor: [`.cursor/skills/fluxo-visual-html/`](../.cursor/skills/fluxo-visual-html/), estudo no repo: [`fluxo-visual-html/`](./fluxo-visual-html/).

---

## 1. Escolher o modo

| Modo | Quando usar | Exemplo no repo |
|------|-------------|-----------------|
| **Multi-coluna + passos** | Camadas paralelas (HTTP / app / dados), texto técnico por passo, rastro cumulativo | [`postgres_fluxo.html`](../src/02_module/auth/postgres_fluxo.html) |
| **Mapa SVG + partícula** | Um grafo fixo, vários caminhos por arestas, “o que foi pulado” no mapa | [`00_fluxo_visual.html`](./00_fluxo_visual.html) |
| **Mapa linear de nós** | Poucos nós em sequência, trace cards, sem colunas de código | [`00_mapa_auth.html`](../src/02_module/auth/00_mapa_auth.html) |

Para **auth** e fluxos tipo request/layer, prefira o padrão **multi-coluna** (`postgres_fluxo`). O mapa SVG continua válido para o ciclo de vida Express em `__ref__/`.

Regra de workspace ([`AGENTS.md`](../AGENTS.md)): passos concluídos permanecem visíveis após animar; o painel de rastro é **cumulativo** (não some).

---

## 2. Fluxo multi-coluna (canônico)

### 2.1 Ideia em uma frase

> *Várias colunas mostram o mesmo instante do fluxo; só os passos já vividos aparecem; o rastro abaixo guarda cada instante para sempre.*

### 2.2 Máquina de estados por linha (`.step`)

Cada célula de passo em cada coluna usa `data-i` (índice 0-based) e **uma** destas classes:

| Classe | Significado | Visual |
|--------|-------------|--------|
| `future` | Ainda não alcançado | `display: none` — não vazar conteúdo futuro |
| `current` | Passo ativo agora | Destaque (borda azul, fundo claro) |
| `done` | Já percorrido | Visível, check no número, fundo verde suave |

Não use só `opacity` ou `pending` para “esconder” passos futuros: o usuário veria todo o roteiro no primeiro clique.

CSS mínimo (espelha o canônico):

```css
.step.future { display: none; }
.step.current { opacity: 1; /* borda/fundo de destaque */ }
.step.done { opacity: 0.92; /* borda ok, ✓ no .num */ }
```

### 2.3 `setAllRowStates(currentIndex, allDone)` — contrato central

Atualiza **todas** as colunas de uma vez, com a mesma regra de índice:

```js
function setAllRowStates(currentIndex, allDone) {
  [colA, colB, colC].forEach(col => {
    col.querySelectorAll(".step").forEach(el => {
      el.classList.remove("pending", "current", "done", "future");
      const i = Number(el.dataset.i);
      if (i > currentIndex) el.classList.add("future");
      else if (allDone || i < currentIndex) el.classList.add("done");
      else el.classList.add("current");
    });
  });
}
```

- **`allDone === false`** (navegação manual / passo atual): índice `currentIndex` fica `current`; anteriores `done`; posteriores `future`.
- **`allDone === true`** (fim de animação ou `markAllDone`): todos até `currentIndex` ficam `done` (útil entre frames da reprodução automática).

**Anti-padrão:** loop `setRowState(i)` por linha que reaplica estado linha a linha e sobrescreve `future`/`done` de outras linhas. Uma função, três colunas, mesmo `currentIndex`.

### 2.4 Quando chamar `renderAllSteps` vs DOM incremental

| Momento | Ação |
|---------|------|
| **Reset / troca de cenário** | `renderIdleColumns(steps)` — placeholders, sem vazar passos do cenário anterior |
| **Primeiro “Próximo” ou início do play** | `renderAllSteps(steps)` — cria todos os `.step` no DOM (ainda em `future` após `setAllRowStates`) |
| **Cada passo (manual ou play)** | Só `setAllRowStates` + `applyStep` — **não** recriar o DOM inteiro |
| **Rastro** | `rebuildTraceThroughIndex(steps, index)` ou marcar `traceSteps[i].state = "done"` + `renderTrace()` no play |

Fluxo manual típico (`manualNext`):

1. Se `manualIndex < 0`: limpar log/rastro → `renderAllSteps` → `applyStep(0)`.
2. Senão: `applyStep(manualIndex + 1)` apenas.

### 2.5 Painel de rastro cumulativo

- Array `traceSteps` com entradas `{ http, express, sql, title, state, ts? }`.
- **`rebuildTraceThroughIndex(steps, index)`** — slice `0..index`, estados `done` / `current` coerentes com a coluna (boa para voltar com “Anterior”).
- No **play automático**: após cada pausa, marcar entrada `done` + timestamp + `setAllRowStates(i, true)` + `renderTrace()` para o rastro refletir o fechamento do passo.
- Cards: `.trace-card`, `.trace-card.current`, `.trace-card.done`; subcolunas `.trace-col` + `.trace-col-body.muted` para camadas vazias (`—`).
- Placeholder quando vazio: classe `.empty` no container + texto “Aguardando reprodução…”.

Opcional em outros HTML: `.trace-chain` com resumo “1. X → 2. Y” (`00_mapa_auth`, `supabase_arquitetura`).

### 2.6 Outros blocos de UI

- **Console:** play, anterior/próximo, reset, `<select>` de cenário, indicador `passo N / total`.
- **Colunas ativas:** `setCols("http"|"express"|"sql")` — borda da coluna relevante ao passo.
- **Log:** linhas append-only; classes `.ok` / `.err` quando fizer sentido.
- **Cenários:** objeto `SCENARIOS` + `getSteps()`; passos dinâmicos (ex. SQLi) em função separada.

### 2.7 Checklist CSS / DOM

- [ ] `.step.future { display: none; }`
- [ ] `.step` com `data-i` alinhado ao índice do array de cenário
- [ ] `.step.empty` ou texto muted para camada sem atividade (`isEmptyText`)
- [ ] `.col-idle` no reset (não deixar passos do cenário anterior)
- [ ] `.trace-panel` com label explícito sobre rastro **persistente**
- [ ] `.col.active` na coluna do `step.active`
- [ ] Controles desabilitados durante `playing`

### 2.8 Verificação manual (antes de dar por pronto)

1. Abrir o HTML no browser; **reset** — colunas em idle, rastro vazio.
2. **Um** clique em “Próximo” — só o passo 1 visível nas três colunas; passos 2+ ausentes (não só transparentes).
3. Avançar até o fim — todos os passos ficam `done`; rastro lista N cards legíveis.
4. **Reproduzir** — animação passo a passo; após concluir, rastro e colunas permanecem (não limpar ao terminar).
5. **Anterior** (se existir) — índice e rastro recuam sem duplicar cards.
6. Trocar cenário no `<select>` — sem texto do cenário anterior nas colunas.
7. Atalhos ←/→ (se houver) respeitam `playing === false`.

---

## 3. Mapa cenarizado SVG (`00_fluxo_visual.html`)

Método original deste arquivo: grafo estável, cenários como sequência de arestas, partícula em `<path>`, nós `skipped` com opacidade reduzida.

Ingredientes: nós, arestas, frames, partícula, cenários (`seq` + `skip`), painéis código + log.

Linguagem visual: cores por **kind** (`req`, `res`, `err`, `db`), opacidade baixa em repouso, Bezier nas arestas, tema claro.

Estrutura técnica resumida:

```
00_fluxo_visual.html
├─ NODES, EDGES, SCENARIOS
├─ render → drawNodes / drawEdges
└─ play() → travel(edge) com getPointAtLength
```

Cinco cenários Express (GET `/`, POST produtos, admin, static, erro) — ver seção 8 do histórico no próprio HTML.

**Não misturar** com o padrão multi-coluna: no SVG todos os nós existem no DOM; o “pulado” é opacidade, não `display: none` por passo indexado.

---

## 4. Relação com outros HTML em `auth/`

| Arquivo | Padrão | Nota |
|---------|--------|------|
| `postgres_fluxo.html` | Multi-coluna + `future`/`setAllRowStates` | **Referência canônica** para novos fluxos auth |
| `00_mapa_auth.html` | Nós lineares + trace push | Sem revelação por coluna; ok para visão geral |
| `supabase_arquitetura.html` | Layers + `flow-step` pending/current/done | Trace cumulativo; alinhar rastro ao refatorar |

Helmet/CSRF: só referência no módulo auth — implementação completa em `express/08_mongodb_session_seguranca/` (ver `AGENTS.md`).

---

## 5. Checklist rápido — novo fluxo HTML

- [ ] Modo escolhido (multi-coluna vs SVG vs mapa linear).
- [ ] Cenários com ≥2 histórias distintas quando possível.
- [ ] Revelação progressiva (`future`) ou skip explícito no mapa.
- [ ] Rastro cumulativo testado após play e após navegação manual.
- [ ] Reset limpa estado (`manualIndex`, `traceSteps`, idle columns).
- [ ] Link de volta para mapa/índice da aula (`← 00_mapa_auth.html` etc.).
- [ ] Skill consultada: [fluxo-visual-html](./fluxo-visual-html/SKILL.md) (ou `@fluxo-visual-html` no Cursor).

---

## 6. Referências

- Canônico multi-coluna: [`src/02_module/auth/postgres_fluxo.html`](../src/02_module/auth/postgres_fluxo.html)
- Mapa SVG Express: [`__ref__/00_fluxo_visual.html`](./00_fluxo_visual.html)
- Skill (estudo, no repo): [`__ref__/fluxo-visual-html/`](./fluxo-visual-html/) — [`SKILL.md`](./fluxo-visual-html/SKILL.md), [`reference.md`](./fluxo-visual-html/reference.md), [`README.md`](./fluxo-visual-html/README.md)
- Skill (Cursor, canônica): [`.cursor/skills/fluxo-visual-html/`](../.cursor/skills/fluxo-visual-html/) — invocar com `@fluxo-visual-html`
