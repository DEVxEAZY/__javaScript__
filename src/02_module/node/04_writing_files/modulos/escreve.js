/**
 * ============================================================
 * MÓDULO: escreve
 * ============================================================
 *
 * RESPONSABILIDADE ÚNICA
 *   Receber um caminho de arquivo e um conteúdo, e gravar esse
 *   conteúdo no disco. Quem chama (ex.: app.js) NÃO precisa
 *   saber:
 *     - se usamos sync ou async,
 *     - qual flag de abertura (w, a, wx…),
 *     - qual encoding (utf-8, latin1…),
 *     - se devolvemos uma Promise ou um valor direto.
 *
 *   Tudo isso fica encapsulado aqui. Se amanhã decidirmos
 *   trocar `fs.promises` por `fs/promises` com streams, ou
 *   adicionar log, ou comprimir o conteúdo antes de gravar,
 *   só este arquivo muda. O `app.js` continua chamando
 *   `escreve(caminho, dados)` como sempre.
 *
 *   Esse é o coração do conceito de "módulo": uma caixa-preta
 *   com uma interface estável e implementação livre pra mudar.
 *
 *
 * POR QUE `fs/promises` E NÃO `fs` PURO?
 *   O módulo `fs` original do Node oferece três sabores da
 *   mesma operação:
 *
 *     fs.writeFileSync(path, data, opts)
 *         → BLOQUEIA o event loop até o disco responder.
 *           Em CLI/script é OK; em servidor é tragédia: enquanto
 *           o disco gira, NENHUMA outra requisição é atendida.
 *
 *     fs.writeFile(path, data, opts, callback)
 *         → API antiga, no estilo "callback hell". Funciona,
 *           mas é difícil compor com async/await.
 *
 *     fs.promises.writeFile(path, data, opts)
 *         → Mesma coisa, mas devolve uma Promise. Combina
 *           naturalmente com async/await. É o sabor moderno.
 *
 *   Aqui usamos o terceiro. Importamos via `require("fs/promises")`
 *   — atalho que carrega já o submódulo de Promises (equivalente
 *   a `require("fs").promises`).
 *
 *   Convenção de nome: `fsp` (fs-promises). Não é regra, é só pra
 *   o leitor saber de bate-pronto que "ah, este aqui devolve
 *   Promise; vou ter que dar await ou .then()".
 *
 *
 * FLAGS DO writeFile (o detalhe que muda tudo)
 *   A flag controla COMO o arquivo é aberto antes de escrever.
 *   É equivalente aos modos do fopen() em C:
 *
 *     "w"   → write. Cria se não existir, ou TRUNCA pra zero
 *             (apaga todo o conteúdo) e escreve do início.
 *             É o padrão se você não passar flag nenhuma.
 *
 *     "a"   → append. Cria se não existir, ou abre no FIM.
 *             Cada writeFile com "a" gruda no que já tinha.
 *             Ideal pra arquivos de log.
 *
 *     "wx"  → write exclusive. Como "w", mas FALHA com EEXIST
 *             se o arquivo já existir. Útil quando você quer
 *             garantir "create-only", tipo um lockfile.
 *
 *     "ax"  → append exclusive. Como "a", mas falha se já existir.
 *             Caso de uso menos comum.
 *
 *     "r+"  → read+write. Abre pra ler E escrever, sem truncar.
 *             Posiciona no início. Mais usado com File Handles
 *             que com writeFile direto.
 *
 *   Para mais flags ver Node docs > fs > "File System Flags".
 *
 *
 * ENCODING
 *   "utf-8" é o padrão da web e o que 99% dos arquivos de texto
 *   usam hoje. Quando você passa uma STRING para writeFile e NÃO
 *   especifica encoding, o Node já assume utf-8 — então passar
 *   explícito aqui é redundante, mas tem dois benefícios:
 *
 *     1. Documenta a intenção pra quem lê o código.
 *     2. Cria um único ponto pra trocar se um cliente exigir
 *        outra codificação (ex.: latin1 pra integração legada).
 *
 *   Se em vez de string você passar um Buffer, o encoding é
 *   ignorado — bytes são gravados como vieram. É assim que se
 *   escreve arquivo binário (imagem, PDF) sem corromper.
 *
 *
 * RETORNO DA FUNÇÃO
 *   `fsp.writeFile` devolve `Promise<void>` — não tem valor de
 *   retorno útil, só sinaliza "terminou" (resolve) ou "deu erro"
 *   (reject). Aqui fazemos `return` dessa Promise pra que o
 *   chamador POSSA dar await/then se quiser saber quando acabou.
 *
 *   Se esquecêssemos o `return`, a Promise seria criada mas
 *   "perdida" — o app continuaria sem esperar a gravação acabar
 *   e poderíamos tentar ler antes do conteúdo estar no disco.
 *   É um bug clássico em código async; o `return` evita.
 * ============================================================
 */

// Importa o submódulo de Promises do `fs`.
// `fsp` é só apelido — escolhido para deixar óbvio no resto do
// arquivo que estamos lidando com a versão que devolve Promises.
const fsp = require("fs/promises");

/**
 * Escreve `dados` no arquivo apontado por `caminho`.
 * Substitui o conteúdo anterior (flag "w" = sobrescreve).
 *
 * @param {string} caminho  Caminho absoluto ou relativo do arquivo.
 *                          Recomendado SEMPRE absoluto (use path.resolve
 *                          ou path.join com __dirname) — evita o bug
 *                          clássico de o arquivo aparecer "em outro
 *                          lugar" dependendo de onde o Node foi chamado.
 *
 * @param {string} dados    Conteúdo a gravar. Geralmente já é string
 *                          (texto puro ou JSON.stringify de um objeto).
 *                          Pode também ser Buffer, mas aí o encoding
 *                          abaixo é ignorado.
 *
 * @returns {Promise<void>} Promise que resolve quando o disco confirma
 *                          a escrita, ou rejeita com Error em caso
 *                          de falha (ex.: pasta inexistente, permissão
 *                          negada, disco cheio).
 *
 * EXEMPLO DE USO
 *   const escreve = require("./modulos/escreve");
 *   await escreve("/tmp/saida.txt", "olá mundo\n");
 */
module.exports = function escreve(caminho, dados) {
    // O `return` aqui é CRUCIAL: propaga a Promise pra quem chamou.
    // Sem ele, o chamador faria `await escreve(...)` e o await
    // resolveria imediatamente com `undefined`, ANTES de o disco
    // ter terminado. Resultado: race condition silenciosa.
    return fsp.writeFile(caminho, dados, {
        // "w" = write. Apaga e reescreve do zero.
        // Para um log que cresce com o tempo, o app.js usa "a"
        // chamando o writeFile direto, sem passar por este módulo.
        flag: "w",

        // utf-8 é o default; deixamos explícito como documentação.
        // Se um dia precisar mudar (latin1, ucs2), é UM ponto só.
        encoding: "utf-8",
    });
};
