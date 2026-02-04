/**
 * JS EXAMPLES - Exemplos Práticos
 * Este arquivo contém exemplos práticos combinando vários conceitos
 */

console.log("=== JS EXAMPLES - Exemplos Práticos ===\n");

// ============================================
// 1. Sistema de Gerenciamento de Tarefas
// ============================================
console.log("1. SISTEMA DE GERENCIAMENTO DE TAREFAS");

class GerenciadorTarefas {
    constructor() {
        this.tarefas = new Map();
        this.contador = 0;
        this.filtro = 'todas';
    }
    
    adicionar(descricao, prioridade = 'média') {
        const id = ++this.contador;
        const tarefa = {
            id,
            descricao,
            prioridade,
            concluida: false,
            dataCriacao: new Date()
        };
        this.tarefas.set(id, tarefa);
        return tarefa;
    }
    
    concluir(id) {
        const tarefa = this.tarefas.get(id);
        if (tarefa) {
            tarefa.concluida = true;
            return true;
        }
        return false;
    }
    
    remover(id) {
        return this.tarefas.delete(id);
    }
    
    listar(filtro = 'todas') {
        const todas = Array.from(this.tarefas.values());
        
        switch(filtro) {
            case 'pendentes':
                return todas.filter(t => !t.concluida);
            case 'concluidas':
                return todas.filter(t => t.concluida);
            case 'alta':
                return todas.filter(t => t.prioridade === 'alta');
            default:
                return todas;
        }
    }
    
    estatisticas() {
        const todas = Array.from(this.tarefas.values());
        return {
            total: todas.length,
            concluidas: todas.filter(t => t.concluida).length,
            pendentes: todas.filter(t => !t.concluida).length,
            porPrioridade: {
                alta: todas.filter(t => t.prioridade === 'alta').length,
                media: todas.filter(t => t.prioridade === 'média').length,
                baixa: todas.filter(t => t.prioridade === 'baixa').length
            }
        };
    }
}

const gerenciador = new GerenciadorTarefas();
gerenciador.adicionar("Aprender JavaScript", "alta");
gerenciador.adicionar("Fazer exercícios", "média");
gerenciador.adicionar("Revisar conceitos", "baixa");
console.log("Tarefas:", gerenciador.listar());
console.log("Estatísticas:", gerenciador.estatisticas());

// ============================================
// 2. Sistema de Cache
// ============================================
console.log("\n2. SISTEMA DE CACHE");

class Cache {
    constructor(ttl = 60000) { // 1 minuto padrão
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    set(chave, valor, ttlCustom = null) {
        const expiracao = Date.now() + (ttlCustom || this.ttl);
        this.cache.set(chave, {
            valor,
            expiracao
        });
    }
    
    get(chave) {
        const item = this.cache.get(chave);
        
        if (!item) return null;
        
        if (Date.now() > item.expiracao) {
            this.cache.delete(chave);
            return null;
        }
        
        return item.valor;
    }
    
    limpar() {
        this.cache.clear();
    }
    
    limparExpirados() {
        const agora = Date.now();
        for (let [chave, item] of this.cache.entries()) {
            if (agora > item.expiracao) {
                this.cache.delete(chave);
            }
        }
    }
}

const cache = new Cache(5000);
cache.set('usuario', { nome: 'João', id: 1 });
console.log("Cache get:", cache.get('usuario'));
setTimeout(() => {
    console.log("Cache após expiração:", cache.get('usuario'));
}, 6000);

// ============================================
// 3. Validador de Formulário
// ============================================
console.log("\n3. VALIDADOR DE FORMULÁRIO");

class Validador {
    constructor() {
        this.regras = new Map();
    }
    
    adicionarRegra(campo, regra) {
        if (!this.regras.has(campo)) {
            this.regras.set(campo, []);
        }
        this.regras.get(campo).push(regra);
    }
    
    validar(dados) {
        const erros = {};
        
        for (let [campo, regras] of this.regras.entries()) {
            const valor = dados[campo];
            
            for (let regra of regras) {
                const resultado = regra(valor, dados);
                if (resultado !== true) {
                    if (!erros[campo]) erros[campo] = [];
                    erros[campo].push(resultado);
                }
            }
        }
        
        return {
            valido: Object.keys(erros).length === 0,
            erros
        };
    }
}

const validador = new Validador();

// Regras
validador.adicionarRegra('nome', (valor) => {
    if (!valor || valor.trim().length === 0) {
        return 'Nome é obrigatório';
    }
    if (valor.length < 3) {
        return 'Nome deve ter pelo menos 3 caracteres';
    }
    return true;
});

validador.adicionarRegra('email', (valor) => {
    if (!valor) return 'Email é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)) {
        return 'Email inválido';
    }
    return true;
});

validador.adicionarRegra('senha', (valor) => {
    if (!valor) return 'Senha é obrigatória';
    if (valor.length < 6) {
        return 'Senha deve ter pelo menos 6 caracteres';
    }
    return true;
});

const dadosForm = { nome: 'Jo', email: 'email-invalido', senha: '123' };
const validacao = validador.validar(dadosForm);
console.log("Validação:", validacao);

// ============================================
// 4. Event Emitter
// ============================================
console.log("\n4. EVENT EMITTER");

class EventEmitter {
    constructor() {
        this.eventos = new Map();
    }
    
    on(evento, callback) {
        if (!this.eventos.has(evento)) {
            this.eventos.set(evento, []);
        }
        this.eventos.get(evento).push(callback);
    }
    
    off(evento, callback) {
        if (!this.eventos.has(evento)) return;
        
        const callbacks = this.eventos.get(evento);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }
    
    emit(evento, ...args) {
        if (!this.eventos.has(evento)) return;
        
        this.eventos.get(evento).forEach(callback => {
            callback(...args);
        });
    }
    
    once(evento, callback) {
        const wrapper = (...args) => {
            callback(...args);
            this.off(evento, wrapper);
        };
        this.on(evento, wrapper);
    }
}

const emitter = new EventEmitter();
emitter.on('login', (usuario) => {
    console.log(`Usuário ${usuario} fez login`);
});

emitter.emit('login', 'João');

// ============================================
// 5. Debounce e Throttle
// ============================================
console.log("\n5. DEBOUNCE E THROTTLE");

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

const debounced = debounce(() => {
    console.log("Debounced executado");
}, 1000);

const throttled = throttle(() => {
    console.log("Throttled executado");
}, 1000);

console.log("Debounce e Throttle criados");

// ============================================
// 6. Observer Pattern
// ============================================
console.log("\n6. OBSERVER PATTERN");

class Observable {
    constructor() {
        this.observers = [];
    }
    
    subscribe(observer) {
        this.observers.push(observer);
        return () => {
            const index = this.observers.indexOf(observer);
            if (index > -1) {
                this.observers.splice(index, 1);
            }
        };
    }
    
    notify(data) {
        this.observers.forEach(observer => observer(data));
    }
}

const observable = new Observable();
const unsubscribe = observable.subscribe((dados) => {
    console.log("Observer recebeu:", dados);
});

observable.notify({ mensagem: "Olá!" });
unsubscribe();
observable.notify({ mensagem: "Não recebido" });

// ============================================
// 7. State Manager Simples
// ============================================
console.log("\n7. STATE MANAGER");

class StateManager {
    constructor(estadoInicial = {}) {
        this.estado = estadoInicial;
        this.listeners = [];
    }
    
    getState() {
        return { ...this.estado };
    }
    
    setState(updates) {
        this.estado = { ...this.estado, ...updates };
        this.listeners.forEach(listener => listener(this.estado));
    }
    
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }
}

const stateManager = new StateManager({ contador: 0 });
stateManager.subscribe((estado) => {
    console.log("Estado atualizado:", estado);
});

stateManager.setState({ contador: 1 });
stateManager.setState({ contador: 2, usuario: "João" });

// ============================================
// 8. Router Simples
// ============================================
console.log("\n8. ROUTER SIMPLES");

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
    }
    
    adicionarRota(caminho, handler) {
        this.routes.set(caminho, handler);
    }
    
    navegar(caminho) {
        const handler = this.routes.get(caminho);
        if (handler) {
            this.currentRoute = caminho;
            handler();
        } else {
            console.error(`Rota ${caminho} não encontrada`);
        }
    }
    
    getCurrentRoute() {
        return this.currentRoute;
    }
}

const router = new Router();
router.adicionarRota('/', () => console.log("Página inicial"));
router.adicionarRota('/sobre', () => console.log("Página sobre"));
router.navegar('/');
router.navegar('/sobre');

// ============================================
// 9. API Client com Cache
// ============================================
console.log("\n9. API CLIENT COM CACHE");

class APIClientComCache {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.cache = new Cache(60000); // 1 minuto
    }
    
    async get(endpoint, usarCache = true) {
        if (usarCache) {
            const cached = this.cache.get(endpoint);
            if (cached) {
                console.log("Retornando do cache");
                return cached;
            }
        }
        
        // Simulação de requisição
        const dados = { endpoint, dados: "resposta da API" };
        
        if (usarCache) {
            this.cache.set(endpoint, dados);
        }
        
        return dados;
    }
}

const apiClient = new APIClientComCache('https://api.exemplo.com');
apiClient.get('/usuarios').then(dados => {
    console.log("Primeira requisição:", dados);
    return apiClient.get('/usuarios'); // Usa cache
}).then(dados => {
    console.log("Segunda requisição (cache):", dados);
});

// ============================================
// 10. Exemplo Completo - Aplicação Todo
// ============================================
console.log("\n10. APLICAÇÃO TODO COMPLETA");

class AplicacaoTodo {
    constructor() {
        this.tarefas = new GerenciadorTarefas();
        this.stateManager = new StateManager({ filtro: 'todas' });
        this.eventEmitter = new EventEmitter();
        
        this.stateManager.subscribe((estado) => {
            this.eventEmitter.emit('stateChanged', estado);
        });
    }
    
    adicionarTarefa(descricao, prioridade) {
        const tarefa = this.tarefas.adicionar(descricao, prioridade);
        this.eventEmitter.emit('tarefaAdicionada', tarefa);
        return tarefa;
    }
    
    concluirTarefa(id) {
        const sucesso = this.tarefas.concluir(id);
        if (sucesso) {
            this.eventEmitter.emit('tarefaConcluida', id);
        }
        return sucesso;
    }
    
    filtrarTarefas(filtro) {
        this.stateManager.setState({ filtro });
        return this.tarefas.listar(filtro);
    }
}

const app = new AplicacaoTodo();
app.eventEmitter.on('tarefaAdicionada', (tarefa) => {
    console.log("Nova tarefa:", tarefa);
});

app.adicionarTarefa("Estudar JavaScript", "alta");
app.concluirTarefa(1);
console.log("Tarefas filtradas:", app.filtrarTarefas('pendentes'));

console.log("\n=== FIM JS EXAMPLES ===");
