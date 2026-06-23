# ESLint — por que usar, instalar e integrar ao editor

Material alinhado à transcrição da aula (início do projeto, `eslint --init`, guia **Airbnb**, extensão no VS Code/Cursor e correção automática ao salvar). Este laboratório já traz a configuração pronta para você **comparar** com o que o assistente interativo gera na sua máquina.

**Pasta:** `src/03_module/eslint/`  
**Pré-requisito:** Node.js 18+ instalado.

**Aula anterior (obrigatória na trilha):** [`../editorconfig/EDITORCONFIG.md`](../editorconfig/EDITORCONFIG.md) — `.editorconfig` na raiz da seção (indent 2, `LF`) para Windows e Linux iguais **antes** do ESLint.

**Leitura complementar (padrão Airbnb):** [`GUIA_AIRBNB.md`](GUIA_AIRBNB.md) — o que é o guia, filosofia, `airbnb-base` vs React, famílias de regras e o que o curso costuma desligar.

---

## Índice

1. [Por que passar por esse processo?](#1-por-que-passar-por-esse-processo)
2. [O que é o ESLint (em uma frase)](#2-o-que-é-o-eslint-em-uma-frase)
3. [Terminal na pasta certa (Windows e atalhos)](#3-terminal-na-pasta-certa-windows-e-atalhos)
4. [Iniciar o projeto (`npm init`)](#4-iniciar-o-projeto-npm-init)
5. [Assistente `npx eslint --init`](#5-assistente-npx-eslint---init)
6. [O que o assistente instala](#6-o-que-o-assistente-instala)
7. [Arquivo de configuração: legado vs flat config](#7-arquivo-de-configuração-legado-vs-flat-config)
8. [Este repositório: `eslint.config.mjs`](#8-este-repositório-eslintconfigmjs)
9. [Extensão ESLint no editor](#9-extensão-eslint-no-editor)
10. [Auto-correção ao salvar](#10-auto-correção-ao-salvar)
11. [Testar com `app.js`](#11-testar-com-appjs)
12. [Conflito: ESLint “do pai” na árvore de pastas](#12-conflito-eslint-do-pai-na-árvore-de-pastas)
13. [Desligar regras: arquivo vs comentário na linha](#13-desligar-regras-arquivo-vs-comentário-na-linha)
14. [Rodar pelo terminal](#14-rodar-pelo-terminal)
15. [Opcional: cores nos parênteses](#15-opcional-cores-nos-parênteses)
16. [Checklist da aula](#16-checklist-da-aula)
17. [Próximos passos no curso](#17-próximos-passos-no-curso)

---

## 1. Por que passar por esse processo?

Em equipes (e em projetos seus de médio prazo), o código deixa de ser “só o que roda” e passa a ser **código que outra pessoa lê amanhã**. Sem acordo de estilo, cada arquivo fica com:

- aspas simples num lugar e duplas noutro;
- `;` às vezes sim, às vezes não;
- imports espalhados, variáveis criadas e nunca usadas;
- `console.log` esquecido em produção.

**Lint** = análise estática: o programa **não executa** seu código; ele **lê** o texto e aponta padrões suspeitos ou fora do combinado.

| Sem ESLint | Com ESLint + guia (ex.: Airbnb) |
|------------|----------------------------------|
| Estilo depende da memória de cada um | Regras explícitas no repositório |
| Code review vira discussão de vírgula | Review foca em lógica e arquitetura |
| Bugs bobos (`variável não usada`) passam | Muitos sinais aparecem **antes** do commit |
| Onboarding lento (“como vocês formatam?”) | Novo dev segue o mesmo `eslint.config` |

O processo da aula (init → guia popular → extensão → auto-fix) existe para você **internalizar o fluxo** que depois repete em API, front e monorepos — não só “ter um arquivo mágico”.

---

## 2. O que é o ESLint (em uma frase)

Ferramenta **plugável** que aplica **regras** sobre JavaScript (e, com plugins, TypeScript, React, etc.). Cada regra pode ser:

- **off** — ignorada;
- **warn** — aviso (amarelo no editor);
- **error** — erro (vermelho; pode falhar CI).

Um **guia de estilo compartilhado** (shareable config), como `eslint-config-airbnb-base`, é um pacote npm com dezenas de regras já ligadas — você estende e só **sobrescreve** o que não combina com o curso.

Documentação oficial: [https://eslint.org/docs/latest/](https://eslint.org/docs/latest/)

---

## 3. Terminal na pasta certa (Windows e atalhos)

Na aula: abrir o terminal **já dentro** da pasta do projeto.

| Ambiente | Atalho usual | Observação |
|----------|--------------|------------|
| VS Code / Cursor | `` Ctrl+` `` ou **Terminal → Novo terminal** | Abre na pasta do workspace |
| Explorer (Windows) | Shift + botão direito → “Abrir no Terminal” | Depende da versão do Windows |
| Atalho da aula (Mac) | Ctrl+Shift+C em alguns setups | No Windows pode ser outro — use o menu se não funcionar |

Confirme com `cd` / `pwd` que você está em `src/03_module/eslint` antes de `npm init` ou `npm install`.

---

## 4. Iniciar o projeto (`npm init`)

Se a pasta ainda só existia vazia:

```bash
npm init -y
```

O `-y` aceita os padrões e gera `package.json` (nome, versão, `scripts`, etc.). É o mesmo “RG do projeto” visto em `src/02_module/node/02_node_pack_manager/`.

Neste laboratório o `package.json` **já está** na pasta; na sua máquina você pode recriá-lo com o comando acima e depois instalar as dependências da [seção 14](#14-rodar-pelo-terminal).

---

## 5. Assistente `npx eslint --init`

Comando da aula (ESLint 9+):

```bash
npx eslint --init
```

Ele **não linta** o projeto na hora — só faz perguntas e gera/atualiza config + dependências.

Respostas equivalentes à transcrição:

| Pergunta (resumo) | Escolha da aula | Por quê |
|-------------------|-----------------|---------|
| O que você quer que o ESLint faça? | Checar sintaxe **e** problemas **e** impor estilo | Máximo feedback desde o dia 1 |
| Linguagem | **JavaScript** (não TypeScript ainda) | Escopo da disciplina |
| Módulos | **ES modules** (`import` / `export`) | Mesmo padrão que a API do curso |
| Framework | **None** (sem React/Vue) | API HTTP simples primeiro |
| Ambiente | **Node** (não “browser” puro) | `console`, `process`, arquivos |
| Estilo base | **Guia popular → Airbnb** | Muito usado no mercado; estilo opinativo e consistente |
| Formato do config | Hoje: **`eslint.config.js`** (flat config) | Padrão desde ESLint 9; a aula em vídeo pode mostrar `.eslintrc.*` legado |

> **Airbnb na fala da aula:** o áudio às vezes soa como “Bimby”; o pacote correto é **Airbnb** (`eslint-config-airbnb-base`). Explicação dedicada: [`GUIA_AIRBNB.md`](GUIA_AIRBNB.md).

---

## 6. O que o assistente instala

Typical `devDependencies` (nomes podem variar um pouco conforme versão):

| Pacote | Papel |
|--------|--------|
| `eslint` | CLI + motor de regras |
| `eslint-config-airbnb-base` | Conjunto de regras Airbnb para JS “puro” |
| `eslint-plugin-import` | Regras de `import`/`export` (peer do Airbnb) |
| `@eslint/js` | Configs recomendadas oficiais (em setups novos) |
| `@eslint/eslintrc` | Ponte quando o guia ainda está no formato antigo |

Tudo isso vai para **`devDependencies`**: só desenvolvimento — não vai para o servidor em produção como “dependência da API”.

---

## 7. Arquivo de configuração: legado vs flat config

**Formato antigo (vídeo / cursos antigos):** `.eslintrc.js`, `.eslintrc.json` ou até `.eslintrc` na raiz.

```js
// Exemplo legado — NÃO é o arquivo deste lab; só referência visual da aula em vídeo
module.exports = {
  extends: ["airbnb-base"],
  rules: {
    "no-console": "off",
  },
};
```

**Formato atual (ESLint 9+):** `eslint.config.js` ou `eslint.config.mjs` exportando um **array** de objetos de configuração ([migration guide](https://eslint.org/docs/latest/use/configure/migration-guide)).

O guia Airbnb ainda é empacotado no formato legado; por isso usamos `FlatCompat` para `extends("airbnb-base")` dentro do flat config — ver arquivo deste lab.

---

## 8. Este repositório: `eslint.config.mjs`

Arquivo: [`eslint.config.mjs`](eslint.config.mjs)

- Estende **airbnb-base** via `FlatCompat`.
- `sourceType: "module"` — alinhado a `import`/`export`.
- `"no-console": "off"` — como na aula, para poder usar `console.log` nos exercícios.
- Regra `class-methods-use-this` comentada para quando trabalharem com classes.

Para reproduzir o init na sua máquina e comparar: rode `npx eslint --init` numa cópia da pasta ou diff o arquivo gerado com o nosso.

---

## 9. Extensão ESLint no editor

1. Abra **Extensions** / Extensões.
2. Procure **ESLint** (publicador: Microsoft / `dbaeumer.vscode-eslint`).
3. Instale e recarregue a janela se pedir.

Este lab inclui [`.vscode/extensions.json`](.vscode/extensions.json) para o editor sugerir a extensão ao abrir a pasta.

Validação de linguagem (equivalente à aula):

```json
"eslint.validate": ["javascript"]
```

---

## 10. Auto-correção ao salvar

A aula usa `eslint.autoFixOnSave` — nas versões atuais do VS Code/Cursor o equivalente recomendado está em [`.vscode/settings.json`](.vscode/settings.json):

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": "explicit"
}
```

Com isso, ao **salvar** `app.js`, o ESLint pode:

- remover linhas em branco extras;
- inserir `;` onde o guia exige;
- não apagar `console.log` aqui porque desligamos `no-console` no config.

Se nada acontecer: salve o arquivo, confira se a extensão está ativa e **reabra** a janela do editor (a aula também sugere fechar/abrir quando as regras não aparecem).

---

## 11. Testar com `app.js`

Arquivo: [`app.js`](app.js)

1. Abra `app.js` — devem aparecer sublinhados (ex.: `teste` não usado, linhas vazias, `semi`).
2. Salve com auto-fix — formatação melhora.
3. Use `teste` em algum lugar ou remova a variável — o aviso de “não usado” some.

Exemplo de uso da variável:

```js
console.log(teste);
```

---

## 12. Conflito: ESLint “do pai” na árvore de pastas

Sintoma da aula: regras **não** batem com o que você configurou no projeto filho; erros estranhos ou regras “antigas”.

**Causa:** o ESLint sobe diretórios procurando config. Um `.eslintrc` / `eslint.config` em pasta **ancestral** (ex.: raiz do curso no disco) pode “vencer” ou misturar comportamento.

**O que fazer:**

1. Mostrar arquivos ocultos no explorador.
2. Procurar `.eslintrc`, `.eslintrc.js`, `eslint.config.js` **fora** da pasta do exercício.
3. Remover ou renomear o config conflitante **só** se for lixo de teste — nunca apague config de outro projeto sem saber.
4. Reabrir o editor na pasta `eslint/` deste lab.

---

## 13. Desligar regras: arquivo vs comentário na linha

### No config (permanente no projeto)

Regra com hífen no nome precisa de aspas no JSON/JS:

```js
rules: {
  "no-console": "off",
}
```

### Comentário na linha (exceção pontual)

```js
// eslint-disable-next-line no-console
console.log("só nesta linha");
```

```js
/* eslint-disable no-console */
console.log("bloco");
/* eslint-enable no-console */
```

A aula desaconselha desligar regra “no escuro”: leia **por que** o Airbnb ligou aquilo antes de silenciar.

---

## 14. Rodar pelo terminal

Na pasta `src/03_module/eslint`:

```bash
npm install
npm run lint
npm run lint:fix
```

O arquivo [`.npmrc`](.npmrc) com `legacy-peer-deps=true` evita erro de **peer dependency**: o pacote `eslint-config-airbnb-base` ainda declara suporte oficial ao ESLint 7/8, enquanto usamos ESLint 9 com `FlatCompat`. É esperado até o guia Airbnb publicar flat config nativo.

Instalação manual equivalente ao `--init` (versões podem subir; use o que o init sugerir):

```bash
npm install -D eslint eslint-config-airbnb-base eslint-plugin-import @eslint/eslintrc @eslint/js
```

---

## 15. Opcional: cores nos parênteses

Na aula: extensão tipo **Bracket Pair Colorizer**. Hoje o VS Code/Cursor já traz **Bracket Pair Colorization** nativo:

**Settings** → procure `bracket pair colorization` → ative **Editor: Bracket Pair Colorization**.

Não é obrigatório para o ESLint; só ajuda a ver pares de `()`, `{}`, `[]` em `if` aninhados.

---

## 16. Checklist da aula

- [ ] Terminal aberto em `src/03_module/eslint`
- [ ] `package.json` existe (`npm init -y` se criou do zero)
- [ ] ESLint instalado e config presente (`eslint.config.mjs` ou gerado pelo `--init`)
- [ ] Guia **Airbnb base** ativo
- [ ] Extensão ESLint instalada no editor
- [ ] Auto-fix ao salvar configurado
- [ ] `app.js` mostra avisos antes de salvar e melhora depois
- [ ] Sem `.eslintrc` conflitante em pasta pai
- [ ] `no-console` desligado no config (ou conscientemente mantido)

---

## 17. Próximos passos no curso

- Ajustar outras regras em `eslint.config.mjs` (ex.: `class-methods-use-this`) quando aparecerem nas aulas de classes.
- Repetir o mesmo padrão na API Express (`import`/`export` ou CommonJS — manter `sourceType` coerente).
- Mais tarde: **Prettier** (só formatação) + ESLint (qualidade) — não misturar responsabilidades sem combinar os dois de propósito.

---

## Referências rápidas

- ESLint CLI `--init`: [Command Line Interface](https://eslint.org/docs/latest/use/command-line-interface)
- Flat config: [Configuration Files](https://eslint.org/docs/latest/use/configure/configuration-files)
- Migrar shareable configs: [Migration Guide — FlatCompat](https://eslint.org/docs/latest/use/configure/migration-guide#using-eslintrc-configs-in-flat-config)
- Guia Airbnb (JavaScript): [https://github.com/airbnb/javascript](https://github.com/airbnb/javascript)
