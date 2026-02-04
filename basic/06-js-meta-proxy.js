/**
 * JS META & PROXY - Metaprogramação
 * Este arquivo demonstra Proxy, Reflect, Symbol e metaprogramação
 */

console.log("=== JS META & PROXY - Metaprogramação ===\n");

// ============================================
// 1. Proxy - Interceptação de Operações
// ============================================
console.log("1. PROXY");

const alvo = {
    nome: "Objeto Original",
    valor: 42
};

const handler = {
    // Interceptar leitura de propriedades
    get(target, prop, receiver) {
        console.log(`Lendo propriedade: ${prop}`);
        return target[prop];
    },
    
    // Interceptar escrita de propriedades
    set(target, prop, value, receiver) {
        console.log(`Escrevendo ${prop} = ${value}`);
        target[prop] = value;
        return true; // Indica sucesso
    },
    
    // Interceptar verificação de propriedade
    has(target, prop) {
        console.log(`Verificando se tem: ${prop}`);
        return prop in target;
    },
    
    // Interceptar deleção
    deleteProperty(target, prop) {
        console.log(`Deletando: ${prop}`);
        delete target[prop];
        return true;
    }
};

const proxy = new Proxy(alvo, handler);

console.log("Proxy get:", proxy.nome);
proxy.valor = 100;
console.log("Propriedade 'nome' existe?", 'nome' in proxy);
delete proxy.valor;

// ============================================
// 2. Proxy - Validação
// ============================================
console.log("\n2. PROXY COM VALIDAÇÃO");

const usuarioProxy = new Proxy({}, {
    set(target, prop, value) {
        if (prop === 'idade' && (typeof value !== 'number' || value < 0)) {
            throw new Error("Idade deve ser um número positivo");
        }
        if (prop === 'email' && !value.includes('@')) {
            throw new Error("Email inválido");
        }
        target[prop] = value;
        return true;
    }
});

try {
    usuarioProxy.nome = "João";
    usuarioProxy.idade = 25;
    // usuarioProxy.idade = -5; // Erro!
    usuarioProxy.email = "joao@example.com";
    console.log("Validação:", usuarioProxy);
} catch (erro) {
    console.error("Erro de validação:", erro.message);
}

// ============================================
// 3. Proxy - Propriedades Computadas
// ============================================
console.log("\n3. PROXY COM PROPRIEDADES COMPUTADAS");

const cache = new Proxy({}, {
    get(target, prop) {
        if (prop.startsWith('calc_')) {
            const numero = parseInt(prop.split('_')[1]);
            if (!target[prop]) {
                // Calcular e cachear
                target[prop] = numero * 2;
            }
            return target[prop];
        }
        return target[prop];
    }
});

console.log("calc_5:", cache.calc_5);
console.log("calc_10:", cache.calc_10);
console.log("calc_5 (cacheado):", cache.calc_5);

// ============================================
// 4. Proxy - Revocable
// ============================================
console.log("\n4. PROXY REVOCABLE");

const { proxy: proxyRevocavel, revoke } = Proxy.revocable({ valor: 42 }, {
    get(target, prop) {
        return target[prop];
    }
});

console.log("Antes revoke:", proxyRevocavel.valor);
revoke(); // Revoga o proxy
try {
    console.log("Depois revoke:", proxyRevocavel.valor);
} catch (erro) {
    console.log("Erro após revoke:", erro.message);
}

// ============================================
// 5. Reflect API
// ============================================
console.log("\n5. REFLECT API");

const obj = { a: 1, b: 2 };

// Reflect.get
console.log("Reflect.get:", Reflect.get(obj, 'a'));

// Reflect.set
Reflect.set(obj, 'c', 3);
console.log("Reflect.set:", obj);

// Reflect.has
console.log("Reflect.has:", Reflect.has(obj, 'b'));

// Reflect.deleteProperty
Reflect.deleteProperty(obj, 'c');
console.log("Após delete:", obj);

// Reflect.ownKeys
console.log("Reflect.ownKeys:", Reflect.ownKeys(obj));

// Reflect.construct (criar instância)
class Pessoa {
    constructor(nome) {
        this.nome = nome;
    }
}

const pessoa = Reflect.construct(Pessoa, ["Maria"]);
console.log("Reflect.construct:", pessoa);

// Reflect.apply (chamar função)
function saudar(nome, sobrenome) {
    return `Olá, ${nome} ${sobrenome}`;
}

console.log("Reflect.apply:", Reflect.apply(saudar, null, ["João", "Silva"]));

// ============================================
// 6. Reflect com Proxy
// ============================================
console.log("\n6. REFLECT COM PROXY");

const objReflect = { valor: 10 };

const proxyReflect = new Proxy(objReflect, {
    get(target, prop, receiver) {
        console.log(`Get: ${prop}`);
        return Reflect.get(target, prop, receiver);
    },
    
    set(target, prop, value, receiver) {
        console.log(`Set: ${prop} = ${value}`);
        return Reflect.set(target, prop, value, receiver);
    }
});

proxyReflect.valor = 20;
console.log("Valor:", proxyReflect.valor);

// ============================================
// 7. Symbols
// ============================================
console.log("\n7. SYMBOLS");

// Symbol único
const sym1 = Symbol('descricao');
const sym2 = Symbol('descricao');
console.log("Symbols são únicos?", sym1 === sym2); // false

// Symbol como chave de propriedade
const objSymbol = {
    [sym1]: "valor1",
    [sym2]: "valor2"
};

console.log("Symbol key:", objSymbol[sym1]);

// Symbol.for() - Symbol global
const symGlobal1 = Symbol.for('chave');
const symGlobal2 = Symbol.for('chave');
console.log("Symbol.for são iguais?", symGlobal1 === symGlobal2); // true

// Symbol.keyFor() - obter chave de Symbol global
console.log("Symbol.keyFor:", Symbol.keyFor(symGlobal1));

// Well-known Symbols
const iteravel = {
    [Symbol.iterator]: function* () {
        yield 1;
        yield 2;
        yield 3;
    }
};

console.log("Symbol.iterator:", [...iteravel]);

// ============================================
// 8. Symbol como Metapropriedades
// ============================================
console.log("\n8. SYMBOL COMO METAPROPRIEDADES");

const METODO_PRIVADO = Symbol('privado');

class Exemplo {
    [METODO_PRIVADO]() {
        return "Método privado";
    }
    
    metodoPublico() {
        return this[METODO_PRIVADO]();
    }
}

const exemplo = new Exemplo();
console.log("Symbol método:", exemplo.metodoPublico());

// ============================================
// 9. Proxy para Observabilidade
// ============================================
console.log("\n9. PROXY PARA OBSERVABILIDADE");

function criarObservavel(objeto, callback) {
    return new Proxy(objeto, {
        set(target, prop, value) {
            const valorAntigo = target[prop];
            target[prop] = value;
            callback(prop, valorAntigo, value);
            return true;
        }
    });
}

const estado = criarObservavel({ contador: 0 }, (prop, antigo, novo) => {
    console.log(`Estado mudou: ${prop} de ${antigo} para ${novo}`);
});

estado.contador = 1;
estado.contador = 2;

// ============================================
// 10. Proxy para Funções
// ============================================
console.log("\n10. PROXY PARA FUNÇÕES");

function funcaoOriginal(a, b) {
    return a + b;
}

const funcaoProxy = new Proxy(funcaoOriginal, {
    apply(target, thisArg, args) {
        console.log(`Chamando função com argumentos:`, args);
        const resultado = Reflect.apply(target, thisArg, args);
        console.log(`Resultado:`, resultado);
        return resultado;
    }
});

console.log("Função proxy:", funcaoProxy(5, 3));

// ============================================
// 11. Proxy para Classes
// ============================================
console.log("\n11. PROXY PARA CLASSES");

class ClasseOriginal {
    constructor(nome) {
        this.nome = nome;
    }
}

const ClasseProxy = new Proxy(ClasseOriginal, {
    construct(target, args) {
        console.log(`Criando instância com:`, args);
        return Reflect.construct(target, args);
    }
});

const instancia = new ClasseProxy("Teste");
console.log("Instância:", instancia);

// ============================================
// 12. Decorators (ES2022 - preview)
// ============================================
console.log("\n12. DECORATORS (conceito)");

// Decorators são uma proposta para ES2022
// Permitem modificar classes, métodos, propriedades

// Exemplo conceitual (sintaxe pode variar):
/*
@observable
class MinhaClasse {
    @readonly
    propriedade = 42;
    
    @log
    metodo() {
        return "resultado";
    }
}
*/

// Implementação manual de decorator
function log(target, propertyKey, descriptor) {
    const metodoOriginal = descriptor.value;
    descriptor.value = function(...args) {
        console.log(`Chamando ${propertyKey} com:`, args);
        const resultado = metodoOriginal.apply(this, args);
        console.log(`Resultado:`, resultado);
        return resultado;
    };
    return descriptor;
}

class ExemploDecorator {
    @log
    calcular(a, b) {
        return a + b;
    }
}

// ============================================
// 13. Reflect Metadata (conceito)
// ============================================
console.log("\n13. REFLECT METADATA (conceito)");

// Metadata permite anexar informações a classes/métodos
// Requer biblioteca externa como reflect-metadata

console.log("\n=== FIM JS META & PROXY ===");
