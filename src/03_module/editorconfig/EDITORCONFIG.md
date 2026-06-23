# EditorConfig — o mesmo editor em Windows, Linux e macOS

Esta aula vem **antes** do ESLint no roteiro da seção. Objetivo: todo mundo no curso com o **mesmo comportamento físico** do editor (indentação, fim de linha, encoding) — independente do sistema operacional.

**Próxima aula da trilha:** [`../eslint/ESLINT.md`](../eslint/ESLINT.md) (qualidade e estilo de código com ESLint + Airbnb).

---

## Índice

1. [Onde esta aula se encaixa na seção](#1-onde-esta-aula-se-encaixa-na-seção)
2. [EditorConfig vs ESLint vs guia Airbnb](#2-editorconfig-vs-eslint-vs-guia-airbnb)
3. [Por que padronizar antes do ESLint](#3-por-que-padronizar-antes-do-eslint)
4. [Extensão no VS Code / Cursor](#4-extensão-no-vs-code--cursor)
5. [Abrir a pasta do projeto da seção](#5-abrir-a-pasta-do-projeto-da-seção)
6. [Gerar o arquivo `.editorconfig`](#6-gerar-o-arquivo-editorconfig)
7. [Valores da aula (o que cada um faz)](#7-valores-da-aula-o-que-cada-um-faz)
8. [Neste repositório](#8-neste-repositório)
9. [Checklist](#9-checklist)

---

## 1. Onde esta aula se encaixa na seção

Ordem didática do curso (seção API / módulo 03):

```text
1. EditorConfig     ← você está aqui (editor igual para todos)
2. ESLint + Airbnb  ← ../eslint/ (regras de JavaScript)
3. API REST         ← pastas do projeto da seção (vídeo: ex. "api rest")
```

Na transcrição, o instrutor cria a **pasta da seção inteira** (ex.: API REST), coloca `.editorconfig` na **raiz** dessa pasta e só depois, em outra aula, entra o ESLint. Sem o passo 1, Windows (`CRLF`) e Linux (`LF`) geram diffs enormes no Git antes mesmo de discutir `;` ou aspas.

---

## 2. EditorConfig vs ESLint vs guia Airbnb

| Ferramenta | O que padroniza | Quem entende | Exemplo |
|------------|-----------------|--------------|---------|
| **EditorConfig** | Arquivo “físico”: tabs/espaços, LF/CRLF, UTF-8, newline final | Editor (VS Code, Cursor, WebStorm…) | 2 espaços, sempre `LF` |
| **ESLint** | Código JavaScript: regras lógicas e de estilo | ESLint (CLI + extensão) | `no-unused-vars`, `quotes` |
| **Guia Airbnb** | *Conjunto* de regras ESLint já escolhidas | Via `eslint-config-airbnb-base` | Ver [`../eslint/GUIA_AIRBNB.md`](../eslint/GUIA_AIRBNB.md) |

```text
  Você digita no editor
         │
         ▼
  ┌──────────────────┐
  │  .editorconfig   │  indent 2, LF, trim espaços no fim da linha
  └────────┬─────────┘
           ▼
  ┌──────────────────┐
  │  ESLint + Airbnb │  “essa variável não é usada”, aspas simples, semi
  └──────────────────┘
```

**Não são concorrentes.** EditorConfig não sabe se você usou `const` ou `var`. ESLint não troca `CRLF` por `LF` sozinho — mas o editor, com EditorConfig, passa a **salvar** no formato combinado.

---

## 3. Por que padronizar antes do ESLint

- **Git limpo:** mudança só de fim de linha (`CRLF` ↔ `LF`) polui PR inteiro.
- **Menos “funciona na minha máquina”:** paridade Windows/Linux na equipe do curso.
- **ESLint mais previsível:** muitas regras de estilo assumem arquivo consistente; auto-fix ao salvar combina com indentação já correta.
- **Uma aula rápida, efeito duradouro:** um arquivo na raiz do projeto da seção.

O instrutor resume: garantir que **todos os Visual Studio Code** (editores) se comportem **igualmente** antes de ferramentas que “forçam código melhor” (ESLint).

---

## 4. Extensão no VS Code / Cursor

1. **Extensions** → buscar: `EditorConfig for VS Code` (id: `EditorConfig.EditorConfig`).
2. Instalar.
3. Recarregar a janela se pedir.

Este lab inclui [`.vscode/extensions.json`](.vscode/extensions.json) para sugerir a extensão ao abrir a pasta.

Sem a extensão, o arquivo `.editorconfig` existe mas o editor **pode ignorar**.

---

## 5. Abrir a pasta do projeto da seção

Na aula:

1. **File → Open Folder**
2. Criar/abrir a pasta da **seção** (ex.: `api-rest`) — não só um arquivo solto.
3. A raiz aberta no editor é onde ficará `.editorconfig`.

Neste repositório de estudo, o equivalente é abrir:

- `src/03_module/` — aplica o [`.editorconfig`](../.editorconfig) a `eslint/` e às próximas pastas da seção, **ou**
- só `src/03_module/eslint/` se estiver focado no lab ESLint (herda o `.editorconfig` do pai se o editor resolver configs ascendentes).

Para o curso em vídeo, o aluno abre **a pasta que vai virar o projeto API**; aqui usamos `03_module` como “caixa” da seção.

---

## 6. Gerar o arquivo `.editorconfig`

Com a pasta aberta e a extensão instalada:

1. Botão direito na **raiz** do explorer.
2. **Generate .editorconfig** (menu da extensão EditorConfig).
3. Abrir `.editorconfig` e ajustar conforme a tabela abaixo.

Se preferir copiar sem o assistente, use o arquivo [`.editorconfig`](../.editorconfig) deste módulo.

---

## 7. Valores da aula (o que cada um faz)

Configuração alinhada à transcrição:

```ini
root = true

[*]
indent_style = space
indent_size = 2
charset = utf-8
trim_trailing_whitespace = true
end_of_line = lf
insert_final_newline = true
```

| Chave | Valor na aula | Por quê |
|-------|---------------|---------|
| `root = true` | `true` | Para aqui: não herdar `.editorconfig` de pasta pai no disco (evita surpresa com config antiga do curso) |
| `indent_style` | `space` | Espaços, não tab — comum em JS/React/Node |
| `indent_size` | `2` | Aula pede **2**, não 4 (default comum do editor) |
| `charset` | `utf-8` | Acentos e emoji sem corromper arquivo |
| `trim_trailing_whitespace` | `true` | Remove espaços invisíveis no fim da linha |
| `end_of_line` | `lf` | **LF** em todos os SO; no Windows o editor pode estar em CRLF — a aula corrige para não divergir do Linux |
| `insert_final_newline` | `true` | Última linha termina com newline (padrão Unix/Git) |

Depois de salvar, confira no rodapé do editor (quando disponível) ou crie um arquivo de teste: indent deve ser 2 espaços e, ao salvar, fim de linha `LF`.

---

## 8. Neste repositório

| Arquivo | Função |
|---------|--------|
| [`../.editorconfig`](../.editorconfig) | Padrão da **seção** `03_module` (raiz do módulo) |
| [`../eslint/`](../eslint/) | Lab ESLint — beneficia-se do mesmo indent/LF |
| [`../eslint/GUIA_AIRBNB.md`](../eslint/GUIA_AIRBNB.md) | Camada seguinte: *o que* escrever em JS, não *como* o bytes do arquivo são salvos |

Quando você criar a pasta do projeto API (como no vídeo), pode **copiar** este `.editorconfig` para a raiz desse projeto ou manter um único na raiz de `03_module`.

---

## 9. Checklist

- [ ] Extensão **EditorConfig for VS Code** instalada
- [ ] Pasta da seção aberta como workspace (não só um arquivo avulso)
- [ ] `.editorconfig` na raiz com `indent_size = 2` e `end_of_line = lf`
- [ ] `root = true` se não quiser herdar config de pastas acima no PC
- [ ] Arquivo salvo; teste rápido criando `.js` com indent automático de 2 espaços
- [ ] Próximo passo: [`../eslint/ESLINT.md`](../eslint/ESLINT.md)

---

## Referência

- Site oficial: [https://editorconfig.org](https://editorconfig.org)
- Especificação das propriedades: [EditorConfig Properties](https://github.com/editorconfig/editorconfig/wiki/EditorConfig-Properties)
