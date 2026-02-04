/**
 * JS REFERENCE - Referência Rápida
 * Este arquivo contém uma referência rápida dos principais conceitos
 */

console.log("=== JS REFERENCE - Referência Rápida ===\n");

// ============================================
// REFERÊNCIA RÁPIDA - SINTAXE
// ============================================
const referencia = {
    // Variáveis
    variaveis: {
        var: "Escopo de função, pode ser redeclarada",
        let: "Escopo de bloco, pode ser reatribuída",
        const: "Escopo de bloco, não pode ser reatribuída"
    },
    
    // Tipos de Dados
    tipos: {
        primitivos: ["string", "number", "boolean", "undefined", "null", "symbol", "bigint"],
        objetos: ["object", "array", "function", "date", "regexp"]
    },
    
    // Operadores
    operadores: {
        aritmeticos: ["+", "-", "*", "/", "%", "**"],
        comparacao: ["==", "===", "!=", "!==", ">", "<", ">=", "<="],
        logicos: ["&&", "||", "!"],
        atribuicao: ["=", "+=", "-=", "*=", "/=", "%="],
        ternario: "condicao ? valorSeVerdadeiro : valorSeFalso"
    },
    
    // Estruturas de Controle
    controle: {
        if: "if (condicao) { } else if { } else { }",
        switch: "switch (valor) { case 1: break; default: }",
        for: "for (let i = 0; i < n; i++) { }",
        while: "while (condicao) { }",
        doWhile: "do { } while (condicao)",
        forIn: "for (let key in objeto) { }",
        forOf: "for (let item of array) { }"
    },
    
    // Funções
    funcoes: {
        declaracao: "function nome() { }",
        expressao: "const nome = function() { }",
        arrow: "const nome = () => { }",
        arrowCurta: "const nome = x => x * 2",
        async: "async function nome() { await ... }",
        generator: "function* nome() { yield ... }"
    },
    
    // Objetos
    objetos: {
        literal: "{ propriedade: valor }",
        acesso: "objeto.propriedade ou objeto['propriedade']",
        desestruturacao: "const { a, b } = objeto",
        spread: "{ ...objeto, novaProp: valor }",
        methods: ["Object.keys()", "Object.values()", "Object.entries()", "Object.assign()"]
    },
    
    // Arrays
    arrays: {
        criar: "[1, 2, 3] ou new Array()",
        metodos: [
            "push()", "pop()", "shift()", "unshift()",
            "map()", "filter()", "reduce()", "forEach()",
            "find()", "some()", "every()", "includes()",
            "slice()", "splice()", "concat()", "join()"
        ],
        spread: "[...array, novoItem]"
    },
    
    // Classes
    classes: {
        declaracao: "class Nome { constructor() { } }",
        heranca: "class Filho extends Pai { }",
        static: "static metodo() { }",
        getter: "get propriedade() { }",
        setter: "set propriedade(valor) { }",
        private: "#campoPrivado"
    },
    
    // Promises
    promises: {
        criar: "new Promise((resolve, reject) => { })",
        usar: "promise.then().catch().finally()",
        async: "async function() { await promise }",
        all: "Promise.all([p1, p2])",
        race: "Promise.race([p1, p2])"
    },
    
    // Módulos
    modulos: {
        export: "export function nome() { }",
        exportDefault: "export default class Nome { }",
        import: "import { nome } from './arquivo.js'",
        importDefault: "import Nome from './arquivo.js'",
        importAll: "import * as Modulo from './arquivo.js'"
    },
    
    // JSON
    json: {
        stringify: "JSON.stringify(objeto)",
        parse: "JSON.parse(string)",
        replacer: "JSON.stringify(obj, replacer, space)",
        reviver: "JSON.parse(str, reviver)"
    },
    
    // DOM
    dom: {
        selecionar: [
            "document.getElementById()",
            "document.querySelector()",
            "document.querySelectorAll()"
        ],
        criar: "document.createElement('div')",
        manipular: [
            "elemento.textContent",
            "elemento.innerHTML",
            "elemento.setAttribute()",
            "elemento.classList.add()"
        ],
        eventos: "elemento.addEventListener('click', handler)"
    },
    
    // Fetch
    fetch: {
        get: "fetch(url).then(r => r.json())",
        post: "fetch(url, { method: 'POST', body: JSON.stringify(data) })",
        async: "const data = await fetch(url).then(r => r.json())",
        headers: "fetch(url, { headers: { 'Content-Type': 'application/json' } })"
    },
    
    // Métodos Úteis
    metodosUteis: {
        string: [
            "toUpperCase()", "toLowerCase()",
            "substring()", "split()", "replace()",
            "includes()", "startsWith()", "endsWith()"
        ],
        array: [
            "map()", "filter()", "reduce()",
            "find()", "some()", "every()",
            "sort()", "reverse()", "slice()"
        ],
        object: [
            "Object.keys()", "Object.values()",
            "Object.entries()", "Object.assign()",
            "Object.freeze()", "Object.seal()"
        ],
        math: [
            "Math.max()", "Math.min()",
            "Math.round()", "Math.floor()",
            "Math.ceil()", "Math.random()",
            "Math.PI", "Math.sqrt()"
        ],
        date: [
            "new Date()", "getFullYear()",
            "getMonth()", "getDate()",
            "toISOString()", "toLocaleString()"
        ]
    },
    
    // Padrões Comuns
    padroes: {
        debounce: "Limitar execução de função",
        throttle: "Executar função periodicamente",
        singleton: "Uma única instância",
        factory: "Função que cria objetos",
        observer: "Padrão Observer",
        module: "Padrão Module"
    },
    
    // ES6+ Features
    es6Plus: {
        arrowFunctions: "() => {}",
        templateLiterals: "`Texto ${variavel}`",
        destructuring: "const { a, b } = obj",
        spread: "...array ou ...obj",
        rest: "function(...args) { }",
        defaultParams: "function(a = 1) { }",
        classes: "class Nome { }",
        modules: "import/export",
        promises: "Promise, async/await",
        symbols: "Symbol('desc')",
        maps: "new Map()",
        sets: "new Set()",
        weakMap: "new WeakMap()",
        weakSet: "new WeakSet()",
        proxy: "new Proxy()",
        reflect: "Reflect API"
    }
};

console.log("Referência criada. Use console.log(referencia) para ver detalhes.");

// ============================================
// CHEAT SHEET - FUNÇÕES COMUNS
// ============================================

// Array Methods
const arrayMethods = {
    map: "array.map(x => x * 2)",
    filter: "array.filter(x => x > 5)",
    reduce: "array.reduce((acc, x) => acc + x, 0)",
    find: "array.find(x => x.id === 1)",
    some: "array.some(x => x > 10)",
    every: "array.every(x => x > 0)",
    forEach: "array.forEach(x => console.log(x))",
    includes: "array.includes(valor)",
    indexOf: "array.indexOf(valor)",
    slice: "array.slice(0, 3)",
    splice: "array.splice(1, 2)",
    concat: "array.concat([4, 5])",
    join: "array.join(', ')",
    sort: "array.sort((a, b) => a - b)",
    reverse: "array.reverse()"
};

// String Methods
const stringMethods = {
    length: "str.length",
    toUpperCase: "str.toUpperCase()",
    toLowerCase: "str.toLowerCase()",
    substring: "str.substring(0, 5)",
    substr: "str.substr(0, 5)",
    slice: "str.slice(0, 5)",
    split: "str.split(',')",
    replace: "str.replace('old', 'new')",
    replaceAll: "str.replaceAll('old', 'new')",
    includes: "str.includes('texto')",
    startsWith: "str.startsWith('texto')",
    endsWith: "str.endsWith('texto')",
    trim: "str.trim()",
    charAt: "str.charAt(0)",
    indexOf: "str.indexOf('texto')"
};

// Object Methods
const objectMethods = {
    keys: "Object.keys(obj)",
    values: "Object.values(obj)",
    entries: "Object.entries(obj)",
    assign: "Object.assign({}, obj1, obj2)",
    freeze: "Object.freeze(obj)",
    seal: "Object.seal(obj)",
    create: "Object.create(proto)",
    defineProperty: "Object.defineProperty(obj, 'prop', {})",
    hasOwnProperty: "obj.hasOwnProperty('prop')",
    is: "Object.is(a, b)"
};

// Date Methods
const dateMethods = {
    newDate: "new Date()",
    getFullYear: "date.getFullYear()",
    getMonth: "date.getMonth()",
    getDate: "date.getDate()",
    getDay: "date.getDay()",
    getHours: "date.getHours()",
    getMinutes: "date.getMinutes()",
    getTime: "date.getTime()",
    toISOString: "date.toISOString()",
    toLocaleString: "date.toLocaleString()",
    toDateString: "date.toDateString()"
};

// Math Methods
const mathMethods = {
    abs: "Math.abs(-5)",
    ceil: "Math.ceil(4.3)",
    floor: "Math.floor(4.7)",
    round: "Math.round(4.5)",
    max: "Math.max(1, 2, 3)",
    min: "Math.min(1, 2, 3)",
    random: "Math.random()",
    sqrt: "Math.sqrt(16)",
    pow: "Math.pow(2, 3)",
    PI: "Math.PI",
    E: "Math.E"
};

console.log("\n=== CHEAT SHEETS ===");
console.log("Array Methods:", Object.keys(arrayMethods).length, "métodos");
console.log("String Methods:", Object.keys(stringMethods).length, "métodos");
console.log("Object Methods:", Object.keys(objectMethods).length, "métodos");
console.log("Date Methods:", Object.keys(dateMethods).length, "métodos");
console.log("Math Methods:", Object.keys(mathMethods).length, "métodos");

// ============================================
// EXPRESSÕES REGULARES COMUNS
// ============================================
const regexPatterns = {
    email: "/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/",
    url: "/^https?:\\/\\/.+/",
    telefone: "/^\\d{10,11}$/",
    cpf: "/^\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}$/",
    cep: "/^\\d{5}-?\\d{3}$/",
    numero: "/^\\d+$/",
    letras: "/^[a-zA-Z]+$/",
    alfanumerico: "/^[a-zA-Z0-9]+$/",
    senhaForte: "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$/"
};

console.log("\nRegex Patterns:", Object.keys(regexPatterns).length, "padrões");

// ============================================
// BOAS PRÁTICAS
// ============================================
const boasPraticas = {
    nomenclatura: {
        variaveis: "camelCase",
        constantes: "UPPER_SNAKE_CASE",
        classes: "PascalCase",
        arquivos: "kebab-case"
    },
    codigo: {
        usarConst: "Use const por padrão",
        usarLet: "Use let quando necessário",
        evitarVar: "Evite var",
        arrowFunctions: "Use arrow functions quando possível",
        templateLiterals: "Use template literals para strings",
        comparacao: "Use === ao invés de ==",
        nomesDescritivos: "Use nomes descritivos",
        comentarios: "Comente código complexo",
        funcoesPequenas: "Mantenha funções pequenas e focadas"
    },
    performance: {
        evitarLoopsAninhados: "Evite loops aninhados quando possível",
        usarMapFilter: "Use map/filter ao invés de loops",
        cachearResultados: "Cache resultados de cálculos pesados",
        lazyLoading: "Carregue recursos sob demanda",
        debounceThrottle: "Use debounce/throttle para eventos frequentes"
    },
    seguranca: {
        validarInput: "Sempre valide entrada do usuário",
        sanitizar: "Sanitize dados antes de exibir",
        evitarEval: "Nunca use eval()",
        https: "Use HTTPS em produção",
        tokens: "Nunca exponha tokens/chaves no código"
    }
};

console.log("\nBoas Práticas documentadas");

// ============================================
// RECURSOS ÚTEIS
// ============================================
const recursos = {
    documentacao: [
        "MDN Web Docs: https://developer.mozilla.org",
        "JavaScript.info: https://javascript.info",
        "ECMAScript Spec: https://tc39.es/ecma262/"
    ],
    ferramentas: [
        "Node.js: https://nodejs.org",
        "npm: https://www.npmjs.com",
        "Babel: https://babeljs.io",
        "ESLint: https://eslint.org",
        "Prettier: https://prettier.io"
    ],
    frameworks: [
        "React: https://reactjs.org",
        "Vue: https://vuejs.org",
        "Angular: https://angular.io",
        "Svelte: https://svelte.dev"
    ],
    bibliotecas: [
        "Lodash: https://lodash.com",
        "Axios: https://axios-http.com",
        "Moment.js: https://momentjs.com",
        "Chart.js: https://chartjs.org"
    ]
};

console.log("\nRecursos úteis documentados");

console.log("\n=== FIM JS REFERENCE ===");
console.log("\nUse este arquivo como referência rápida durante o desenvolvimento!");
