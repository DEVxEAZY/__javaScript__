/**
 * IMPORTAÇÃO DE MÓDULOS NO NODE — estilo CommonJS (require)
 *
 * Como rodar:
 *   node 01_import.js
 *
 * No Node, todo arquivo .js é tratado como um MÓDULO próprio:
 *   - tem seu próprio escopo (não polui o global);
 *   - exporta o que estiver em `module.exports`;
 *   - importa com a função `require("caminho")`.
 *
 * Existem 3 tipos de caminho:
 *   1) "fs", "path"  -> módulo nativo (built-in) do Node
 *   2) "./math"      -> arquivo local (relativo a este arquivo)
 *   3) "lodash"      -> pacote do node_modules (não usamos aqui)
 */

// ============================================================
// 1. IMPORTANDO MÓDULOS NATIVOS DO NODE
// ============================================================
const path = require("path");
const fs   = require("fs");

console.log("=== 1. NATIVOS ===");
console.log("Diretório atual:", __dirname);
console.log("Arquivo atual:  ", __filename);
console.log("Junção de path: ", path.join("a", "b", "c.txt"));
console.log("Existe este arquivo?", fs.existsSync(__filename));

// ============================================================
// 2. IMPORTANDO UM MÓDULO LOCAL — objeto com várias exports
// ============================================================
// math.js usa `module.exports = { somar, subtrair, ... }`
// Pegamos o objeto inteiro e desestruturamos o que queremos.
const math = require("./math");
const { somar, subtrair } = require("./math"); // desestruturação

console.log("\n=== 2. MÓDULO LOCAL (objeto) ===");
console.log("math.somar(2, 3):    ", math.somar(2, 3));
console.log("math.multiplicar:    ", math.multiplicar(4, 5));
console.log("desestruturado somar:", somar(10, 1));
console.log("desestruturado sub:  ", subtrair(10, 1));

// ============================================================
// 3. IMPORTANDO UM MÓDULO QUE EXPORTA UMA ÚNICA FUNÇÃO
// ============================================================
// logger.js usa `module.exports = function(...)`
// O require devolve a função diretamente.
const log = require("./logger");

console.log("\n=== 3. MÓDULO LOCAL (função única) ===");
log("info", "aplicação iniciada");
log("warn", "isso é só um aviso");

// ============================================================
// 4. IMPORTANDO UM MÓDULO QUE USA `exports.x = ...`
// ============================================================
// config.js usa o atalho `exports.PORTA = 3000`
// (equivalente a `module.exports.PORTA = 3000`).
const config = require("./config");

console.log("\n=== 4. MÓDULO LOCAL (exports.x) ===");
console.log("config:", config);
console.log("PORTA: ", config.PORTA);

// ============================================================
// 5. IMPORTANDO UMA CLASSE
// ============================================================
const Pessoa = require("./pessoa");

console.log("\n=== 5. CLASSE ===");
const ana = new Pessoa("Ana", 30);
console.log(ana.apresentar());

// ============================================================
// 6. CACHE DO REQUIRE — o módulo é executado UMA VEZ
// ============================================================
// O Node guarda o resultado em require.cache. Pedir o mesmo
// caminho de novo retorna a MESMA instância (mesmo objeto).
console.log("\n=== 6. CACHE ===");
const a1 = require("./math");
const a2 = require("./math");
console.log("mesma instância?", a1 === a2); // true
console.log("chaves no cache (resumo):",
    Object.keys(require.cache).map(k => path.basename(k)));

// ============================================================
// 7. VARIÁVEIS QUE O NODE INJETA EM CADA MÓDULO
// ============================================================
// Cada arquivo é envolvido por uma função:
//   (function (exports, require, module, __filename, __dirname) { ... })
// Por isso essas 5 "variáveis" existem sem você declarar.
console.log("\n=== 7. WRAPPER DO MÓDULO ===");
console.log("module.id:      ", module.id);
console.log("module.exports: ", module.exports); // ainda vazio aqui
console.log("typeof require: ", typeof require);
