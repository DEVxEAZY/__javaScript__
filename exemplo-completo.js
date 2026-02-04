/**
 * EXEMPLO COMPLETO DE JAVASCRIPT BÁSICO
 * Este arquivo demonstra todos os conceitos fundamentais de JavaScript
 */

// ============================================
// 1. JS SYNTAX - Sintaxe Básica
// ============================================
console.log("=== JS SYNTAX ===");
// Comentários de linha única
/* Comentários de múltiplas linhas */

// Declaração de código
const mensagem = "Olá, JavaScript!";
console.log(mensagem);

// ============================================
// 2. JS VARIABLES - Variáveis
// ============================================
console.log("\n=== JS VARIABLES ===");

// var (escopo de função, pode ser redeclarada)
var variavelVar = "Variável var";
console.log("var:", variavelVar);

// let (escopo de bloco, pode ser reatribuída)
let variavelLet = "Variável let";
variavelLet = "Reatribuída";
console.log("let:", variavelLet);

// const (escopo de bloco, não pode ser reatribuída)
const variavelConst = "Variável const";
console.log("const:", variavelConst);

// Desestruturação
const [a, b, c] = [1, 2, 3];
console.log("Desestruturação:", a, b, c);

// ============================================
// 3. JS OPERATORS - Operadores
// ============================================
console.log("\n=== JS OPERATORS ===");

// Aritméticos
let num1 = 10;
let num2 = 3;
console.log("Soma:", num1 + num2);
console.log("Subtração:", num1 - num2);
console.log("Multiplicação:", num1 * num2);
console.log("Divisão:", num1 / num2);
console.log("Módulo:", num1 % num2);
console.log("Exponenciação:", num1 ** num2);

// Atribuição
let x = 5;
x += 3; // x = x + 3
console.log("Atribuição +=:", x);

// Comparação
console.log("Igual (==):", 5 == "5"); // true (conversão de tipo)
console.log("Igual estrito (===):", 5 === "5"); // false
console.log("Diferente (!=):", 5 != "5");
console.log("Maior que (>):", 10 > 5);

// Lógicos
console.log("E (&&):", true && false);
console.log("OU (||):", true || false);
console.log("NÃO (!):", !true);

// Ternário
const resultado = num1 > num2 ? "maior" : "menor";
console.log("Ternário:", resultado);

// ============================================
// 4. JS IF CONDITIONS - Condições
// ============================================
console.log("\n=== JS IF CONDITIONS ===");

const idade = 20;

if (idade >= 18) {
    console.log("Maior de idade");
} else if (idade >= 13) {
    console.log("Adolescente");
} else {
    console.log("Criança");
}

// Switch
const diaSemana = 3;
switch (diaSemana) {
    case 1:
        console.log("Segunda-feira");
        break;
    case 2:
        console.log("Terça-feira");
        break;
    case 3:
        console.log("Quarta-feira");
        break;
    default:
        console.log("Outro dia");
}

// ============================================
// 5. JS LOOPS - Loops
// ============================================
console.log("\n=== JS LOOPS ===");

// For
console.log("For loop:");
for (let i = 0; i < 3; i++) {
    console.log(`Iteração ${i}`);
}

// While
console.log("While loop:");
let contador = 0;
while (contador < 3) {
    console.log(`Contador: ${contador}`);
    contador++;
}

// Do-While
console.log("Do-While loop:");
let j = 0;
do {
    console.log(`Do-While: ${j}`);
    j++;
} while (j < 3);

// For...in (objetos)
const pessoa = { nome: "João", idade: 30 };
console.log("For...in:");
for (let chave in pessoa) {
    console.log(`${chave}: ${pessoa[chave]}`);
}

// For...of (iteráveis)
const frutas = ["maçã", "banana", "laranja"];
console.log("For...of:");
for (let fruta of frutas) {
    console.log(fruta);
}

// ============================================
// 6. JS STRINGS - Strings
// ============================================
console.log("\n=== JS STRINGS ===");

const texto1 = "String com aspas duplas";
const texto2 = 'String com aspas simples';
const texto3 = `Template literal com ${texto1}`;
console.log("Template literal:", texto3);

// Métodos de String
const nome = "JavaScript";
console.log("Length:", nome.length);
console.log("UpperCase:", nome.toUpperCase());
console.log("LowerCase:", nome.toLowerCase());
console.log("Substring:", nome.substring(0, 4));
console.log("Replace:", nome.replace("Script", "Básico"));
console.log("Split:", "a,b,c".split(","));
console.log("Includes:", nome.includes("Java"));
console.log("StartsWith:", nome.startsWith("Java"));
console.log("EndsWith:", nome.endsWith("Script"));

// ============================================
// 7. JS NUMBERS - Números
// ============================================
console.log("\n=== JS NUMBERS ===");

const inteiro = 42;
const decimal = 3.14;
const exponencial = 1e5; // 100000
const hexadecimal = 0xFF; // 255

console.log("Inteiro:", inteiro);
console.log("Decimal:", decimal);
console.log("Exponencial:", exponencial);
console.log("Hexadecimal:", hexadecimal);

// Métodos Number
console.log("parseInt:", parseInt("42.7")); // 42
console.log("parseFloat:", parseFloat("3.14")); // 3.14
console.log("toFixed:", decimal.toFixed(2)); // "3.14"
console.log("isNaN:", isNaN("texto")); // true
console.log("isFinite:", isFinite(Infinity)); // false

// ============================================
// 8. JS FUNCTIONS - Funções
// ============================================
console.log("\n=== JS FUNCTIONS ===");

// Declaração de função
function somar(a, b) {
    return a + b;
}
console.log("Função declarada:", somar(5, 3));

// Expressão de função
const multiplicar = function(a, b) {
    return a * b;
};
console.log("Função expressa:", multiplicar(4, 2));

// Arrow function
const dividir = (a, b) => a / b;
console.log("Arrow function:", dividir(10, 2));

// Arrow function com múltiplas linhas
const calcular = (a, b, operacao) => {
    if (operacao === "soma") return a + b;
    if (operacao === "subtracao") return a - b;
    return a * b;
};
console.log("Arrow function complexa:", calcular(10, 5, "soma"));

// Função com parâmetros padrão
function saudacao(nome = "Visitante") {
    return `Olá, ${nome}!`;
}
console.log("Parâmetro padrão:", saudacao());
console.log("Parâmetro padrão:", saudacao("Maria"));

// Função com rest parameters
function somarTodos(...numeros) {
    return numeros.reduce((acc, num) => acc + num, 0);
}
console.log("Rest parameters:", somarTodos(1, 2, 3, 4, 5));

// Função de alta ordem
function aplicarOperacao(a, b, operacao) {
    return operacao(a, b);
}
console.log("Função de alta ordem:", aplicarOperacao(10, 5, (x, y) => x * y));

// ============================================
// 9. JS OBJECTS - Objetos
// ============================================
console.log("\n=== JS OBJECTS ===");

// Objeto literal
const carro = {
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2023,
    ligar: function() {
        return `${this.marca} ${this.modelo} ligado!`;
    },
    // Método abreviado (ES6)
    desligar() {
        return `${this.marca} ${this.modelo} desligado!`;
    }
};

console.log("Objeto:", carro);
console.log("Propriedade:", carro.marca);
console.log("Propriedade [bracket]:", carro["modelo"]);
console.log("Método:", carro.ligar());

// Adicionar propriedade
carro.cor = "Azul";
console.log("Nova propriedade:", carro.cor);

// Desestruturação de objeto
const { marca, modelo } = carro;
console.log("Desestruturação:", marca, modelo);

// Spread operator
const carro2 = { ...carro, modelo: "Camry", ano: 2024 };
console.log("Spread operator:", carro2);

// ============================================
// 10. JS SCOPE - Escopo
// ============================================
console.log("\n=== JS SCOPE ===");

// Escopo global
var globalVar = "Variável global";

function exemploEscopo() {
    // Escopo de função
    var funcaoVar = "Variável de função";
    let blocoLet = "Variável de bloco (let)";
    
    if (true) {
        // Escopo de bloco
        let blocoVar = "Dentro do bloco";
        const blocoConst = "Constante de bloco";
        console.log("Dentro do bloco:", blocoVar, blocoConst);
    }
    
    // console.log(blocoVar); // Erro! blocoVar não está acessível aqui
    
    return {
        funcaoVar,
        blocoLet,
        globalVar
    };
}

const escopo = exemploEscopo();
console.log("Escopo:", escopo);

// ============================================
// 11. JS DATES - Datas
// ============================================
console.log("\n=== JS DATES ===");

const agora = new Date();
console.log("Data atual:", agora);

const dataEspecifica = new Date(2024, 0, 15); // Ano, Mês (0-11), Dia
console.log("Data específica:", dataEspecifica);

// Métodos de Date
console.log("getFullYear:", agora.getFullYear());
console.log("getMonth:", agora.getMonth()); // 0-11
console.log("getDate:", agora.getDate());
console.log("getDay:", agora.getDay()); // 0-6 (Domingo-Sábado)
console.log("getHours:", agora.getHours());
console.log("toLocaleString:", agora.toLocaleString("pt-BR"));
console.log("toISOString:", agora.toISOString());

// ============================================
// 12. JS ARRAYS - Arrays
// ============================================
console.log("\n=== JS ARRAYS ===");

// Criar array
const numeros = [1, 2, 3, 4, 5];
const frutas2 = new Array("maçã", "banana", "laranja");

console.log("Array:", numeros);
console.log("Length:", numeros.length);

// Métodos de Array
console.log("Push:", numeros.push(6)); // Adiciona no final
console.log("Pop:", numeros.pop()); // Remove do final
console.log("Shift:", numeros.shift()); // Remove do início
console.log("Unshift:", numeros.unshift(0)); // Adiciona no início

// Métodos de iteração
const dobrados = numeros.map(num => num * 2);
console.log("Map:", dobrados);

const pares = numeros.filter(num => num % 2 === 0);
console.log("Filter:", pares);

const soma = numeros.reduce((acc, num) => acc + num, 0);
console.log("Reduce:", soma);

const encontrado = numeros.find(num => num > 3);
console.log("Find:", encontrado);

const temMaior = numeros.some(num => num > 10);
console.log("Some:", temMaior);

const todosPares = numeros.every(num => num % 2 === 0);
console.log("Every:", todosPares);

// Spread em arrays
const novoArray = [...numeros, 7, 8, 9];
console.log("Spread array:", novoArray);

// ============================================
// 13. JS SETS - Sets
// ============================================
console.log("\n=== JS SETS ===");

const meuSet = new Set();
meuSet.add(1);
meuSet.add(2);
meuSet.add(3);
meuSet.add(2); // Duplicado ignorado

console.log("Set:", meuSet);
console.log("Size:", meuSet.size);
console.log("Has 2:", meuSet.has(2));
console.log("Delete:", meuSet.delete(2));
console.log("Set após delete:", meuSet);

// Converter array para Set (remover duplicatas)
const arrayComDuplicatas = [1, 2, 2, 3, 3, 4];
const setSemDuplicatas = new Set(arrayComDuplicatas);
console.log("Array sem duplicatas:", Array.from(setSemDuplicatas));

// ============================================
// 14. JS MAPS - Maps
// ============================================
console.log("\n=== JS MAPS ===");

const meuMap = new Map();
meuMap.set("nome", "João");
meuMap.set("idade", 30);
meuMap.set(1, "um");
meuMap.set(true, "verdadeiro");

console.log("Map:", meuMap);
console.log("Get nome:", meuMap.get("nome"));
console.log("Has idade:", meuMap.has("idade"));
console.log("Size:", meuMap.size);

// Iterar sobre Map
console.log("Iteração Map:");
for (let [chave, valor] of meuMap) {
    console.log(`${chave}: ${valor}`);
}

// Converter objeto para Map
const obj = { a: 1, b: 2, c: 3 };
const mapDoObj = new Map(Object.entries(obj));
console.log("Map do objeto:", mapDoObj);

// ============================================
// 15. JS ITERATIONS - Iterações
// ============================================
console.log("\n=== JS ITERATIONS ===");

const iteravel = [10, 20, 30];

// forEach
console.log("forEach:");
iteravel.forEach((valor, indice) => {
    console.log(`Índice ${indice}: ${valor}`);
});

// map
const quadrados = iteravel.map(x => x * x);
console.log("Map:", quadrados);

// filter
const maiores = iteravel.filter(x => x > 15);
console.log("Filter:", maiores);

// reduce
const produto = iteravel.reduce((acc, x) => acc * x, 1);
console.log("Reduce:", produto);

// for...of com break
console.log("for...of com break:");
for (let valor of iteravel) {
    if (valor > 20) break;
    console.log(valor);
}

// ============================================
// 16. JS MATH - Matemática
// ============================================
console.log("\n=== JS MATH ===");

console.log("PI:", Math.PI);
console.log("E:", Math.E);
console.log("Abs:", Math.abs(-5));
console.log("Ceil:", Math.ceil(4.3)); // 5
console.log("Floor:", Math.floor(4.7)); // 4
console.log("Round:", Math.round(4.5)); // 5
console.log("Max:", Math.max(1, 5, 3, 9, 2));
console.log("Min:", Math.min(1, 5, 3, 9, 2));
console.log("Pow:", Math.pow(2, 3)); // 8
console.log("Sqrt:", Math.sqrt(16)); // 4
console.log("Random:", Math.random());
console.log("Random 1-10:", Math.floor(Math.random() * 10) + 1);
console.log("Sin:", Math.sin(Math.PI / 2));
console.log("Cos:", Math.cos(0));
console.log("Log:", Math.log(Math.E));

// ============================================
// 17. JS REGEXP - Expressões Regulares
// ============================================
console.log("\n=== JS REGEXP ===");

// Criar regex
const regex1 = /javascript/i; // case insensitive
const regex2 = new RegExp("\\d+", "g"); // global, números

const texto = "JavaScript é uma linguagem de programação. JavaScript é popular.";

// test
console.log("Test:", regex1.test(texto));

// match
console.log("Match:", texto.match(/javascript/gi));

// replace
const novoTexto = texto.replace(/javascript/gi, "JS");
console.log("Replace:", novoTexto);

// search
console.log("Search:", texto.search(/programação/));

// split
const palavras = texto.split(/\s+/);
console.log("Split:", palavras);

// Padrões comuns
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log("Email válido:", emailRegex.test("user@example.com"));
console.log("Email inválido:", emailRegex.test("email-invalido"));

// ============================================
// 18. JS DATA TYPES - Tipos de Dados
// ============================================
console.log("\n=== JS DATA TYPES ===");

// Tipos primitivos
const tipoString = "texto";
const tipoNumber = 42;
const tipoBoolean = true;
const tipoUndefined = undefined;
const tipoNull = null;
const tipoSymbol = Symbol("descricao");
const tipoBigInt = 9007199254740991n;

console.log("String:", typeof tipoString);
console.log("Number:", typeof tipoNumber);
console.log("Boolean:", typeof tipoBoolean);
console.log("Undefined:", typeof tipoUndefined);
console.log("Null:", typeof tipoNull); // Retorna "object" (bug histórico)
console.log("Symbol:", typeof tipoSymbol);
console.log("BigInt:", typeof tipoBigInt);

// Tipo objeto
const tipoArray = [1, 2, 3];
const tipoObjeto = { a: 1 };
const tipoFunction = function() {};

console.log("Array:", typeof tipoArray); // "object"
console.log("Array isArray:", Array.isArray(tipoArray)); // true
console.log("Object:", typeof tipoObjeto);
console.log("Function:", typeof tipoFunction);

// Conversão de tipos
console.log("String para Number:", Number("42"));
console.log("Number para String:", String(42));
console.log("Boolean:", Boolean(1)); // true
console.log("Boolean:", Boolean(0)); // false

// ============================================
// 19. JS ERRORS - Erros
// ============================================
console.log("\n=== JS ERRORS ===");

// Try-Catch
try {
    const resultado = 10 / 0;
    if (!isFinite(resultado)) {
        throw new Error("Divisão por zero!");
    }
    console.log("Resultado:", resultado);
} catch (erro) {
    console.log("Erro capturado:", erro.message);
} finally {
    console.log("Bloco finally sempre executa");
}

// Tipos de erros
try {
    // ReferenceError
    // console.log(variavelInexistente);
    
    // TypeError
    const obj = null;
    // obj.propriedade;
    
    // SyntaxError (comentado para não quebrar o código)
    // const x = ;
    
    throw new Error("Erro customizado");
} catch (erro) {
    if (erro instanceof ReferenceError) {
        console.log("ReferenceError:", erro.message);
    } else if (erro instanceof TypeError) {
        console.log("TypeError:", erro.message);
    } else {
        console.log("Erro genérico:", erro.message);
    }
}

// Criar erro customizado
class ErroCustomizado extends Error {
    constructor(mensagem, codigo) {
        super(mensagem);
        this.name = "ErroCustomizado";
        this.codigo = codigo;
    }
}

try {
    throw new ErroCustomizado("Algo deu errado", 500);
} catch (erro) {
    console.log("Erro customizado:", erro.name, erro.message, erro.codigo);
}

// ============================================
// 20. JS CONVENTIONS - Convenções
// ============================================
console.log("\n=== JS CONVENTIONS ===");

// Nomenclatura
const camelCase = "variável em camelCase";
const PascalCase = "Classe ou Construtor";
const UPPER_SNAKE_CASE = "Constante";
const snake_case = "menos comum em JS";

// Convenções de código
const exemploConvencoes = {
    // Use const por padrão, let quando necessário
    valorConstante: 42,
    
    // Use arrow functions quando possível
    metodo: () => "resultado",
    
    // Use template literals para strings
    mensagem: `Olá, ${camelCase}!`,
    
    // Use === ao invés de ==
    comparacao: 5 === 5, // true
    
    // Use nomes descritivos
    calcularTotal: (preco, quantidade) => preco * quantidade
};

console.log("Convenções:", exemploConvencoes);

// ============================================
// 21. JS REFERENCES - Referências
// ============================================
console.log("\n=== JS REFERENCES ===");

// Tipos primitivos são passados por valor
let primitivo1 = 10;
let primitivo2 = primitivo1;
primitivo2 = 20;
console.log("Primitivo 1:", primitivo1); // 10 (não mudou)
console.log("Primitivo 2:", primitivo2); // 20

// Objetos são passados por referência
let objeto1 = { valor: 10 };
let objeto2 = objeto1;
objeto2.valor = 20;
console.log("Objeto 1:", objeto1.valor); // 20 (mudou!)
console.log("Objeto 2:", objeto2.valor); // 20

// Arrays também são por referência
let array1 = [1, 2, 3];
let array2 = array1;
array2.push(4);
console.log("Array 1:", array1); // [1, 2, 3, 4] (mudou!)
console.log("Array 2:", array2); // [1, 2, 3, 4]

// Criar cópia (shallow copy)
let array3 = [1, 2, 3];
let array4 = [...array3]; // Spread operator
array4.push(4);
console.log("Array 3:", array3); // [1, 2, 3] (não mudou)
console.log("Array 4:", array4); // [1, 2, 3, 4]

// Object.assign para cópia de objeto
let obj1 = { a: 1, b: 2 };
let obj2 = Object.assign({}, obj1);
obj2.c = 3;
console.log("Obj 1:", obj1); // { a: 1, b: 2 }
console.log("Obj 2:", obj2); // { a: 1, b: 2, c: 3 }

// ============================================
// EXEMPLO PRÁTICO FINAL - Sistema de Gerenciamento
// ============================================
console.log("\n=== EXEMPLO PRÁTICO FINAL ===");

// Classe usando todos os conceitos
class GerenciadorTarefas {
    constructor(nome) {
        this.nome = nome;
        this.tarefas = new Map();
        this.dataCriacao = new Date();
        this.contador = 0;
    }
    
    adicionarTarefa(descricao, prioridade = "média") {
        const id = ++this.contador;
        const tarefa = {
            id,
            descricao,
            prioridade,
            concluida: false,
            dataCriacao: new Date()
        };
        this.tarefas.set(id, tarefa);
        return id;
    }
    
    concluirTarefa(id) {
        const tarefa = this.tarefas.get(id);
        if (tarefa) {
            tarefa.concluida = true;
            return true;
        }
        return false;
    }
    
    listarTarefas(filtro = "todas") {
        const todas = Array.from(this.tarefas.values());
        
        switch(filtro) {
            case "pendentes":
                return todas.filter(t => !t.concluida);
            case "concluidas":
                return todas.filter(t => t.concluida);
            default:
                return todas;
        }
    }
    
    estatisticas() {
        const todas = Array.from(this.tarefas.values());
        const concluidas = todas.filter(t => t.concluida).length;
        const pendentes = todas.length - concluidas;
        
        return {
            total: todas.length,
            concluidas,
            pendentes,
            percentual: todas.length > 0 
                ? Math.round((concluidas / todas.length) * 100) 
                : 0
        };
    }
}

// Uso do sistema
const gerenciador = new GerenciadorTarefas("Meu Gerenciador");

gerenciador.adicionarTarefa("Aprender JavaScript", "alta");
gerenciador.adicionarTarefa("Praticar exercícios", "média");
gerenciador.adicionarTarefa("Revisar conceitos", "baixa");

console.log("Tarefas:", gerenciador.listarTarefas());
console.log("Estatísticas:", gerenciador.estatisticas());

gerenciador.concluirTarefa(1);
console.log("Após concluir tarefa 1:");
console.log("Estatísticas:", gerenciador.estatisticas());

console.log("\n=== FIM DO EXEMPLO COMPLETO ===");
