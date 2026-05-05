/**
 * Padrão: exportar uma ÚNICA função.
 *
 * Quando `module.exports` é a própria função, o `require` do
 * outro lado recebe a função direto — sem precisar de `.x`.
 */

module.exports = function log(nivel, mensagem) {
    const ts = new Date().toISOString();
    console.log(`[${ts}] [${nivel.toUpperCase()}] ${mensagem}`);
};
