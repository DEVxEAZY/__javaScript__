/**
 * Padrão: usar o atalho `exports.x = ...`
 *
 * `exports` é só uma referência inicial para o mesmo objeto que
 * `module.exports` aponta. Adicionar propriedades nele funciona,
 * MAS reatribuir (`exports = {...}`) NÃO funciona — você quebra
 * o link e nada é exportado.
 */

exports.PORTA      = 3000;
exports.HOST       = "localhost";
exports.AMBIENTE   = process.env.NODE_ENV || "development";

exports.urlCompleta = function () {
    return `http://${exports.HOST}:${exports.PORTA}`;
};

// ❌ NÃO FAÇA: `exports = { PORTA: 3000 }`  -> não exporta nada
// ✅ Para substituir tudo de uma vez, use `module.exports = {...}`
