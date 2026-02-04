/**
 * JS MODULES - Módulos ES6
 * Este arquivo demonstra import/export e sistema de módulos
 */

console.log("=== JS MODULES - Módulos ES6 ===\n");

// ============================================
// 1. Named Exports
// ============================================
console.log("1. NAMED EXPORTS");

// Exportar múltiplas funções/variáveis
export function somar(a, b) {
    return a + b;
}

export function multiplicar(a, b) {
    return a * b;
}

export const PI = 3.14159;

export const calculadora = {
    somar: (a, b) => a + b,
    subtrair: (a, b) => a - b
};

// Exportar no final do arquivo
function dividir(a, b) {
    return a / b;
}

export { dividir };

// Renomear no export
export { dividir as dividirNumeros };

// ============================================
// 2. Default Export
// ============================================
console.log("\n2. DEFAULT EXPORT");

// Uma única exportação padrão por módulo
export default class Calculadora {
    somar(a, b) {
        return a + b;
    }
    
    subtrair(a, b) {
        return a - b;
    }
}

// Ou exportar função como default
export default function calcular(operacao, a, b) {
    switch(operacao) {
        case '+': return a + b;
        case '-': return a - b;
        case '*': return a * b;
        case '/': return a / b;
        default: return 0;
    }
}

// ============================================
// 3. Import Statements
// ============================================
console.log("\n3. IMPORT STATEMENTS");

// Importar named exports
// import { somar, multiplicar, PI } from './05-js-modules.js';

// Importar com renomeação
// import { somar as adicionar, PI as PI_NUMERO } from './05-js-modules.js';

// Importar tudo como namespace
// import * as CalculadoraUtils from './05-js-modules.js';
// CalculadoraUtils.somar(1, 2);

// Importar default
// import Calculadora from './05-js-modules.js';
// import calc from './05-js-modules.js'; // qualquer nome

// Importar default + named
// import Calculadora, { somar, PI } from './05-js-modules.js';

// ============================================
// 4. Re-exporting
// ============================================
console.log("\n4. RE-EXPORTING");

// Re-exportar tudo de outro módulo
// export * from './outro-modulo.js';

// Re-exportar com renomeação
// export { funcao as novaFuncao } from './outro-modulo.js';

// Re-exportar default
// export { default } from './outro-modulo.js';

// ============================================
// 5. Dynamic Imports
// ============================================
console.log("\n5. DYNAMIC IMPORTS");

// Importação dinâmica (retorna Promise)
async function carregarModulo() {
    try {
        // const modulo = await import('./05-js-modules.js');
        // console.log("Módulo carregado:", modulo);
        console.log("Dynamic import: módulo carregado dinamicamente");
    } catch (erro) {
        console.error("Erro ao carregar módulo:", erro);
    }
}

// Carregar módulo condicionalmente
if (Math.random() > 0.5) {
    carregarModulo();
}

// ============================================
// 6. Module Pattern (CommonJS para Node.js)
// ============================================
console.log("\n6. MODULE PATTERN (CommonJS)");

// Em Node.js, você pode usar:
// module.exports = { ... }
// exports.funcao = function() { ... }
// const modulo = require('./arquivo.js');

// Exemplo de como seria:
const moduloComum = {
    funcao1: () => "Função 1",
    funcao2: () => "Função 2"
};

// module.exports = moduloComum;
console.log("CommonJS pattern:", moduloComum);

// ============================================
// 7. Circular Dependencies
// ============================================
console.log("\n7. CIRCULAR DEPENDENCIES");

// Evitar dependências circulares!
// Módulo A importa B, B importa A = problema

// Solução: usar imports dinâmicos ou reorganizar código

// ============================================
// 8. Tree Shaking
// ============================================
console.log("\n8. TREE SHAKING");

// Bundlers modernos removem código não usado
// Use named exports para permitir tree shaking
export function usado() {
    return "será incluído";
}

export function naoUsado() {
    return "pode ser removido pelo bundler";
}

// ============================================
// 9. Module Scope
// ============================================
console.log("\n9. MODULE SCOPE");

// Variáveis em módulos ES6 são privadas por padrão
const variavelPrivada = "Não acessível de fora";

export function acessarPrivada() {
    return variavelPrivada;
}

// ============================================
// 10. Side Effects
// ============================================
console.log("\n10. SIDE EFFECTS");

// Módulo pode ter side effects (executar código ao importar)
console.log("Este código executa quando o módulo é importado");

// Para importar apenas pelos side effects:
// import './modulo-com-side-effects.js';

// ============================================
// 11. Conditional Exports (package.json)
// ============================================
console.log("\n11. CONDITIONAL EXPORTS");

// No package.json:
/*
{
  "exports": {
    ".": {
      "import": "./index.mjs",
      "require": "./index.cjs",
      "default": "./index.js"
    },
    "./utils": "./utils.js"
  }
}
*/

// ============================================
// 12. Module Best Practices
// ============================================
console.log("\n12. MODULE BEST PRACTICES");

// 1. Use named exports para utilitários
export const utils = {
    formatar: (texto) => texto.toUpperCase(),
    validar: (valor) => valor != null
};

// 2. Use default export para classes/componentes principais
export default class Componente {
    constructor() {
        this.nome = "Componente";
    }
}

// 3. Agrupe exports relacionados
export const Matematica = {
    somar: (a, b) => a + b,
    subtrair: (a, b) => a - b
};

// 4. Evite exportar muitos itens individuais
// Melhor: export const API = { ... }
// Pior: export function api1() {}, export function api2() {}, ...

console.log("\n=== FIM JS MODULES ===");
console.log("\nNota: Para usar módulos ES6 em Node.js, use:");
console.log("1. Extensão .mjs ou");
console.log("2. Adicione 'type: module' no package.json");
