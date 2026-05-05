/**
 * RAÍZES DO JAVASCRIPT — Conceitos profundos da linguagem
 *
 * Este arquivo cobre o que ACONTECE POR BAIXO do código:
 * contexto de execução, hoisting, TDZ, closures, prototypes,
 * this binding, coerção, event loop, iterators, generators,
 * Proxy, Reflect, descriptors, GC, e padrões funcionais.
 *
 * Cada bloco é executável e imprime o resultado.
 */

"use strict";

// ============================================================
// 1. CONTEXTO DE EXECUÇÃO E CALL STACK
// ============================================================
// Todo código JS roda dentro de um Execution Context.
// Existem 3 tipos: Global, Function e Eval.
// Cada contexto tem: Variable Environment, Lexical Environment, this.
// A Call Stack é uma pilha LIFO desses contextos.
console.log("\n=== 1. EXECUTION CONTEXT / CALL STACK ===");

function nivelA() {
    console.log("Stack ao entrar em A:");
    console.trace();
    nivelB();
}
function nivelB() {
    nivelC();
}
function nivelC() {
    // No topo da pilha: nivelC -> nivelB -> nivelA -> <global>
    console.log("Profundidade atual:", new Error().stack.split("\n").length);
}
nivelA();

// ============================================================
// 2. HOISTING — fases de criação vs execução
// ============================================================
// Antes de executar, o motor faz uma "passagem de criação":
//   - declarações `function` sobem INTEIRAS (com corpo)
//   - `var` sobe declarada como undefined
//   - `let`/`const`/`class` sobem mas ficam na TDZ até a linha de declaração
console.log("\n=== 2. HOISTING ===");

console.log("var antes da declaração:", typeof varHoisted); // "undefined" (não erro)
var varHoisted = 1;

console.log("function chamada antes da declaração:", funcHoisted()); // "ok"
function funcHoisted() { return "ok"; }

// Function expression NÃO sobe com corpo:
try {
    exprHoisted(); // TypeError: exprHoisted is not a function
} catch (e) {
    console.log("function expression não é hoisted:", e.message);
}
var exprHoisted = function () { return "ok"; };

// ============================================================
// 3. TEMPORAL DEAD ZONE (TDZ)
// ============================================================
// `let` e `const` existem desde o início do bloco, mas acessá-los
// antes da linha de declaração lança ReferenceError.
console.log("\n=== 3. TEMPORAL DEAD ZONE ===");

try {
    console.log(letTDZ); // ReferenceError
} catch (e) {
    console.log("TDZ:", e.message);
}
let letTDZ = 42;

// typeof em variável não declarada retorna "undefined",
// mas em variável NA TDZ lança ReferenceError — diferença sutil:
{
    try {
        // eslint-disable-next-line no-unused-expressions
        typeof xTDZ; // ReferenceError dentro do bloco onde let xTDZ existe
    } catch (e) {
        console.log("typeof na TDZ falha:", e.message);
    }
    let xTDZ = 1;
    console.log("após declaração:", xTDZ);
}

// ============================================================
// 4. LEXICAL ENVIRONMENT E SCOPE CHAIN
// ============================================================
// Toda função "lembra" do ambiente léxico onde foi DEFINIDA,
// não onde é chamada. Isso forma a Scope Chain.
console.log("\n=== 4. LEXICAL ENVIRONMENT ===");

const ambienteExterno = "fora";
function externa() {
    const ambienteInterno = "dentro";
    function interna() {
        // sobe a cadeia: interna -> externa -> global
        return `${ambienteExterno} | ${ambienteInterno}`;
    }
    return interna;
}
console.log("Scope chain:", externa()());

// ============================================================
// 5. CLOSURES — estado privado por captura léxica
// ============================================================
// Closure = função + referência ao ambiente onde foi criada.
console.log("\n=== 5. CLOSURES ===");

function criarContador(inicial = 0) {
    let valor = inicial; // capturado por todas as funções abaixo
    return {
        inc: () => ++valor,
        dec: () => --valor,
        get: () => valor,
    };
}
const c = criarContador(10);
c.inc(); c.inc(); c.dec();
console.log("Contador final:", c.get()); // 11
// `valor` não é acessível de fora — encapsulamento real via closure.

// Pegadinha clássica: closures dentro de loop
console.log("Closures em loop com var (todos imprimem 3):");
const comVar = [];
for (var i = 0; i < 3; i++) comVar.push(() => i);
console.log(comVar.map(f => f()));

console.log("Closures em loop com let (capturam por iteração):");
const comLet = [];
for (let i = 0; i < 3; i++) comLet.push(() => i);
console.log(comLet.map(f => f()));

// ============================================================
// 6. IIFE — Immediately Invoked Function Expression
// ============================================================
// Padrão pré-ES6 para criar escopo isolado.
console.log("\n=== 6. IIFE ===");

const moduloPrivado = (function () {
    let segredo = "42";
    return { ler: () => segredo };
})();
console.log("Módulo IIFE:", moduloPrivado.ler());

// ============================================================
// 7. THIS — as 4 regras de binding
// ============================================================
// 1) Default: chamada solta -> globalThis (ou undefined em strict)
// 2) Implícito: obj.metodo() -> this = obj
// 3) Explícito: call/apply/bind -> this = primeiro arg
// 4) new: this = objeto recém-criado
// Arrow functions NÃO têm this próprio — herdam léxico.
console.log("\n=== 7. THIS BINDING ===");

function quemSouEu() { return this; }
console.log("Default (strict):", quemSouEu()); // undefined em strict mode

const obj = { nome: "obj", quem: quemSouEu };
console.log("Implícito:", obj.quem().nome);

console.log("Explícito (call):", quemSouEu.call({ nome: "explicito" }).nome);

function Pessoa(nome) { this.nome = nome; }
console.log("new:", new Pessoa("Ana").nome);

const objArrow = {
    nome: "léxico",
    seta: () => this,           // this herdado do escopo de definição
    metodo() { return (() => this.nome)(); }, // arrow herda do método
};
console.log("Arrow herda léxico:", objArrow.seta()); // {} ou undefined no top-level
console.log("Arrow dentro de método:", objArrow.metodo());

// ============================================================
// 8. CALL / APPLY / BIND
// ============================================================
console.log("\n=== 8. CALL / APPLY / BIND ===");

function apresentar(saudacao, pontuacao) {
    return `${saudacao}, sou ${this.nome}${pontuacao}`;
}
console.log(apresentar.call({ nome: "Ana" }, "Olá", "!"));
console.log(apresentar.apply({ nome: "Beto" }, ["Oi", "."]));

const apresentarCarla = apresentar.bind({ nome: "Carla" }, "Salve");
console.log(apresentarCarla("?"));

// ============================================================
// 9. PROTOTYPES E A CADEIA DE PROTÓTIPOS
// ============================================================
// Todo objeto tem um link interno [[Prototype]] (acessível por
// Object.getPrototypeOf / __proto__). Lookup de propriedade sobe
// por essa cadeia até null.
console.log("\n=== 9. PROTOTYPES ===");

const animal = {
    respirar() { return `${this.nome} respira`; },
};
const cachorro = Object.create(animal);
cachorro.nome = "Rex";
cachorro.latir = function () { return `${this.nome} late`; };

console.log(cachorro.respirar()); // herdado
console.log(cachorro.latir());
console.log("Cadeia:",
    Object.getPrototypeOf(cachorro) === animal,
    Object.getPrototypeOf(animal) === Object.prototype,
    Object.getPrototypeOf(Object.prototype) === null
);

// `class` é açúcar sintático sobre prototypes:
class A { ola() { return "A"; } }
class B extends A { ola() { return super.ola() + "->B"; } }
console.log("class é prototype:", new B().ola(),
    Object.getPrototypeOf(B.prototype) === A.prototype);

// ============================================================
// 10. PROPERTY DESCRIPTORS — writable, enumerable, configurable
// ============================================================
console.log("\n=== 10. PROPERTY DESCRIPTORS ===");

const cfg = {};
Object.defineProperty(cfg, "VERSAO", {
    value: "1.0.0",
    writable: false,    // não pode ser reatribuída
    enumerable: false,  // não aparece em for...in / Object.keys
    configurable: false,// não pode ser deletada/reconfigurada
});
cfg.VERSAO = "2.0.0"; // silencioso (ou TypeError em strict)
console.log("Imutável:", cfg.VERSAO);
console.log("Não enumerável:", Object.keys(cfg));
console.log("Descritor:", Object.getOwnPropertyDescriptor(cfg, "VERSAO"));

// Getters / setters via descriptor
const temperatura = {};
let _c = 0;
Object.defineProperty(temperatura, "celsius", {
    get() { return _c; },
    set(v) { if (v < -273.15) throw RangeError("zero absoluto"); _c = v; },
});
Object.defineProperty(temperatura, "fahrenheit", {
    get() { return _c * 9/5 + 32; },
});
temperatura.celsius = 25;
console.log("Celsius:", temperatura.celsius, "Fahrenheit:", temperatura.fahrenheit);

// ============================================================
// 11. FREEZE / SEAL / PREVENTEXTENSIONS
// ============================================================
console.log("\n=== 11. FREEZE / SEAL ===");

const frozen = Object.freeze({ a: 1 });
frozen.a = 2;        // ignorado
frozen.b = 3;        // ignorado
console.log("Frozen:", frozen, "isFrozen:", Object.isFrozen(frozen));

const sealed = Object.seal({ a: 1 });
sealed.a = 2;        // permitido (writable)
sealed.b = 3;        // ignorado (não pode adicionar)
console.log("Sealed:", sealed, "isSealed:", Object.isSealed(sealed));

// ============================================================
// 12. COERÇÃO — ToPrimitive, == vs ===, Symbol.toPrimitive
// ============================================================
console.log("\n=== 12. COERÇÃO ===");

console.log("[] == false:", [] == false);       // true (ambos -> 0)
console.log("[] == ![]:", [] == ![]);           // true (clássico)
console.log("null == undefined:", null == undefined); // true
console.log("null == 0:", null == 0);           // false (regra especial)
console.log("NaN == NaN:", NaN == NaN);         // false (sempre)

// Hook customizado de coerção:
const moeda = {
    valor: 100,
    [Symbol.toPrimitive](hint) {
        if (hint === "number") return this.valor;
        if (hint === "string") return `R$ ${this.valor.toFixed(2)}`;
        return `${this.valor}`; // default
    },
};
console.log("+moeda:", +moeda);
console.log("`${moeda}`:", `${moeda}`);
console.log("moeda + '':", moeda + "");

// ============================================================
// 13. PASSAGEM POR VALOR — referências também são valores
// ============================================================
// JS é SEMPRE pass-by-value. O "valor" de um objeto é uma
// REFERÊNCIA (ponteiro). Reatribuir o parâmetro não afeta o
// chamador; mutar o conteúdo afeta.
console.log("\n=== 13. PASSAGEM POR VALOR ===");

function tentarTrocar(o) { o = { x: 999 }; }   // só rebind local
function mutar(o)        { o.x = 999; }        // muta o objeto real

const ref = { x: 1 };
tentarTrocar(ref);
console.log("Após tentarTrocar:", ref); // { x: 1 }
mutar(ref);
console.log("Após mutar:", ref);        // { x: 999 }

// ============================================================
// 14. MEMÓRIA, GC E WEAK REFS
// ============================================================
// V8 usa GC geracional (mark-and-sweep). Você não libera memória
// manualmente — basta soltar referências. WeakMap/WeakSet/WeakRef
// permitem que o GC colete chaves/alvos mesmo "referenciados".
console.log("\n=== 14. WEAK REFS ===");

const meta = new WeakMap();
let chave = { id: 1 };
meta.set(chave, { criadoEm: Date.now() });
console.log("WeakMap antes:", meta.get(chave));
chave = null; // o objeto fica elegível para GC; entrada some sozinha

// FinalizationRegistry — callback após coleta (não use para lógica crítica)
const reg = new FinalizationRegistry((tag) => console.log("GC coletou:", tag));
(function () { reg.register({}, "objeto-temporario"); })();

// ============================================================
// 15. PROTOCOLO DE ITERAÇÃO — Symbol.iterator
// ============================================================
// Um objeto é "iterável" se tem [Symbol.iterator]() retornando um
// "iterator" — objeto com .next() => { value, done }.
console.log("\n=== 15. ITERATORS ===");

const intervalo = {
    de: 1, ate: 4,
    [Symbol.iterator]() {
        let cur = this.de, fim = this.ate;
        return {
            next: () => cur <= fim
                ? { value: cur++, done: false }
                : { value: undefined, done: true },
        };
    },
};
console.log("for...of custom:", [...intervalo]);

// ============================================================
// 16. GENERATORS — funções que pausam (yield)
// ============================================================
console.log("\n=== 16. GENERATORS ===");

function* fib() {
    let [a, b] = [0, 1];
    while (true) { yield a; [a, b] = [b, a + b]; }
}
const g = fib();
const primeiros5 = Array.from({ length: 5 }, () => g.next().value);
console.log("Fib infinita, primeiros 5:", primeiros5);

// Generator também recebe valores (comunicação bidirecional):
function* eco() {
    const x = yield "primeiro?";
    const y = yield `recebi ${x}, próximo?`;
    return `fim com ${y}`;
}
const e = eco();
console.log(e.next().value);          // "primeiro?"
console.log(e.next("A").value);       // "recebi A, próximo?"
console.log(e.next("B").value);       // "fim com B"

// ============================================================
// 17. EVENT LOOP — microtasks vs macrotasks
// ============================================================
// Ordem de saída deste bloco demonstra a fila de microtasks
// (Promise.then/queueMicrotask) rodando ANTES da próxima macrotask
// (setTimeout/setImmediate).
console.log("\n=== 17. EVENT LOOP ===");

console.log("sync 1");
setTimeout(() => console.log("macrotask (timeout)"), 0);
Promise.resolve().then(() => console.log("microtask 1"))
                 .then(() => console.log("microtask 2"));
queueMicrotask(() => console.log("microtask via queueMicrotask"));
console.log("sync 2");
// Saída esperada:
//   sync 1, sync 2, microtask 1, microtask via queueMicrotask,
//   microtask 2, macrotask (timeout)

// ============================================================
// 18. PROMISES — estados e propagação
// ============================================================
// Estados: pending -> fulfilled | rejected (irreversível).
// .then retorna NOVA promise; erros pulam até o próximo .catch.
console.log("\n=== 18. PROMISES ===");

Promise.resolve(1)
    .then(v => v + 1)
    .then(v => { throw new Error(`boom @ ${v}`); })
    .then(v => console.log("não roda:", v))
    .catch(err => console.log("capturado:", err.message))
    .finally(() => console.log("finally sempre"));

// async/await é açúcar sobre Promises + generators:
(async () => {
    try {
        const a = await Promise.resolve(10);
        const b = await Promise.resolve(20);
        console.log("await soma:", a + b);
    } catch (e) {
        console.log("async erro:", e.message);
    }
})();

// ============================================================
// 19. ASYNC ITERATORS — for await...of
// ============================================================
console.log("\n=== 19. ASYNC ITERATORS ===");

async function* tickerAsync(n) {
    for (let i = 1; i <= n; i++) {
        await new Promise(r => setTimeout(r, 10));
        yield i;
    }
}
(async () => {
    const out = [];
    for await (const v of tickerAsync(3)) out.push(v);
    console.log("ticker async:", out);
})();

// ============================================================
// 20. SYMBOLS E WELL-KNOWN SYMBOLS
// ============================================================
// Symbols criam chaves únicas. Os "well-known" customizam
// comportamentos da linguagem (iteração, coerção, instanceof, ...).
console.log("\n=== 20. SYMBOLS ===");

const s1 = Symbol("id");
const s2 = Symbol("id");
console.log("Symbols únicos:", s1 === s2); // false

class Par {
    static [Symbol.hasInstance](inst) { return typeof inst === "number" && inst % 2 === 0; }
}
console.log("4 instanceof Par:", 4 instanceof Par);
console.log("3 instanceof Par:", 3 instanceof Par);

// ============================================================
// 21. PROXY E REFLECT — interceptar operações fundamentais
// ============================================================
console.log("\n=== 21. PROXY / REFLECT ===");

const alvo = { saldo: 100 };
const conta = new Proxy(alvo, {
    get(t, prop, recv) {
        console.log(`  [get] ${String(prop)}`);
        return Reflect.get(t, prop, recv);
    },
    set(t, prop, val, recv) {
        if (prop === "saldo" && val < 0) throw RangeError("saldo negativo");
        console.log(`  [set] ${String(prop)} = ${val}`);
        return Reflect.set(t, prop, val, recv);
    },
});
conta.saldo;             // dispara get
conta.saldo = 200;       // dispara set
try { conta.saldo = -1; } catch (e) { console.log("bloqueado:", e.message); }

// ============================================================
// 22. PADRÕES FUNCIONAIS — currying, composição, memoização
// ============================================================
console.log("\n=== 22. FUNCIONAL ===");

const curry = (fn) => {
    const curried = (...args) =>
        args.length >= fn.length
            ? fn(...args)
            : (...mais) => curried(...args, ...mais);
    return curried;
};
const soma3 = curry((a, b, c) => a + b + c);
console.log("Curry:", soma3(1)(2)(3), soma3(1, 2)(3), soma3(1, 2, 3));

const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);
const pipe    = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
const inc = n => n + 1, dbl = n => n * 2;
console.log("compose(inc,dbl)(3):", compose(inc, dbl)(3)); // inc(dbl(3))=7
console.log("pipe(inc,dbl)(3):",    pipe(inc, dbl)(3));    // dbl(inc(3))=8

const memoize = (fn) => {
    const cache = new Map();
    return (...args) => {
        const k = JSON.stringify(args);
        if (!cache.has(k)) cache.set(k, fn(...args));
        return cache.get(k);
    };
};
const fibLento = memoize(function f(n) { return n < 2 ? n : f(n - 1) + f(n - 2); });
console.log("Fib(30) memoizado:", fibLento(30));

// ============================================================
// 23. CHAMADAS NULÍVEIS — ?. e ??
// ============================================================
console.log("\n=== 23. OPCIONAIS ===");

const usuario = { perfil: null };
console.log("optional chaining:", usuario.perfil?.endereco?.cep); // undefined
console.log("nullish coalescing:", usuario.perfil ?? "sem perfil");
console.log("?. invocação:", usuario.metodoInexistente?.()); // undefined

// Diferença chave: ?? só cai no fallback para null/undefined,
// enquanto || cai para qualquer falsy (0, "", false, NaN).
console.log("0 ?? 'fb':", 0 ?? "fb"); // 0
console.log("0 || 'fb':", 0 || "fb"); // "fb"

// ============================================================
// 24. DEEP CLONE — limites de spread vs structuredClone
// ============================================================
console.log("\n=== 24. DEEP CLONE ===");

const original = { a: 1, b: { c: [1, 2, { d: 3 }] }, dt: new Date() };
const shallow = { ...original };
shallow.b.c.push(99); // afeta o original também!
console.log("Shallow afetou original:", original.b.c);

const deep = structuredClone(original); // ES2022+
deep.b.c.push(42);
console.log("Deep não afeta original:", original.b.c);
console.log("Date preservada como Date:", deep.dt instanceof Date);

// ============================================================
// 25. STRICT MODE — diferenças observáveis
// ============================================================
// Já estamos em strict (topo do arquivo). Diferenças:
//  - this default = undefined (não global)
//  - atribuir a variável não declarada -> ReferenceError
//  - parâmetros duplicados, with, octais -> SyntaxError
//  - delete em variável -> SyntaxError
console.log("\n=== 25. STRICT MODE ===");

try {
    // eslint-disable-next-line no-undef
    naoDeclarada = 1; // ReferenceError em strict
} catch (e) {
    console.log("strict bloqueia implicit global:", e.message);
}

console.log("\n=== FIM — RAÍZES DO JAVASCRIPT ===");
