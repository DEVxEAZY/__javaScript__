/**
 * ============================================================
 * APP — consumidor dos módulos `escreve` e `le`
 * ============================================================
 *
 * Como rodar:
 *   node 02_app.js
 *
 *
 * O QUE ESTE EXEMPLO DEMONSTRA
 *   1. Como dividir código em módulos com responsabilidade única.
 *   2. Como serializar um objeto JS → JSON → arquivo (e voltar).
 *   3. Diferença prática entre flag "w" (sobrescreve) e "a" (anexa).
 *   4. Duas formas de consumir Promise: async/await e .then().
 *   5. JSON.parse + iteração para tratar dados lidos do disco.
 *
 *
 * ANATOMIA DESTE BLOCO DE ESTUDO
 *
 *   04_writing_files/
 *   ├── 02_app.js              ← este arquivo (consumidor)
 *   ├── modulos/
 *   │   ├── escreve.js         ← writeFile encapsulado (flag w)
 *   │   └── le.js              ← readFile encapsulado (utf-8)
 *   └── sandbox_app/           ← criada e zerada a cada run
 *
 *   A pasta `sandbox_app` existe pra ISOLAR o que escrevemos.
 *   Tudo fica lá dentro; nada toca o resto do projeto. Ao rodar
 *   de novo, apagamos e recriamos — o que garante que cada
 *   execução começa do zero, sem "lixo" da anterior.
 *
 *
 * POR QUE OS MÓDULOS RECEBEM `caminho` EM VEZ DE FIXAR DENTRO?
 *   Tentação inicial: enfiar `path.resolve(__dirname, "teste.txt")`
 *   dentro do `escreve.js` e chamar `escreve(dados)`. Funciona,
 *   mas o módulo deixa de ser reutilizável: só sabe escrever
 *   NAQUELE arquivo específico.
 *
 *   Recebendo `caminho` por parâmetro, o mesmo módulo serve
 *   pra gravar log, config, JSON, qualquer coisa. É a regra de
 *   ouro de design: "o módulo cuida do COMO; o chamador decide
 *   ONDE e O QUÊ".
 * ============================================================
 */

// ────────────────────────────────────────────────────────────
// IMPORTS
// ────────────────────────────────────────────────────────────
// `path` é builtin do Node — junta segmentos de caminho de forma
// portátil (no Windows usa "\", no Linux/Mac usa "/", e o `path`
// abstrai essa diferença pra você).
const path = require("path");

// `fs` síncrono só é usado aqui para LIMPAR a sandbox antes de
// começar. É script de estudo, não servidor — pode bloquear sem
// problema. Em produção evite *Sync no caminho quente.
const fs = require("fs");

// Nossos módulos. O caminho começa com "./" pra deixar claro que
// é módulo LOCAL (relativo a este arquivo), não pacote do npm.
// Sem o "./", o Node iria procurar em node_modules e dar erro.
const escreve = require("./modulos/escreve");
const le      = require("./modulos/le");


// ────────────────────────────────────────────────────────────
// SETUP — pasta sandbox isolada
// ────────────────────────────────────────────────────────────
// path.join lida com separadores de pasta cross-platform.
// __dirname é uma variável que o Node injeta em todo arquivo
// CommonJS: contém o caminho ABSOLUTO da pasta deste arquivo.
// Ou seja, SANDBOX vai apontar pra .../04_writing_files/sandbox_app
// não importa de onde você executou `node`.
const SANDBOX = path.join(__dirname, "sandbox_app");

// rmSync com { recursive: true, force: true } é o "rm -rf"
// do Node:
//   - recursive: entra nas subpastas;
//   - force:     não reclama se não existir.
// Disponível desde Node 14.14+. Antes disso era preciso fazer
// rmdirSync com vários flags — hoje é uma chamada só.
fs.rmSync(SANDBOX, { recursive: true, force: true });

// mkdirSync com { recursive: true } cria a pasta E todos os
// pais que faltarem (equivalente a `mkdir -p`). Sem o recursive,
// daria erro se algum nível intermediário não existisse.
fs.mkdirSync(SANDBOX, { recursive: true });


// ============================================================
// 1. PREPARANDO OS DADOS — objeto JS → string JSON
// ============================================================
//
// JSON ("JavaScript Object Notation") é um formato de TEXTO
// para trocar dados. Apesar do nome, é independente de linguagem
// hoje — Python, Go, Java, todo mundo lê/escreve JSON.
//
// As regras são quase as mesmas de um objeto literal JS, com
// algumas diferenças importantes:
//
//   1. Chaves SEMPRE entre aspas DUPLAS (em JS pode ser sem
//      aspas ou simples; em JSON, só duplas).
//   2. Strings só com aspas duplas (não pode aspas simples).
//   3. Sem trailing commas (vírgula sobrando no fim de array
//      ou objeto). Em JS moderno é OK, em JSON é erro de parse.
//   4. Sem comentários. Nem // nem /* */.
//   5. Sem funções, undefined, NaN, Infinity. Tipos suportados:
//        string, number, boolean, null, array, object.
//
// O caminho do arquivo final fica em sandbox_app/pessoas.json.
const caminhoJson = path.join(SANDBOX, "pessoas.json");

// Objeto JS comum. Repare que isto NÃO é JSON ainda — é um array
// de objetos JavaScript. Vai virar JSON só depois do stringify.
const pessoas = [
    { nome: "João" },
    { nome: "Maria" },
    { nome: "Rita" },
    { nome: "Eduardo" },
    { nome: "Luísa" },
];

// JSON.stringify é a função built-in que converte VALOR JS → STRING JSON.
// Assinatura completa:
//
//   JSON.stringify(valor, replacer, espacos)
//
// • valor:    o que será convertido.
// • replacer: filtro opcional (função ou array de chaves) pra
//             excluir/transformar campos. `null` = não filtrar.
// • espacos:  número de espaços de indentação. Sem isso, o JSON
//             sai numa linha SÓ — válido, mas ilegível em editor.
//             Com `2`, fica formatado bonitinho.
//
// Custo do `2` é alguns bytes a mais por arquivo. Vale 100% das
// vezes pra arquivos de configuração que humanos vão abrir.
// Em arquivos puramente máquina-pra-máquina (cache, transmissão
// na rede), aí sim economiza-se omitindo a indentação.
const dadosJson = JSON.stringify(pessoas, null, 2);


// ============================================================
// 2. ESCREVENDO + LENDO — usando async/await
// ============================================================
//
// Top-level await NÃO existe em CommonJS (sistema de módulos
// que estamos usando, com require/module.exports). Existe em
// ES Modules (.mjs ou "type": "module"). Como estamos em CJS,
// envolvemos tudo numa IIFE async — uma função async chamada
// imediatamente, atalho pra "rodar await aqui no topo".
//
//   (async () => { ... await ... })();
//
// Sem isso, daria erro de sintaxe: "await is only valid in
// async functions and the top level modules of ES modules".
(async () => {
    // ────────────────────────────────────────────────────────
    // 2.1. ESCREVENDO COM FLAG "w"
    // ────────────────────────────────────────────────────────
    // Nosso módulo `escreve` usa flag "w" internamente, então
    // este writeFile vai SOBRESCREVER qualquer pessoas.json
    // que já existisse. (Aqui não existe ainda porque acabamos
    // de zerar a sandbox no setup, mas a regra vale.)
    //
    // O `await` faz duas coisas:
    //   1. Pausa esta função até a Promise resolver.
    //   2. Se a Promise rejeitar, transforma em throw — então
    //      o erro pode ser capturado por try/catch normal.
    console.log("=== 1. Escrevendo pessoas.json (flag w) ===");
    await escreve(caminhoJson, dadosJson);
    console.log("Escrito em:", path.basename(caminhoJson));

    // ────────────────────────────────────────────────────────
    // 2.2. LENDO + JSON.parse — string → objeto JS
    // ────────────────────────────────────────────────────────
    //
    // Importante: quando você lê um arquivo JSON, o Node devolve
    // STRING. Pra recuperar o objeto, é preciso passar pelo
    // JSON.parse. O par é simétrico:
    //
    //     objeto JS  ──JSON.stringify──▶ string JSON  ──escreve──▶ disco
    //     disco      ──le──▶ string JSON  ──JSON.parse──▶ objeto JS
    //
    // Se o arquivo estiver corrompido ou não for JSON válido,
    // JSON.parse joga SyntaxError. Em código de verdade, isso
    // deveria estar dentro de try/catch — aqui simplificamos
    // pra focar no fluxo "feliz" do exemplo.
    console.log("\n=== 2. Lendo com await + JSON.parse ===");

    // `cru` é a string CRUA, exatamente como está no disco — incluindo
    // quebras de linha, indentação que demos no stringify, tudo.
    const cru = await le(caminhoJson);
    console.log("typeof do conteúdo lido:", typeof cru, "(string)");

    // JSON.parse interpreta a string e devolve o valor JS correspondente.
    // Aqui cai num array, idêntico (em estrutura) ao `pessoas` original.
    const dados = JSON.parse(cru);
    console.log("Após JSON.parse, é um array?", Array.isArray(dados));

    // Agora `dados` é objeto JS de novo: dá pra usar todos os
    // métodos de array (map, filter, forEach, etc.) e acessar
    // propriedades com . normalmente.
    console.log("Nomes:");
    dados.forEach(p => console.log("  •", p.nome));


    // ────────────────────────────────────────────────────────
    // 2.3. APPEND COM FLAG "a" — log que CRESCE a cada run
    // ────────────────────────────────────────────────────────
    //
    // Cenário: arquivo de log. Cada execução do programa precisa
    // ADICIONAR linhas ao final, NÃO apagar o histórico. Pra isso
    // existe a flag "a" (append).
    //
    // Aqui chamamos `fsp.writeFile` direto, SEM passar pelo
    // módulo `escreve`. Por quê? Porque nosso módulo `escreve`
    // fixa flag "w" internamente — se a gente o usasse aqui,
    // cada writeFile apagaria o log anterior.
    //
    // Em código real, faríamos sentido criar um segundo módulo
    // (`anexa.js`) ou adicionar um parâmetro ao módulo `escreve`
    // (ex.: `escreve(caminho, dados, { anexar: true })`).
    // Aqui ficamos no caminho mais didático pra mostrar a flag
    // em ação.
    //
    // Detalhe importante: o "\n" no final de cada linha é o que
    // garante a quebra. Sem ele, "start...tick...stop" gruda
    // tudo numa linha só. Append não inventa quebra de linha
    // por mágica — você precisa colocar.
    console.log("\n=== 3. Append em log.txt (flag a) ===");

    const fsp        = require("fs/promises");
    const caminhoLog = path.join(SANDBOX, "log.txt");

    // Três appends sequenciais. Como a sandbox foi zerada no
    // início, o arquivo nasce aqui. As três linhas vão se
    // empilhando porque flag "a" abre no FIM toda vez.
    await fsp.writeFile(caminhoLog, `start ${new Date().toISOString()}\n`, { flag: "a" });
    await fsp.writeFile(caminhoLog, `tick  ${new Date().toISOString()}\n`, { flag: "a" });
    await fsp.writeFile(caminhoLog, `stop  ${new Date().toISOString()}\n`, { flag: "a" });

    // Lê de volta pra mostrar o resultado. `le` devolve string,
    // que dividimos por \n só pra exibir bonitinho com prefixo.
    const logFinal = await le(caminhoLog);
    console.log("Conteúdo de log.txt:");
    console.log(logFinal.split("\n").map(l => "  | " + l).join("\n"));
})();


// ============================================================
// 3. VARIANTE COM .then() — alternativa ao async/await
// ============================================================
//
// `le` devolve uma Promise. `await` é uma das formas de consumir
// Promise; .then() é a outra. Funcionalmente equivalentes — a
// escolha é estilística e contextual.
//
// Quando .then() costuma ser melhor:
//   • Você está fora de uma async function (ex.: dentro de um
//     callback de framework, listener de evento DOM).
//   • Você quer encadear transformações curtas com pointer-free
//     style: .then(JSON.parse).then(renderiza).
//   • Você quer disparar e esquecer ("fire and forget"): só dá
//     um .catch no fim e segue a vida.
//
// Quando await costuma ser melhor:
//   • Lógica condicional (if/else baseado em valor lido).
//   • Vários passos sequenciais com erros que se relacionam.
//   • Código que precisa parecer linear pra um humano ler.
//
// Aqui ilustramos um caso típico do .then(): "leia o arquivo e
// passe direto pra uma função que renderiza". Note que NÃO
// precisamos estar dentro de async function — .then() vive em
// qualquer lugar.

/**
 * Função de "renderização" — recebe o JSON cru, converte e
 * imprime. Em uma app real, seria algo tipo "atualiza a tela",
 * "envia pro front", "popula um cache".
 *
 * @param {string} dados   String JSON lida do disco.
 */
function renderizaDados(dados) {
    console.log("\n=== 4. Mesma leitura via .then() ===");

    // JSON.parse pode jogar SyntaxError se o arquivo estiver
    // corrompido. Em produção, envolveríamos em try/catch ou
    // usaríamos um .catch no final da chain.
    const obj = JSON.parse(dados);

    console.log("Renderizando", obj.length, "pessoa(s) via .then()");
    obj.forEach(p => console.log("  →", p.nome));
}

// Pequeno setTimeout de 50ms só pra ESTA saída cair DEPOIS do
// bloco async acima — assim o terminal fica limpo, na ordem
// 1 → 2 → 3 → 4. Não é necessário pra correção, é só estética
// de log.
//
// Em código real, .then() e await disputam o microtask queue
// do JS — quem terminar primeiro imprime primeiro, e isso
// pode embaralhar a saída. O setTimeout serializa visualmente.
setTimeout(() => {
    le(caminhoJson)
        // .then(renderizaDados) é o mesmo que .then(d => renderizaDados(d)).
        // Forma curta funciona porque a função recebe exatamente o
        // valor que o .then entrega.
        .then(renderizaDados)
        // .catch garante que erros não viram "Unhandled Promise
        // Rejection" (que em Node moderno até derruba o processo).
        // Sempre termine uma chain de Promise com .catch.
        .catch(err => console.error("Falhou no .then:", err.message));
}, 50);


/**
 * ============================================================
 * RESUMO MENTAL
 * ============================================================
 *
 *   ESCREVER OBJETO JS COMO ARQUIVO
 *     1. JSON.stringify(obj, null, 2)   → string formatada
 *     2. await escreve(caminho, string) → grava no disco
 *
 *   LER ARQUIVO DE VOLTA COMO OBJETO
 *     1. await le(caminho)              → string crua
 *     2. JSON.parse(string)             → objeto JS de novo
 *
 *   FLAGS QUE IMPORTAM
 *     "w"  → padrão: apaga e escreve do zero
 *     "a"  → preserva o conteúdo e anexa no fim (logs!)
 *     "wx" → cria APENAS se não existir (lockfile)
 *
 *   QUANDO USAR await x .then()
 *     await    → código linear, dentro de async function
 *     .then()  → encadear ação fora de async (callbacks,
 *                event handlers, fire-and-forget)
 *
 *   ARMADILHAS COMUNS
 *     • Esquecer `return` numa Promise → race condition.
 *     • Esquecer `await` na frente da Promise → recebe
 *       Promise<pending> em vez do valor.
 *     • Usar caminho relativo → arquivo "some" se rodar de
 *       outro diretório. Use sempre path.join(__dirname, ...).
 *     • Esquecer "\n" no append → tudo gruda na mesma linha.
 *     • Não dar .catch numa chain de .then → erro silencioso
 *       que pode até derrubar o processo.
 * ============================================================
 */
