/**
 * ============================================================
 * MÓDULO: le
 * ============================================================
 *
 * RESPONSABILIDADE ÚNICA
 *   Receber um caminho e devolver o conteúdo do arquivo já como
 *   string decodificada. O chamador NÃO precisa lidar com
 *   Buffers, encodings ou tratamento de bytes crus — recebe texto
 *   pronto pra usar (ex.: passar pra JSON.parse, exibir, processar).
 *
 *
 * BUFFER vs STRING — o detalhe que confunde quase todo iniciante
 *
 *   `fsp.readFile(caminho)`              → Promise<Buffer>
 *   `fsp.readFile(caminho, "utf-8")`     → Promise<string>
 *
 *   Sem encoding, o Node devolve um Buffer (uma sequência de
 *   bytes brutos, tipo um Uint8Array). É o que você quer ao ler
 *   uma imagem, um zip, um PDF — qualquer coisa binária — porque
 *   tentar "decodificar" bytes binários como texto destrói o
 *   arquivo.
 *
 *   Com encoding ("utf-8", "latin1", "ucs2"…), o Node interpreta
 *   os bytes como caracteres daquele encoding e devolve uma
 *   string pronta. É o que você quer pra .txt, .json, .md, .html,
 *   .csv — qualquer texto.
 *
 *   Aqui FIXAMOS o encoding em utf-8 por default, então nosso
 *   módulo SEMPRE devolve string. Se um dia precisarmos ler
 *   binário, criamos outro módulo (`leBuffer.js`) — não
 *   sobrecarregamos este.
 *
 *
 * POR QUE PARÂMETRO `encoding` COM DEFAULT EM VEZ DE FIXO?
 *   Deixar `encoding = "utf-8"` como parâmetro com valor padrão
 *   é uma técnica comum: 99% dos chamadores não precisam pensar
 *   nele, mas o 1% que precisa (ex.: ler um arquivo legado em
 *   ISO-8859-1) consegue passar `le(caminho, "latin1")` sem
 *   precisar mexer no módulo.
 *
 *   Compare com fixar dentro:
 *       const cru = await fsp.readFile(caminho, "utf-8");
 *   — funciona, mas se um dia precisar de outro encoding o
 *   chamador fica sem saída.
 *
 *
 * RETORNO: PROMISE, NÃO STRING DIRETA
 *   Como `fsp.readFile` devolve Promise, e nós só fazemos
 *   `return fsp.readFile(...)`, nosso módulo TAMBÉM devolve
 *   Promise. Quem consome precisa fazer:
 *
 *       const conteudo = await le(caminho);    // dentro de async
 *       le(caminho).then(conteudo => ...)      // ou .then
 *
 *   Se o chamador esquecer o await, vai logar algo do tipo:
 *       Promise { <pending> }
 *   — que é o "Promise pendente", erro clássico de quem está
 *   começando com async.
 *
 *
 * ERROS COMUNS QUE A Promise REJEITA
 *
 *   ENOENT  → No such file or directory.
 *             O caminho está errado, ou o arquivo foi apagado,
 *             ou você está rodando o Node de outro diretório
 *             (por isso preferimos caminhos absolutos).
 *
 *   EACCES  → Permission denied.
 *             O usuário do processo não tem permissão de leitura.
 *
 *   EISDIR  → Illegal operation on a directory.
 *             Você apontou pra uma PASTA, não pra um arquivo.
 *
 *   Quem chama deve envolver em try/catch (com await) ou .catch()
 *   (com .then) pra tratar esses casos.
 * ============================================================
 */

const fsp = require("fs/promises");

/**
 * Lê o arquivo apontado por `caminho` e devolve seu conteúdo
 * como string.
 *
 * @param {string} caminho   Caminho absoluto (recomendado) ou
 *                           relativo ao cwd. Sempre que possível
 *                           construa com path.join(__dirname, ...)
 *                           pra ficar imune ao diretório de execução.
 *
 * @param {string} [encoding="utf-8"]
 *                           Codificação para interpretar os bytes
 *                           do arquivo como texto. Deixe utf-8 a não
 *                           ser que tenha um motivo específico
 *                           (arquivo legado, integração antiga…).
 *
 * @returns {Promise<string>} Promise que resolve com o conteúdo
 *                            já decodificado, ou rejeita com Error
 *                            (ENOENT, EACCES, EISDIR…).
 *
 * EXEMPLO DE USO
 *   const le = require("./modulos/le");
 *
 *   // Com async/await:
 *   const txt = await le("/tmp/dados.json");
 *   const obj = JSON.parse(txt);
 *
 *   // Com .then():
 *   le("/tmp/dados.json")
 *       .then(JSON.parse)
 *       .then(obj => console.log(obj))
 *       .catch(err => console.error("Falhou:", err.message));
 */
module.exports = function le(caminho, encoding = "utf-8") {
    // Repare na ausência de try/catch aqui dentro.
    // Não tratamos o erro DE PROPÓSITO: deixamos a Promise
    // rejeitar e quem chamou decide o que fazer (mostrar mensagem
    // amigável, tentar criar default, abortar o programa…).
    //
    // Engolir o erro aqui seria um anti-padrão: roubaríamos
    // contexto do chamador e o programa seguiria com dados
    // inválidos — o famoso "falha silenciosa".
    return fsp.readFile(caminho, encoding);
};
