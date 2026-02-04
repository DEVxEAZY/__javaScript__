/**
 * JS FUNCTIONS - Funções Avançadas
 * Este arquivo demonstra conceitos avançados de funções em JavaScript
 */

console.log("=== JS FUNCTIONS - Funções Avançadas ===\n");

// ============================================
// 1. Higher-Order Functions (Funções de Alta Ordem)
// ============================================
console.log("1. HIGHER-ORDER FUNCTIONS");

// Função que recebe outra função como parâmetro
function executarOperacao(a, b, operacao) {
    return operacao(a, b);
}

const soma = (x, y) => x + y;
const multiplicacao = (x, y) => x * y;

console.log("Soma:", executarOperacao(5, 3, soma));
console.log("Multiplicação:", executarOperacao(5, 3, multiplicacao));

// Função que retorna outra função
function criarMultiplicador(multiplicador) {
    return function(numero) {
        return numero * multiplicador;
    };
}

const dobrar = criarMultiplicador(2);
const triplicar = criarMultiplicador(3);

console.log("Dobrar 5:", dobrar(5));
console.log("Triplicar 5:", triplicar(5));

// ============================================
// 2. Closures (Fechamentos)
// ============================================
console.log("\n2. CLOSURES");

function criarContador() {
    let contador = 0;
    
    return function() {
        contador++;
        return contador;
    };
}

const contador1 = criarContador();
const contador2 = criarContador();

console.log("Contador 1:", contador1()); // 1
console.log("Contador 1:", contador1()); // 2
console.log("Contador 2:", contador2()); // 1 (independente)

// Closure com parâmetros
function criarCalculadora() {
    let historico = [];
    
    return {
        somar: function(a, b) {
            const resultado = a + b;
            historico.push(`${a} + ${b} = ${resultado}`);
            return resultado;
        },
        subtrair: function(a, b) {
            const resultado = a - b;
            historico.push(`${a} - ${b} = ${resultado}`);
            return resultado;
        },
        getHistorico: function() {
            return historico;
        },
        limparHistorico: function() {
            historico = [];
        }
    };
}

const calc = criarCalculadora();
calc.somar(10, 5);
calc.subtrair(10, 3);
console.log("Histórico:", calc.getHistorico());

// ============================================
// 3. Function Binding (this)
// ============================================
console.log("\n3. FUNCTION BINDING");

const pessoa = {
    nome: "João",
    saudar: function() {
        return `Olá, eu sou ${this.nome}`;
    }
};

console.log("Saudação normal:", pessoa.saudar());

// Problema com this em callbacks
const saudarSeparado = pessoa.saudar;
// console.log(saudarSeparado()); // Erro: this é undefined

// Solução 1: bind()
const saudarBind = pessoa.saudar.bind(pessoa);
console.log("Com bind:", saudarBind());

// Solução 2: call()
console.log("Com call:", pessoa.saudar.call(pessoa));

// Solução 3: apply()
console.log("Com apply:", pessoa.saudar.apply(pessoa));

// Arrow functions preservam this do contexto
const pessoa2 = {
    nome: "Maria",
    saudar: function() {
        setTimeout(() => {
            console.log(`Arrow function: Olá, eu sou ${this.nome}`);
        }, 100);
    }
};
pessoa2.saudar();

// ============================================
// 4. Currying
// ============================================
console.log("\n4. CURRYING");

// Função normal
function somarNormal(a, b, c) {
    return a + b + c;
}

// Versão curried
function somarCurried(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        };
    };
}

// Arrow function curried
const somarCurriedArrow = a => b => c => a + b + c;

console.log("Normal:", somarNormal(1, 2, 3));
console.log("Curried:", somarCurried(1)(2)(3));
console.log("Curried Arrow:", somarCurriedArrow(1)(2)(3));

// Currying prático
function criarValidacao(regra) {
    return function(valor) {
        return regra(valor);
    };
}

const validarEmail = criarValidacao(email => email.includes("@"));
const validarIdade = criarValidacao(idade => idade >= 18);

console.log("Email válido:", validarEmail("user@example.com"));
console.log("Idade válida:", validarIdade(25));

// ============================================
// 5. Partial Application
// ============================================
console.log("\n5. PARTIAL APPLICATION");

function multiplicar(a, b, c) {
    return a * b * c;
}

// Aplicação parcial manual
function multiplicarPor2(b, c) {
    return multiplicar(2, b, c);
}

console.log("Multiplicar por 2:", multiplicarPor2(3, 4));

// Função genérica para partial application
function partial(fn, ...argsFixos) {
    return function(...argsRestantes) {
        return fn(...argsFixos, ...argsRestantes);
    };
}

const multiplicarPor10 = partial(multiplicar, 10);
console.log("Multiplicar por 10:", multiplicarPor10(2, 3));

// ============================================
// 6. Function Composition
// ============================================
console.log("\n6. FUNCTION COMPOSITION");

const dobrarNum = x => x * 2;
const adicionar5 = x => x + 5;
const subtrair3 = x => x - 3;

// Composição manual
function compor(...funcoes) {
    return function(valor) {
        return funcoes.reduceRight((acc, fn) => fn(acc), valor);
    };
}

const transformar = compor(subtrair3, adicionar5, dobrarNum);
console.log("Transformar 10:", transformar(10)); // ((10*2)+5)-3 = 22

// Composição com pipe (esquerda para direita)
function pipe(...funcoes) {
    return function(valor) {
        return funcoes.reduce((acc, fn) => fn(acc), valor);
    };
}

const transformarPipe = pipe(dobrarNum, adicionar5, subtrair3);
console.log("Transformar com pipe 10:", transformarPipe(10)); // ((10*2)+5)-3 = 22

// ============================================
// 7. Recursive Functions
// ============================================
console.log("\n7. RECURSIVE FUNCTIONS");

// Fatorial recursivo
function fatorial(n) {
    if (n <= 1) return 1;
    return n * fatorial(n - 1);
}

console.log("Fatorial de 5:", fatorial(5));

// Fibonacci recursivo (com memoização)
function fibonacciMemo() {
    const cache = {};
    
    return function fib(n) {
        if (n in cache) return cache[n];
        if (n <= 1) return n;
        cache[n] = fib(n - 1) + fib(n - 2);
        return cache[n];
    };
}

const fib = fibonacciMemo();
console.log("Fibonacci(10):", fib(10));

// ============================================
// 8. Generator Functions
// ============================================
console.log("\n8. GENERATOR FUNCTIONS");

function* contadorInfinito() {
    let i = 0;
    while (true) {
        yield i++;
    }
}

const gen = contadorInfinito();
console.log("Generator:", gen.next().value); // 0
console.log("Generator:", gen.next().value); // 1
console.log("Generator:", gen.next().value); // 2

// Generator com parâmetros
function* fibonacciGenerator() {
    let [prev, curr] = [0, 1];
    while (true) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}

const fibGen = fibonacciGenerator();
console.log("Fibonacci Generator:");
for (let i = 0; i < 5; i++) {
    console.log(fibGen.next().value);
}

// ============================================
// 9. Async Functions (será detalhado em JS Asynchronous)
// ============================================
console.log("\n9. ASYNC FUNCTIONS (preview)");

async function buscarDados() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Dados carregados"), 100);
    });
}

async function exemploAsync() {
    const dados = await buscarDados();
    console.log("Async:", dados);
}

exemploAsync();

// ============================================
// 10. Function Overloading (simulação)
// ============================================
console.log("\n10. FUNCTION OVERLOADING (simulação)");

function sobrecarregar(...args) {
    if (args.length === 1) {
        if (typeof args[0] === 'string') {
            return `String: ${args[0]}`;
        } else if (typeof args[0] === 'number') {
            return `Número: ${args[0]}`;
        }
    } else if (args.length === 2) {
        return `Dois parâmetros: ${args[0]}, ${args[1]}`;
    }
    return `Múltiplos parâmetros: ${args.length}`;
}

console.log("Overload 1:", sobrecarregar("texto"));
console.log("Overload 2:", sobrecarregar(42));
console.log("Overload 3:", sobrecarregar(1, 2));
console.log("Overload 4:", sobrecarregar(1, 2, 3, 4));

// ============================================
// 11. Decorators (simulação)
// ============================================
console.log("\n11. DECORATORS (simulação)");

function logarChamadas(fn) {
    return function(...args) {
        console.log(`Chamando ${fn.name} com argumentos:`, args);
        const resultado = fn(...args);
        console.log(`Resultado:`, resultado);
        return resultado;
    };
}

function temporizar(fn) {
    return function(...args) {
        const inicio = Date.now();
        const resultado = fn(...args);
        const tempo = Date.now() - inicio;
        console.log(`${fn.name} executou em ${tempo}ms`);
        return resultado;
    };
}

function calcularComplexo(a, b) {
    let soma = 0;
    for (let i = 0; i < 1000000; i++) {
        soma += i;
    }
    return a + b;
}

const calcularDecorado = logarChamadas(temporizar(calcularComplexo));
calcularDecorado(5, 3);

console.log("\n=== FIM JS FUNCTIONS ===");
