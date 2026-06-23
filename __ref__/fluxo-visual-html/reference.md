> **Canônico para o Cursor:** [`.cursor/skills/fluxo-visual-html/reference.md`](../../.cursor/skills/fluxo-visual-html/reference.md)  
> **Esta cópia:** `__ref__/fluxo-visual-html/reference.md` — mantenha sincronizada com a versão em `.cursor/skills/`.

# Referência — fluxo multi-coluna

Extraído de [`src/02_module/auth/postgres_fluxo.html`](../../src/02_module/auth/postgres_fluxo.html). Use quando implementar do zero ou portar `supabase_arquitetura.html` / novo `*_fluxo.html`.

Especificação narrativa (estados, verificação manual): [`../00_fluxo_visual.md`](../00_fluxo_visual.md).

## Estrutura HTML

```html
<div class="console"><!-- play, prev, next, reset, select cenário --></div>
<div class="cols">
  <div class="col http"><div class="head">…</div><div class="body" id="stepsHttp"></div></div>
  <div class="col express">…</div>
  <div class="col sql">…</div>
</div>
<div class="trace-panel">
  <div class="label">RASTRO CUMULATIVO — …</div>
  <div class="trace-timeline empty" id="traceTimeline">…</div>
</div>
<div class="log-panel" id="log"></div>
```

## CSS essencial

```css
.step.future { display: none; }
.step.current { opacity: 1; border-left-color: var(--req); background: #eff6ff; }
.step.done { opacity: 0.92; border-left-color: var(--ok); background: #f0fdf4; }
.step.done .num::after { content: "✓"; }
.col-idle { border: 1px dashed var(--border); /* reset */ }
.trace-card.current { border-color: var(--req); background: #eff6ff; }
.trace-card.done { border-left: 3px solid var(--ok); background: #f0fdf4; }
.trace-col-body.muted { color: var(--ink-3); font-style: italic; }
```

## `makeStepEl` + `renderAllSteps`

```js
function makeStepEl(num, text, empty) {
  const el = document.createElement("div");
  el.className = "step pending" + (empty ? " empty" : "");
  el.dataset.i = String(num - 1);
  const numEl = document.createElement("span");
  numEl.className = "num";
  numEl.textContent = String(num);
  el.appendChild(numEl);
  el.appendChild(document.createTextNode(empty ? "(sem atividade…)" : text));
  return el;
}

function renderAllSteps(steps) {
  stepsHttp.innerHTML = "";
  stepsExpress.innerHTML = "";
  stepsSql.innerHTML = "";
  steps.forEach((s, i) => {
    const n = i + 1;
    stepsHttp.appendChild(makeStepEl(n, s.http, isEmptyText(s.http)));
    stepsExpress.appendChild(makeStepEl(n, s.express, isEmptyText(s.express)));
    stepsSql.appendChild(makeStepEl(n, s.sql, isEmptyText(s.sql)));
  });
}
```

## `setAllRowStates` (canônico)

```js
function setAllRowStates(currentIndex, allDone) {
  [stepsHttp, stepsExpress, stepsSql].forEach(col => {
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

## Rastro

```js
function stepToTraceEntry(stepData, state) {
  return {
    http: stepData.http || "",
    express: stepData.express || "",
    sql: stepData.sql || "",
    title: stepData.title || stepData.log || "passo",
    ts: state === "done" ? new Date().toLocaleTimeString("pt-BR", { hour12: false }) : undefined,
    state,
  };
}

function rebuildTraceThroughIndex(steps, index) {
  traceSteps = steps.slice(0, index + 1).map((s, i) =>
    stepToTraceEntry(s, i < index ? "done" : "current")
  );
  renderTrace();
}
```

## `applyStep` + play

```js
function applyStep(index, steps, options) {
  const i = Math.max(0, Math.min(index, steps.length - 1));
  manualIndex = i;
  const s = steps[i];
  setAllRowStates(i, false);
  setCols(s.active);
  rebuildTraceThroughIndex(steps, i);
  if (options?.logLine) log("— Passo " + (i + 1) + ": " + s.log, s.cls || "");
  updateControls(steps);
}

async function play() {
  playing = true;
  traceSteps = [];
  renderTrace();
  renderAllSteps(steps);
  manualIndex = -1;
  for (let i = 0; i < steps.length; i++) {
    applyStep(i, steps, { logLine: true });
    await sleep(900);
    traceSteps[i].state = "done";
    traceSteps[i].ts = new Date().toLocaleTimeString("pt-BR", { hour12: false });
    setAllRowStates(i, true);
    renderTrace();
  }
  manualIndex = steps.length - 1;
  markAllDone(steps.length);
  playing = false;
}
```

## Formato de um passo de cenário

```js
{
  active: "http",           // coluna destacada: http | express | sql
  title: "Cliente envia…",
  http: "POST /login…",
  express: "authController…",
  sql: "(nenhuma query…)",
  log: "POST /login",
  cls: "ok"                 // opcional no log
}
```

## Mapa SVG (outro modo)

Ver [`__ref__/00_fluxo_visual.html`](../00_fluxo_visual.html): `NODES`, `EDGES`, `SCENARIOS[id].seq`, `travel(edgeKey)` com `getPointAtLength`. Não aplicar `future` por índice — usar `skip` nos nós do mapa.
