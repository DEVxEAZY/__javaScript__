# Guia de estilo Airbnb — o que é, por que o curso usa e como ler as regras

Documento **dedicado** ao padrão escolhido no `eslint --init` da aula. Para instalar ESLint, extensão e auto-fix, use [`ESLINT.md`](ESLINT.md). Para o config deste lab, veja [`eslint.config.mjs`](eslint.config.mjs).

**Camada anterior:** [`../editorconfig/EDITORCONFIG.md`](../editorconfig/EDITORCONFIG.md) — EditorConfig cuida de indent/LF/encoding; Airbnb/ESLint cuidam das **regras de JavaScript**. Os dois se complementam.

---

## Índice

1. [“Airbnb” em três camadas](#1-airbnb-em-três-camadas)
2. [Por que é tão usado](#2-por-que-é-tão-usado)
3. [Filosofia do guia (em português claro)](#3-filosofia-do-guia-em-português-claro)
4. [`airbnb-base` vs `airbnb` completo](#4-airbnb-base-vs-airbnb-completo)
5. [Como o pacote npm se conecta ao ESLint](#5-como-o-pacote-npm-se-conecta-ao-eslint)
6. [Mapa das famílias de regras](#6-mapa-das-famílias-de-regras)
7. [Exemplos que você já viu no `app.js`](#7-exemplos-que-você-já-viu-no-appjs)
8. [O que costumamos desligar neste curso](#8-o-que-costumamos-desligar-neste-curso)
9. [Quando *não* seguir cegamente](#9-quando-não-seguir-cegamente)
10. [Outros guias populares (visão rápida)](#10-outros-guias-populares-visão-rápida)
11. [Referências oficiais](#11-referências-oficiais)

---

## 1. “Airbnb” em três camadas

| Camada | O que é | Onde vive |
|--------|---------|-----------|
| **Guia de estilo (texto)** | Documento humano: “prefira `const`, evite `var`, use aspas simples…” | Repositório [airbnb/javascript](https://github.com/airbnb/javascript) |
| **Config ESLint (`eslint-config-airbnb-base`)** | Mesmas ideias **traduzidas em regras** que a ferramenta consegue checar | Pacote npm instalado no projeto |
| **Seu projeto** | Guia + exceções que o time/curso combina (`rules: { ... }`) | `eslint.config.mjs` desta pasta |

Na fala da aula, “Bimby” / “Bimbi” é transcrição de **Airbnb** — o pacote correto é `eslint-config-airbnb-base`.

O ESLint **não inventa** o estilo Airbnb: ele **aplica** centenas de regras que o mantenedor do pacote alinhou ao guia escrito.

---

## 2. Por que é tão usado

- **Opinativo e completo** — em vez de 5 regras soltas, você herda um pacote coerente (espaçamento, imports, variáveis, comparações, etc.).
- **Reconhecível no mercado** — muitos projetos open source e vagas citam “seguimos Airbnb” ou algo derivado.
- **Integração madura** — anos de uso com `eslint-plugin-import`, regras de `eslint` core e plugins da comunidade.
- **Bom para aprender** — força hábitos que evitam bugs comuns (`===` em vez de `==`, variável não usada, etc.).

Não significa que seja o **único** guia “certo”. Significa que é um **contrato pronto** para o time não discutir vírgula em cada PR.

---

## 3. Filosofia do guia (em português claro)

O guia escrito da Airbnb resume uma postura de engenharia JavaScript (resumo didático, não tradução oficial):

1. **Legibilidade acima de “esperteza”** — código lido por humanos; padrão previsível entre arquivos.
2. **Imutabilidade onde faz sentido** — `const` por padrão; `let` quando precisa reatribuir; `var` praticamente fora do jogo.
3. **Comparações e tipos explícitos** — `===` / `!==`; cuidado com coerção implícita.
4. **Módulos modernos** — `import` / `export` organizados; o plugin `import` cobre ordem e caminhos.
5. **Funções e objetos consistentes** — estilo de arrow function, shorthand de propriedades, trailing comma em multilinha (facilita diff no Git).
6. **Qualidade além da formatação** — regras que pegam código morto, padrões propensos a erro, não só “bonito”.

Airbnb é **mais rígido** que “só o recommended do ESLint”. Por isso o editor “grita” mais no começo — e por isso o **auto-fix** e entender a regra valem a pena.

---

## 4. `airbnb-base` vs `airbnb` completo

| Pacote | Para quê | React? |
|--------|----------|--------|
| **`eslint-config-airbnb-base`** | JavaScript em Node, scripts, API sem JSX | Não |
| **`eslint-config-airbnb`** | Estende o base + regras **React** / JSX | Sim |

Nesta disciplina (API, Node, módulos ES) o init escolhe **`airbnb-base`**. Se no futuro você tiver front React no mesmo repo, aí entra o pacote completo ou um config separado por pasta (`files` no flat config).

---

## 5. Como o pacote npm se conecta ao ESLint

Fluxo mental:

```text
airbnb/javascript (README)  →  decisões humanas
        ↓
eslint-config-airbnb-base   →  objeto de regras + plugins
        ↓
eslint.config.mjs           →  extends + suas exceções (rules)
        ↓
eslint (CLI / extensão)     →  avisos no editor e no npm run lint
```

Neste lab usamos **ESLint 9** (flat config). O pacote Airbnb ainda é distribuído no formato antigo; por isso [`eslint.config.mjs`](eslint.config.mjs) usa `FlatCompat` de `@eslint/eslintrc` para fazer o equivalente a:

```js
// formato legado — só referência
extends: ['airbnb-base']
```

Suas customizações vêm **depois** do extends, no mesmo espírito da documentação do ESLint: o que você define em `rules` **sobrescreve** o pacote.

---

## 6. Mapa das famílias de regras

Não precisa decorar centenas de nomes. Pense em **famílias**:

| Família | Exemplos de regras | Intenção |
|---------|-------------------|----------|
| **Estilo / formatação** | `semi`, `quotes`, `indent`, `no-multiple-empty-lines` | Um arquivo “parece” o outro |
| **Variáveis** | `no-unused-vars`, `no-var`, `prefer-const` | Menos lixo e menos escopo vazando |
| **Comparação / lógica** | `eqeqeq`, `no-nested-ternary` (às vezes) | Menos bug silencioso |
| **Funções** | `arrow-body-style`, `prefer-arrow-callback` | Estilo funcional consistente |
| **Classes** | `class-methods-use-this` | Método de classe deveria usar `this` |
| **Imports** | `import/no-unresolved`, `import/order` | Módulos válidos e ordenados |
| **Boas práticas** | `no-console`, `no-debugger` | Código de produção vs debug |
| **Possíveis erros** | `no-undef`, `no-unreachable` | Coisas que quebrariam em runtime |

O pacote `airbnb-base` também puxa **`eslint-plugin-import`**, que não vem só no core do ESLint — por isso o `npm install` da aula lista esse plugin.

---

## 7. Exemplos que você já viu no `app.js`

Arquivo: [`app.js`](app.js)

| Trecho / sintoma | Regra (nome) | O que o Airbnb defende |
|------------------|--------------|-------------------------|
| Aspas duplas em string | `quotes` | Aspas **simples** em JS, exceto quando escapar fica pior |
| Falta `;` no fim da linha | `semi` | Ponto e vírgula no fim de statement (estilo Airbnb) |
| Linhas em branco no topo/fim | `no-multiple-empty-lines` | Arquivo sem “buracos” desnecessários |
| `const teste = 22` e nunca usa | `no-unused-vars` | Não deixar variável morta (confunde quem lê) |
| `console.log(...)` | `no-console` | Em produção, log deveria ser logger estruturado |

Rode no terminal para ver a regra exata na sua versão:

```bash
npm run lint
```

Passe o mouse no sublinhado do editor — a extensão ESLint mostra o **rule id** (ex.: `quotes`, `no-console`).

---

## 8. O que costumamos desligar neste curso

Algumas regras são ótimas em produção, mas **atrapalham** material didático. Por isso [`eslint.config.mjs`](eslint.config.mjs) já traz:

```js
rules: {
  "no-console": "off",
}
```

| Regra | Por que desligamos no curso | Em projeto real |
|-------|----------------------------|-----------------|
| `no-console` | Aulas usam `console.log` para mostrar saída | Manter `error` ou usar logger |
| `class-methods-use-this` (futuro) | Exemplos de classe nem sempre precisam de `this` | Avaliar caso a caso |

Formas de ajustar (já visto na [`ESLINT.md`](ESLINT.md)):

- **Projeto inteiro:** `"nome-da-regra": "off"` em `rules`
- **Uma linha:** `// eslint-disable-next-line nome-da-regra`
- **Arquivo inteiro (raro):** comentário `eslint-disable` no topo

Desligar sem entender a regra é possível, mas perde o benefício pedagógico.

---

## 9. Quando *não* seguir cegamente

Situações comuns em que times **mantêm** Airbnb mas **negociam** exceções:

- **Código legado** — ligar tudo de uma vez gera mil erros; migração por pasta ou `warn` primeiro.
- **Gerador de código** — pastas `dist/` ficam em `ignores`.
- **Script de uma linha** — regra que não vale o custo.
- **Conflito com Prettier** — em projetos maduros, Prettier formata e ESLint cuida de qualidade; regras de estilo duplicadas são desligadas de propósito (ainda não é o foco desta aula).

O guia Airbnb é um **ponto de partida**, não uma lei física. O que importa é: **o repositório documenta o desvio** (`eslint.config` + comentário no PR), não “cada um formata do seu jeito”.

---

## 10. Outros guias populares (visão rápida)

| Guia | Tom | Quando ouvir falar |
|------|-----|-------------------|
| **Standard** | “Zero config”, sem ponto e vírgula | Projetos que querem mínimo de discussão |
| **Google** | Muito usado em ecossistema Google / TS | Empresas que padronizam no guia Google |
| **Prettier** | Só formatação (não é substituto total do ESLint) | Quase todo projeto médio/grande |
| **@eslint/js recommended** | Menos opinativo que Airbnb | Projetos que preferem poucas regras |

O curso ficou no **Airbnb base** para alinhar com a aula em vídeo e com o que muita gente encontra no primeiro emprego Node/React.

---

## 11. Referências oficiais

- Guia escrito (JavaScript): [github.com/airbnb/javascript](https://github.com/airbnb/javascript)
- Pacote ESLint base: [eslint-config-airbnb-base no npm](https://www.npmjs.com/package/eslint-config-airbnb-base)
- ESLint — shareable configs: [eslint.org — Shareable Configs](https://eslint.org/docs/latest/extend/shareable-configs)
- Lab deste módulo: [`ESLINT.md`](ESLINT.md) · [`eslint.config.mjs`](eslint.config.mjs)

---

### Exercício rápido (5 min)

1. Em `app.js`, troque aspas simples por duplas em uma string e salve — observe `quotes` e o auto-fix.
2. Crie uma variável `const x = 1` sem usar — localize `no-unused-vars`.
3. Abra o README do [airbnb/javascript](https://github.com/airbnb/javascript) na seção **Rules** e ache a regra equivalente a `semi` ou `quotes`.
4. No `eslint.config.mjs`, ligue `"no-console": "error"`, rode `npm run lint` em `app.js`, depois volte para `"off"`.

Isso fixa a ideia: **Airbnb = convenção escrita + regras automáticas**, e o seu projeto só precisa documentar as exceções.
