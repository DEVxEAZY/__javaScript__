/**
 * JS JSON - JavaScript Object Notation
 * Este arquivo demonstra métodos JSON e manipulação de dados JSON
 */

console.log("=== JS JSON - JavaScript Object Notation ===\n");

// ============================================
// 1. JSON.stringify() - Serialização
// ============================================
console.log("1. JSON.STRINGIFY()");

const objeto = {
    nome: "João",
    idade: 30,
    cidade: "São Paulo",
    ativo: true,
    hobbies: ["leitura", "música"],
    endereco: {
        rua: "Rua A",
        numero: 123
    }
};

const jsonString = JSON.stringify(objeto);
console.log("JSON string:", jsonString);

// ============================================
// 2. JSON.parse() - Deserialização
// ============================================
console.log("\n2. JSON.PARSE()");

const jsonString2 = '{"nome":"Maria","idade":25}';
const objeto2 = JSON.parse(jsonString2);
console.log("Objeto parseado:", objeto2);
console.log("Nome:", objeto2.nome);

// ============================================
// 3. JSON.stringify() - Replacer
// ============================================
console.log("\n3. JSON.STRINGIFY() COM REPLACER");

const dados = {
    nome: "Pedro",
    senha: "secret123",
    email: "pedro@example.com",
    idade: 28
};

// Filtrar propriedades
const jsonFiltrado = JSON.stringify(dados, ['nome', 'email', 'idade']);
console.log("JSON filtrado:", jsonFiltrado);

// Replacer como função
const jsonReplacer = JSON.stringify(dados, (key, value) => {
    if (key === 'senha') {
        return undefined; // Remover senha
    }
    return value;
});
console.log("JSON sem senha:", jsonReplacer);

// ============================================
// 4. JSON.stringify() - Space (Formatação)
// ============================================
console.log("\n4. JSON.STRINGIFY() COM SPACE");

const jsonFormatado = JSON.stringify(objeto, null, 2);
console.log("JSON formatado:");
console.log(jsonFormatado);

// Com tab
const jsonComTab = JSON.stringify(objeto, null, '\t');
console.log("JSON com tab configurado");

// ============================================
// 5. JSON.parse() - Reviver
// ============================================
console.log("\n5. JSON.PARSE() COM REVIVER");

const jsonComData = '{"nome":"Ana","dataNascimento":"1990-01-15"}';

const objetoComData = JSON.parse(jsonComData, (key, value) => {
    if (key === 'dataNascimento') {
        return new Date(value);
    }
    return value;
});

console.log("Objeto com Date:", objetoComData);
console.log("Tipo da data:", objetoComData.dataNascimento instanceof Date);

// ============================================
// 6. Validação de JSON
// ============================================
console.log("\n6. VALIDAÇÃO DE JSON");

function validarJSON(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

console.log("JSON válido:", validarJSON('{"nome":"João"}'));
console.log("JSON inválido:", validarJSON('{nome:"João"}'));

// ============================================
// 7. Deep Clone com JSON
// ============================================
console.log("\n7. DEEP CLONE COM JSON");

const original = {
    a: 1,
    b: {
        c: 2,
        d: [3, 4]
    }
};

const clone = JSON.parse(JSON.stringify(original));
clone.b.c = 999;

console.log("Original:", original.b.c);
console.log("Clone:", clone.b.c);

// Limitação: não funciona com funções, undefined, Symbol, Date (vira string)

// ============================================
// 8. JSON com Arrays
// ============================================
console.log("\n8. JSON COM ARRAYS");

const array = [
    { id: 1, nome: "Item 1" },
    { id: 2, nome: "Item 2" },
    { id: 3, nome: "Item 3" }
];

const jsonArray = JSON.stringify(array);
console.log("JSON array:", jsonArray);

const arrayParseado = JSON.parse(jsonArray);
console.log("Array parseado:", arrayParseado);

// ============================================
// 9. JSON com Datas
// ============================================
console.log("\n9. JSON COM DATAS");

const objetoComData2 = {
    nome: "Carlos",
    dataCriacao: new Date()
};

const jsonComData2 = JSON.stringify(objetoComData2);
console.log("JSON com Date (vira string):", jsonComData2);

// Solução: converter manualmente
const objetoComData3 = {
    nome: "Carlos",
    dataCriacao: new Date().toISOString()
};

const jsonComData3 = JSON.stringify(objetoComData3);
const objetoRecuperado = JSON.parse(jsonComData3, (key, value) => {
    if (key === 'dataCriacao') {
        return new Date(value);
    }
    return value;
});

console.log("Data recuperada:", objetoRecuperado.dataCriacao instanceof Date);

// ============================================
// 10. JSON com Funções (limitação)
// ============================================
console.log("\n10. JSON COM FUNÇÕES (limitação)");

const objetoComFuncao = {
    nome: "Teste",
    calcular: function(x) {
        return x * 2;
    }
};

const jsonComFuncao = JSON.stringify(objetoComFuncao);
console.log("JSON (função removida):", jsonComFuncao);

// Funções não são serializadas!

// ============================================
// 11. JSON Schema Validation (conceito)
// ============================================
console.log("\n11. JSON SCHEMA VALIDATION");

function validarSchema(objeto, schema) {
    for (let key in schema) {
        if (schema[key].required && !(key in objeto)) {
            return { valido: false, erro: `Campo ${key} é obrigatório` };
        }
        if (key in objeto) {
            const tipoEsperado = schema[key].type;
            const tipoReal = typeof objeto[key];
            if (tipoReal !== tipoEsperado) {
                return { valido: false, erro: `Campo ${key} deve ser ${tipoEsperado}` };
            }
        }
    }
    return { valido: true };
}

const schema = {
    nome: { type: 'string', required: true },
    idade: { type: 'number', required: true },
    email: { type: 'string', required: false }
};

const dadosValidar = { nome: "João", idade: 30 };
const validacao = validarSchema(dadosValidar, schema);
console.log("Validação:", validacao);

// ============================================
// 12. JSON Path (conceito)
// ============================================
console.log("\n12. JSON PATH");

function getJSONPath(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : null;
    }, obj);
}

const objetoComplexo = {
    usuario: {
        nome: "João",
        endereco: {
            cidade: "São Paulo",
            pais: "Brasil"
        }
    }
};

console.log("Path 'usuario.nome':", getJSONPath(objetoComplexo, 'usuario.nome'));
console.log("Path 'usuario.endereco.cidade':", getJSONPath(objetoComplexo, 'usuario.endereco.cidade'));

// ============================================
// 13. JSON Diff (comparação)
// ============================================
console.log("\n13. JSON DIFF");

function jsonDiff(obj1, obj2) {
    const diff = {};
    
    // Verificar propriedades de obj1
    for (let key in obj1) {
        if (!(key in obj2)) {
            diff[key] = { tipo: 'removido', valor: obj1[key] };
        } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
            diff[key] = {
                tipo: 'modificado',
                antigo: obj1[key],
                novo: obj2[key]
            };
        }
    }
    
    // Verificar propriedades novas em obj2
    for (let key in obj2) {
        if (!(key in obj1)) {
            diff[key] = { tipo: 'adicionado', valor: obj2[key] };
        }
    }
    
    return diff;
}

const obj1 = { a: 1, b: 2, c: 3 };
const obj2 = { a: 1, b: 20, d: 4 };

console.log("Diff:", jsonDiff(obj1, obj2));

// ============================================
// 14. JSON Minify
// ============================================
console.log("\n14. JSON MINIFY");

function minifyJSON(jsonString) {
    try {
        const obj = JSON.parse(jsonString);
        return JSON.stringify(obj);
    } catch (e) {
        return jsonString;
    }
}

const jsonFormatado2 = JSON.stringify(objeto, null, 4);
const jsonMinificado = minifyJSON(jsonFormatado2);
console.log("Minificado:", jsonMinificado);

// ============================================
// 15. JSON Helper Class
// ============================================
console.log("\n15. JSON HELPER CLASS");

class JSONHelper {
    static stringify(obj, options = {}) {
        const {
            space = null,
            replacer = null,
            exclude = []
        } = options;
        
        const customReplacer = replacer || ((key, value) => {
            if (exclude.includes(key)) {
                return undefined;
            }
            return value;
        });
        
        return JSON.stringify(obj, customReplacer, space);
    }
    
    static parse(str, options = {}) {
        const { reviver = null } = options;
        return JSON.parse(str, reviver);
    }
    
    static clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    
    static merge(...objetos) {
        return objetos.reduce((acc, obj) => {
            return { ...acc, ...obj };
        }, {});
    }
    
    static flatten(obj, prefix = '') {
        const resultado = {};
        
        for (let key in obj) {
            const novaChave = prefix ? `${prefix}.${key}` : key;
            
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                Object.assign(resultado, JSONHelper.flatten(obj[key], novaChave));
            } else {
                resultado[novaChave] = obj[key];
            }
        }
        
        return resultado;
    }
}

const helper = JSONHelper;
console.log("JSONHelper criado");

// Exemplo de flatten
const objetoAninhado = {
    usuario: {
        nome: "João",
        endereco: {
            cidade: "São Paulo"
        }
    }
};

console.log("Flatten:", helper.flatten(objetoAninhado));

// ============================================
// 16. Exemplo Completo - API Response
// ============================================
console.log("\n16. EXEMPLO COMPLETO");

class APIResponse {
    constructor(data, status = 200) {
        this.data = data;
        this.status = status;
        this.timestamp = new Date().toISOString();
    }
    
    toJSON() {
        return {
            data: this.data,
            status: this.status,
            timestamp: this.timestamp
        };
    }
    
    static fromJSON(jsonString) {
        const obj = JSON.parse(jsonString);
        const response = new APIResponse(obj.data, obj.status);
        response.timestamp = new Date(obj.timestamp);
        return response;
    }
    
    toString() {
        return JSON.stringify(this.toJSON(), null, 2);
    }
}

const response = new APIResponse({ usuarios: [] }, 200);
console.log("APIResponse:", response.toString());

const responseRecuperada = APIResponse.fromJSON(response.toString());
console.log("Response recuperada:", responseRecuperada);

console.log("\n=== FIM JS JSON ===");
