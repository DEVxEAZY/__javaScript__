# Desafio 1 — Edicao de produto (CRUD completo)

> **Nivel:** facil
> **Tempo estimado:** 30–60 min
> **Conceitos exercitados:** Mongoose (`findById`, `findByIdAndUpdate`),
> rotas, controllers, formulario com CSRF, flash messages.

---

## Contexto

O projeto atual cobre **C** (criar), **R** (listar) e **D** (excluir),
mas faltou o **U** (update). Bom CRUD. CRU**D**. Sem o U esta
incompleto.

## Objetivo

Permitir editar nome, preco e categoria de um produto existente.

---

## Roteiro tecnico

### 1. Rotas

Em `routes/produtos.js`, adicione:

```
GET   /produtos/:id/editar     →  formulario de edicao
POST  /produtos/:id            →  aplica a edicao
```

> Por que POST e nao PUT? Formularios HTML so suportam GET/POST.
> Para PUT/DELETE em form HTML, voce usa `method-override`. Em
> projeto real e otimo, mas aqui mantenha simples.

### 2. Controller

Em `controllers/produtosController.js`, adicione dois handlers:

- `formEditar(req, res, next)`
    - busca o produto por `req.params.id` com `Produto.findById`;
    - se nao achou: `req.flash("erro", ...)` + redirect pra lista;
    - renderiza `produtos/editar` passando `produto`.

- `atualizar(req, res, next)`
    - lê `nome`, `preco`, `categoria` de `req.body`;
    - usa `Produto.findByIdAndUpdate(id, dados, { runValidators: true })`;
    - trata `ValidationError` igual ao `criar`;
    - flash de sucesso e redirect pra `/produtos`.

> A flag `runValidators: true` e **importante**: por default o
> `findByIdAndUpdate` NAO roda as validacoes do schema. Sem
> ela, voce poderia salvar `preco: -10`.

### 3. View `views/produtos/editar.ejs`

Praticamente igual ao `novo.ejs`, mas:

- valores pre-preenchidos com os dados atuais
  (`<input value="<%= produto.nome %>">`);
- `action="/produtos/<%= produto._id %>"`;
- mantenha o `<input name="_csrf">`.

### 4. Lista

Em `views/produtos/index.ejs`, adicione um link "Editar" ao lado
do botao "Excluir" em cada item:

```html
<a href="/produtos/<%= p._id %>/editar">Editar</a>
```

---

## Criterios de aceite

- [ ] `GET /produtos/:id/editar` mostra um formulario com os
      campos pre-preenchidos.
- [ ] Submeter o formulario com dados validos atualiza o produto
      no Mongo (verifique no Compass) e mostra flash de sucesso.
- [ ] Submeter com `nome` vazio ou `preco` negativo **nao**
      atualiza e mostra flash de erro.
- [ ] Editar um `:id` que nao existe mostra flash de erro e
      redireciona para a lista (sem 500).
- [ ] Remover o `<input _csrf>` da view de edicao quebra com
      `EBADCSRFTOKEN` (esperado).
- [ ] O preco continua exibido com 2 casas (`toFixed(2)`).

---

## Dica de bonus

Depois de terminar, abra duas abas:

1. Aba A: `/produtos/:id/editar` (form pronto).
2. Aba B: exclua **o mesmo produto**.
3. Volte na aba A e submeta.

O que acontece? Qual flash aparece? Esse e o tipo de race
condition que existe em qualquer app multi-usuario. Pense em
como voce mitigaria — `versionKey` do Mongoose? Mensagem de erro
mais clara? Anote suas conclusoes.
