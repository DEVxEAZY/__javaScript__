/**
 * Padrão: exportar um OBJETO com várias funções.
 *
 * `module.exports` começa como um objeto vazio `{}`.
 * Aqui sobrescrevemos com o objeto que queremos expor.
 */

function somar(a, b)        { return a + b; }
function subtrair(a, b)     { return a - b; }
function multiplicar(a, b)  { return a * b; }
function dividir(a, b)      { return a / b; }

// Tudo que NÃO está em module.exports fica privado ao módulo:
const _segredo = "não vou ser exportado";

module.exports = {
    somar,
    subtrair,
    multiplicar,
    dividir,
};
