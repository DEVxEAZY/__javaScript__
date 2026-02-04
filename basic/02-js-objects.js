/**
 * JS OBJECTS - Objetos Avançados
 * Este arquivo demonstra conceitos avançados de objetos em JavaScript
 */

console.log("=== JS OBJECTS - Objetos Avançados ===\n");

// ============================================
// 1. Object Creation Patterns
// ============================================
console.log("1. OBJECT CREATION PATTERNS");

// Object Literal
const obj1 = {
    nome: "Objeto 1",
    metodo: function() {
        return this.nome;
    }
};

// Object Constructor
const obj2 = new Object();
obj2.nome = "Objeto 2";

// Object.create() - Herança prototípica
const prototipo = {
    saudar: function() {
        return `Olá, eu sou ${this.nome}`;
    }
};

const obj3 = Object.create(prototipo);
obj3.nome = "Objeto 3";
console.log("Object.create:", obj3.saudar());

// Factory Function
function criarPessoa(nome, idade) {
    return {
        nome,
        idade,
        apresentar() {
            return `Sou ${this.nome}, tenho ${this.idade} anos`;
        }
    };
}

const pessoa1 = criarPessoa("Ana", 25);
console.log("Factory:", pessoa1.apresentar());

// Constructor Function
function Pessoa(nome, idade) {
    this.nome = nome;
    this.idade = idade;
    this.apresentar = function() {
        return `Sou ${this.nome}, tenho ${this.idade} anos`;
    };
}

const pessoa2 = new Pessoa("Carlos", 30);
console.log("Constructor:", pessoa2.apresentar());

// ============================================
// 2. Property Descriptors
// ============================================
console.log("\n2. PROPERTY DESCRIPTORS");

const obj = {};

// Definir propriedade com descriptor
Object.defineProperty(obj, 'propriedade', {
    value: 42,
    writable: false,      // não pode ser alterada
    enumerable: true,      // aparece em for...in
    configurable: false   // não pode ser deletada ou reconfigurada
});

console.log("Propriedade:", obj.propriedade);
// obj.propriedade = 100; // Erro em strict mode

// Getter e Setter
const pessoa = {
    _nome: "",
    
    get nome() {
        return this._nome.toUpperCase();
    },
    
    set nome(valor) {
        if (typeof valor === 'string') {
            this._nome = valor;
        } else {
            throw new Error("Nome deve ser uma string");
        }
    }
};

pessoa.nome = "maria";
console.log("Getter:", pessoa.nome); // MARIA

// Object.defineProperty com getter/setter
const conta = {
    _saldo: 0
};

Object.defineProperty(conta, 'saldo', {
    get: function() {
        return this._saldo;
    },
    set: function(valor) {
        if (valor >= 0) {
            this._saldo = valor;
        } else {
            throw new Error("Saldo não pode ser negativo");
        }
    },
    enumerable: true,
    configurable: false
});

conta.saldo = 100;
console.log("Saldo:", conta.saldo);

// ============================================
// 3. Object Methods
// ============================================
console.log("\n3. OBJECT METHODS");

const objA = { a: 1, b: 2 };
const objB = { c: 3, d: 4 };

// Object.assign() - Copiar propriedades
const objC = Object.assign({}, objA, objB);
console.log("Object.assign:", objC);

// Object.keys() - Chaves enumeráveis
console.log("Object.keys:", Object.keys(objC));

// Object.values() - Valores
console.log("Object.values:", Object.values(objC));

// Object.entries() - Pares chave-valor
console.log("Object.entries:", Object.entries(objC));

// Object.freeze() - Congelar objeto
const objCongelado = Object.freeze({ x: 1, y: 2 });
// objCongelado.x = 10; // Não funciona em strict mode
console.log("Object.freeze:", objCongelado);

// Object.seal() - Selar objeto (pode modificar, mas não adicionar/deletar)
const objSelado = Object.seal({ a: 1 });
objSelado.a = 2; // OK
// objSelado.b = 3; // Não funciona
console.log("Object.seal:", objSelado);

// Object.preventExtensions() - Prevenir extensões
const objLimitado = Object.preventExtensions({ x: 1 });
// objLimitado.y = 2; // Não funciona
console.log("Object.preventExtensions:", objLimitado);

// ============================================
// 4. Prototype Chain
// ============================================
console.log("\n4. PROTOTYPE CHAIN");

function Animal(nome) {
    this.nome = nome;
}

Animal.prototype.fazerSom = function() {
    return `${this.nome} faz um som`;
};

function Cachorro(nome, raca) {
    Animal.call(this, nome);
    this.raca = raca;
}

// Herança prototípica
Cachorro.prototype = Object.create(Animal.prototype);
Cachorro.prototype.constructor = Cachorro;

Cachorro.prototype.fazerSom = function() {
    return `${this.nome} late: Au au!`;
};

const rex = new Cachorro("Rex", "Labrador");
console.log("Prototype:", rex.fazerSom());
console.log("É Animal?", rex instanceof Animal);
console.log("É Cachorro?", rex instanceof Cachorro);

// ============================================
// 5. Object Destructuring
// ============================================
console.log("\n5. OBJECT DESTRUCTURING");

const usuario = {
    nome: "João",
    email: "joao@example.com",
    idade: 30,
    endereco: {
        rua: "Rua A",
        cidade: "São Paulo"
    }
};

// Destructuring básico
const { nome, email } = usuario;
console.log("Destructuring:", nome, email);

// Destructuring com renomeação
const { nome: nomeUsuario, idade: anos } = usuario;
console.log("Renomeação:", nomeUsuario, anos);

// Destructuring aninhado
const { endereco: { cidade } } = usuario;
console.log("Aninhado:", cidade);

// Destructuring com valores padrão
const { telefone = "Não informado" } = usuario;
console.log("Valor padrão:", telefone);

// Destructuring em parâmetros de função
function exibirUsuario({ nome, email, idade = 0 }) {
    console.log(`Usuário: ${nome}, ${email}, ${idade} anos`);
}
exibirUsuario(usuario);

// ============================================
// 6. Spread Operator com Objetos
// ============================================
console.log("\n6. SPREAD OPERATOR");

const obj11 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const obj3 = { ...obj1, ...obj2, e: 5 };
console.log("Spread:", obj3);

// Clonar objeto
const clone = { ...usuario };
console.log("Clone:", clone);

// Atualizar propriedades
const usuarioAtualizado = { ...usuario, idade: 31 };
console.log("Atualizado:", usuarioAtualizado);

// ============================================
// 7. Object Composition
// ============================================
console.log("\n7. OBJECT COMPOSITION");

// Mixins
const voar = {
    voar() {
        return `${this.nome} está voando`;
    }
};

const nadar = {
    nadar() {
        return `${this.nome} está nadando`;
    }
};

function Pato(nome) {
    this.nome = nome;
}

// Aplicar mixins
Object.assign(Pato.prototype, voar, nadar);

const pato = new Pato("Donald");
console.log("Composition:", pato.voar());
console.log("Composition:", pato.nadar());

// ============================================
// 8. Symbols como Chaves
// ============================================
console.log("\n8. SYMBOLS");

const id = Symbol('id');
const obj = {
    [id]: 123,
    nome: "Objeto"
};

console.log("Symbol key:", obj[id]);
console.log("Object.keys não mostra Symbol:", Object.keys(obj));

// Symbol.for() - Symbol global
const sym1 = Symbol.for('chave');
const sym2 = Symbol.for('chave');
console.log("Symbol.for igual?", sym1 === sym2); // true

// ============================================
// 9. WeakMap e WeakSet
// ============================================
console.log("\n9. WEAKMAP E WEAKSET");

// WeakMap - chaves devem ser objetos
const weakMap = new WeakMap();
const objKey = {};

weakMap.set(objKey, "valor secreto");
console.log("WeakMap get:", weakMap.get(objKey));

// WeakSet - apenas objetos
const weakSet = new WeakSet();
weakSet.add(objKey);
console.log("WeakSet has:", weakSet.has(objKey));

// ============================================
// 10. Object.defineProperties
// ============================================
console.log("\n10. OBJECT.DEFINEPROPERTIES");

const config = {};

Object.defineProperties(config, {
    host: {
        value: 'localhost',
        writable: false,
        enumerable: true
    },
    port: {
        value: 3000,
        writable: true,
        enumerable: true
    },
    debug: {
        get() {
            return this._debug || false;
        },
        set(valor) {
            this._debug = Boolean(valor);
        },
        enumerable: true
    }
});

console.log("Config:", config);
config.debug = true;
console.log("Debug:", config.debug);

// ============================================
// 11. Object.fromEntries
// ============================================
console.log("\n11. OBJECT.FROMENTRIES");

const entries = [
    ['nome', 'Maria'],
    ['idade', 28],
    ['cidade', 'Rio de Janeiro']
];

const objFromEntries = Object.fromEntries(entries);
console.log("fromEntries:", objFromEntries);

// Converter Map para Object
const map = new Map([
    ['a', 1],
    ['b', 2]
]);
const objFromMap = Object.fromEntries(map);
console.log("fromEntries Map:", objFromMap);

console.log("\n=== FIM JS OBJECTS ===");
