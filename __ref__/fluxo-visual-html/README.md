# fluxo-visual-html — cópia documentada no repo

> **Canônico para o Cursor** (descoberta da skill, `@fluxo-visual-html`): [`.cursor/skills/fluxo-visual-html/`](../../.cursor/skills/fluxo-visual-html/)  
> **Esta pasta** (`__ref__/fluxo-visual-html/`): documentação de estudo legível no Git + backup alinhado ao padrão do repo.

## Conteúdo

| Arquivo | Função |
|---------|--------|
| [SKILL.md](./SKILL.md) | Workflow do agente, checklist e contrato JS — versão expandida para leitura humana |
| [reference.md](./reference.md) | Snippets HTML/CSS/JS extraídos de `postgres_fluxo.html` |

## Como usar (você estudando)

1. Leia o **especificação de padrões** em [`../00_fluxo_visual.md`](../00_fluxo_visual.md) (modos SVG vs multi-coluna, máquina de estados, verificação manual).
2. Use esta pasta para o **passo a passo de implementação** e templates de código.
3. Abra o exemplo canônico no browser: [`src/02_module/auth/postgres_fluxo.html`](../../src/02_module/auth/postgres_fluxo.html).

## Como usar (agente no Cursor)

- Invoque `@fluxo-visual-html` no chat — o Cursor carrega `.cursor/skills/fluxo-visual-html/SKILL.md`.
- A skill aponta de volta para `00_fluxo_visual.md` e para esta pasta quando precisar de docs no repo.

## Manter sincronizado

Ao alterar padrões de fluxo visual (estados `future`/`done`, rastro cumulativo, funções em `postgres_fluxo.html`):

1. Atualize [`../00_fluxo_visual.md`](../00_fluxo_visual.md) se a **especificação** mudar.
2. Atualize **esta pasta** e [`.cursor/skills/fluxo-visual-html/`](../../.cursor/skills/fluxo-visual-html/) em conjunto (`SKILL.md` + `reference.md`).
3. Ajuste o HTML canônico (`postgres_fluxo.html`) antes de copiar snippets para `reference.md`.

Não é necessário symlink: duas cópias explícitas evitam depender de paths do Cursor no clone do repo.
