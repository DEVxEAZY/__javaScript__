# 📚 Exercícios Práticos de JavaScript Avançado

Este arquivo contém exercícios práticos para consolidar o aprendizado dos tópicos avançados de JavaScript.

## 🎯 Instruções

1. Crie um arquivo para cada exercício (ex: `exercicio-1.js`)
2. Resolva os exercícios usando os conceitos aprendidos
3. Teste suas soluções executando os arquivos
4. Compare com as soluções sugeridas (criadas por você)

---

## 📝 Exercícios

### **Exercício 1: Sistema de Gerenciamento de Produtos**

Crie uma classe `GerenciadorProdutos` que:

- Armazene produtos em um `Map` (id → produto)
- Cada produto deve ter: `id`, `nome`, `preco`, `categoria`, `estoque`
- Implemente métodos:
  - `adicionar(nome, preco, categoria, estoque)` - adiciona produto
  - `remover(id)` - remove produto
  - `buscarPorCategoria(categoria)` - retorna produtos da categoria
  - `atualizarEstoque(id, quantidade)` - atualiza estoque
  - `aplicarDesconto(categoria, percentual)` - aplica desconto
  - `listarProdutosComEstoqueBaixo(limite)` - produtos com estoque < limite
  - `calcularValorTotalEstoque()` - soma total do estoque

**Dica:** Use classes, Maps, métodos de array, e desestruturação.

---

### **Exercício 2: Validador de Formulário Avançado**

Crie uma classe `ValidadorFormulario` que:

- Permita adicionar regras de validação por campo
- Suporte validações: `required`, `minLength`, `maxLength`, `email`, `pattern`, `custom`
- Implemente validação assíncrona (simular verificação de disponibilidade)
- Retorne erros agrupados por campo
- Suporte validação condicional (ex: validar campo B apenas se campo A for preenchido)

**Exemplo de uso:**
```javascript
const validador = new ValidadorFormulario();
validador.adicionarRegra('email', { required: true, email: true });
validador.adicionarRegra('senha', { required: true, minLength: 8 });
const resultado = await validador.validar(dados);
```

**Dica:** Use Promises, async/await, e objetos de configuração.

---

### **Exercício 3: Sistema de Cache com TTL e Prioridade**

Crie uma classe `CacheAvancado` que:

- Armazene itens com TTL (Time To Live) individual
- Suporte prioridades (alta, média, baixa)
- Quando o cache estiver cheio, remova itens de menor prioridade primeiro
- Implemente `get`, `set`, `clear`, `clearExpirados`
- Adicione método `estatisticas()` que retorne:
  - Total de itens
  - Itens por prioridade
  - Taxa de hit/miss
  - Itens expirados

**Dica:** Use Map, WeakMap para rastreamento, e timers.

---

### **Exercício 4: Event Emitter com Prioridades**

Estenda o `EventEmitter` criado nos exemplos para:

- Suportar prioridades de eventos (alta, média, baixa)
- Executar handlers por ordem de prioridade
- Permitir `once` com prioridade
- Implementar `prependListener` (adicionar no início)
- Adicionar método `listenerCount(evento)`
- Implementar `removeAllListeners(evento)`

**Dica:** Use arrays ordenados e métodos de array.

---

### **Exercício 5: API Client com Retry e Circuit Breaker**

Crie uma classe `APIClientRobusto` que:

- Implemente retry automático com backoff exponencial
- Implemente Circuit Breaker pattern:
  - Abre circuito após N falhas
  - Tenta novamente após timeout
  - Fecha quando sucesso
- Suporte timeout por requisição
- Cache de respostas (opcional)
- Logging de requisições

**Exemplo:**
```javascript
const client = new APIClientRobusto({
    baseURL: 'https://api.exemplo.com',
    retries: 3,
    circuitBreaker: { threshold: 5, timeout: 60000 }
});
```

**Dica:** Use Promises, async/await, e padrões de design.

---

### **Exercício 6: Router com Middleware**

Crie um sistema de roteamento que:

- Suporte rotas com parâmetros (`/usuario/:id`)
- Implemente middleware (before/after hooks)
- Suporte rotas aninhadas
- Implemente `beforeEach` e `afterEach` globais
- Suporte redirecionamento
- Histórico de navegação

**Exemplo:**
```javascript
const router = new Router();
router.beforeEach((to, from, next) => {
    // Verificar autenticação
    next();
});
router.addRoute('/usuario/:id', (params) => {
    console.log('ID:', params.id);
});
```

**Dica:** Use Expressões Regulares, Map, e callbacks.

---

### **Exercício 7: State Manager com Imutabilidade**

Crie um `StateManager` que:

- Mantenha histórico de estados (undo/redo)
- Suporte ações (actions) e reducers
- Implemente imutabilidade (não modificar estado diretamente)
- Suporte middlewares (ex: logging)
- Notifique listeners apenas quando estado realmente mudar
- Implemente `getState()`, `dispatch(action)`, `subscribe(listener)`

**Exemplo:**
```javascript
const store = new StateManager(reducer, estadoInicial);
store.dispatch({ type: 'INCREMENT', payload: 1 });
```

**Dica:** Use Proxy para detectar mudanças, ou comparação profunda.

---

### **Exercício 8: Debounce e Throttle Avançados**

Crie versões avançadas de `debounce` e `throttle` que:

- Suportem opções: `leading`, `trailing`, `maxWait`
- Retornem Promise que resolve quando executado
- Permitam cancelamento
- Suportem flush (executar imediatamente)
- Implementem `debounceImmediate` e `throttleLeading`

**Exemplo:**
```javascript
const debounced = debounceAvancado(fn, 1000, {
    leading: true,
    trailing: false,
    maxWait: 5000
});
```

**Dica:** Use closures, timers, e objetos de configuração.

---

### **Exercício 9: Sistema de Observabilidade**

Crie um sistema que:

- Permita observar mudanças em objetos aninhados
- Use Proxy para interceptar mudanças
- Suporte observadores por caminho (`usuario.nome`)
- Implemente `observe`, `unobserve`, `notify`
- Suporte batch updates (agrupar múltiplas mudanças)

**Exemplo:**
```javascript
const observavel = criarObservavel({ usuario: { nome: 'João' } });
observavel.observe('usuario.nome', (novo, antigo) => {
    console.log(`Nome mudou de ${antigo} para ${novo}`);
});
```

**Dica:** Use Proxy, Reflect, e estruturas de dados para rastreamento.

---

### **Exercício 10: Query Builder Simples**

Crie uma classe `QueryBuilder` que:

- Permita construir queries de forma fluente
- Suporte: `select`, `where`, `orderBy`, `limit`, `offset`
- Implemente método `build()` que retorne query
- Suporte encadeamento de métodos
- Valide query antes de construir

**Exemplo:**
```javascript
const query = new QueryBuilder('usuarios')
    .select('nome', 'email')
    .where('idade', '>', 18)
    .orderBy('nome', 'ASC')
    .limit(10)
    .build();
```

**Dica:** Use classes, métodos que retornam `this`, e validação.

---

### **Exercício 11: Sistema de Permissões**

Crie um sistema de permissões que:

- Defina roles (admin, user, guest)
- Defina permissões por recurso e ação
- Implemente verificação de permissões
- Suporte herança de roles
- Cache resultados de verificação

**Exemplo:**
```javascript
const permissao = new SistemaPermissoes();
permissao.definirRole('admin', ['usuarios:read', 'usuarios:write']);
permissao.definirRole('user', ['usuarios:read']);
permissao.verificar('admin', 'usuarios:write'); // true
```

**Dica:** Use Map, Set, e estruturas hierárquicas.

---

### **Exercício 12: Compilador de Template Simples**

Crie um compilador de templates que:

- Suporte variáveis: `{{ variavel }}`
- Suporte condicionais: `{{#if condicao}}...{{/if}}`
- Suporte loops: `{{#each array}}...{{/each}}`
- Suporte helpers customizados
- Escape HTML por padrão (opção de não escapar)

**Exemplo:**
```javascript
const template = 'Olá {{ nome }}, você tem {{ itens.length }} itens.';
const compilado = compilarTemplate(template);
const resultado = compilado({ nome: 'João', itens: [1, 2, 3] });
```

**Dica:** Use Expressões Regulares, parsing, e funções de substituição.

---

### **Exercício 13: Sistema de Fila com Prioridades**

Crie uma classe `FilaPrioritaria` que:

- Insira itens com prioridade
- Remova sempre o item de maior prioridade
- Suporte diferentes estratégias de prioridade
- Implemente `enqueue(item, prioridade)`, `dequeue()`, `peek()`
- Adicione método `clear()` e `size()`

**Dica:** Use arrays ordenados ou estruturas de dados apropriadas.

---

### **Exercício 14: Diff de Objetos**

Crie uma função `diffObjetos` que:

- Compare dois objetos profundamente
- Retorne diferenças: adicionado, removido, modificado
- Suporte arrays
- Indique caminho das diferenças (`usuario.endereco.cidade`)
- Opção de ignorar propriedades específicas

**Exemplo:**
```javascript
const diff = diffObjetos(
    { a: 1, b: 2, c: { d: 3 } },
    { a: 1, b: 20, e: 4 }
);
// { modificado: { b: { antigo: 2, novo: 20 } }, adicionado: { e: 4 }, removido: { c: { d: 3 } } }
```

**Dica:** Use recursão, e estruturas para rastrear caminhos.

---

### **Exercício 15: Sistema Completo - Aplicação Todo Avançada**

Crie uma aplicação Todo completa que combine:

- Gerenciamento de tarefas (CRUD completo)
- Sistema de categorias e tags
- Filtros avançados (por data, prioridade, categoria)
- Busca full-text
- Persistência local (localStorage)
- Sincronização com API (simulada)
- Histórico de ações (undo/redo)
- Estatísticas e relatórios
- Exportação para JSON/CSV

**Requisitos:**
- Use classes, módulos ES6
- Implemente padrões: Observer, Factory, Singleton
- Use async/await para operações assíncronas
- Valide todas as entradas
- Trate erros adequadamente
- Documente o código

**Dica:** Este é um projeto completo - organize em múltiplos arquivos/módulos.

---

## 🎓 Dicas Gerais

1. **Teste seu código:** Crie casos de teste simples
2. **Trate erros:** Sempre valide entradas e trate erros
3. **Documente:** Adicione comentários explicando lógica complexa
4. **Refatore:** Melhore o código após fazer funcionar
5. **Compare:** Veja como outros resolveriam (após tentar você mesmo)

## 📚 Recursos Adicionais

- Revise os arquivos de exemplo criados
- Consulte a documentação MDN
- Pratique com projetos reais
- Participe de code reviews

---

## ✅ Checklist de Aprendizado

Após completar os exercícios, você deve ser capaz de:

- [ ] Criar e usar classes com herança
- [ ] Trabalhar com Promises e async/await
- [ ] Usar Map, Set, WeakMap, WeakSet
- [ ] Implementar padrões de design comuns
- [ ] Manipular DOM e eventos
- [ ] Fazer requisições HTTP (Fetch/AJAX)
- [ ] Trabalhar com módulos ES6
- [ ] Usar Proxy e Reflect
- [ ] Implementar sistemas de cache
- [ ] Criar validadores e helpers reutilizáveis

---

**Boa sorte com os exercícios! 🚀**

*Lembre-se: a prática é essencial para dominar JavaScript avançado.*
