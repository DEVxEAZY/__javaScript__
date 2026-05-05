/**
 * LISTANDO ARQUIVOS COM FS + RECURSÃO MÚTUA
 *
 * Como rodar:
 *   node 01_listing_files.js
 *   node 01_listing_files.js <pasta>     (passa uma pasta como alvo)
 *
 * O que é RECURSÃO MÚTUA?
 *   É quando DUAS (ou mais) funções se chamam alternadamente,
 *   formando um ciclo indireto:
 *
 *       A ──chama──▶ B
 *       ▲           │
 *       └──chama────┘
 *
 *   Para listar arquivos isso encaixa perfeitamente:
 *     - `listarPasta(dir)` percorre as entradas de uma pasta
 *       e delega cada entrada para `visitar(...)`.
 *     - `visitar(entrada)` decide o que fazer:
 *         • se for ARQUIVO → registra
 *         • se for PASTA   → chama `listarPasta` de novo
 *
 *   Cada função tem UMA responsabilidade só, e juntas resolvem
 *   o problema. Compare com a recursão direta (uma função se
 *   chamando) que teria que misturar as duas responsabilidades.
 */

const fs   = require("fs");
const path = require("path");

// O alvo da listagem: pasta passada por argv ou a pasta deste script.
const ALVO = path.resolve(process.argv[2] || __dirname + "/..");

// ============================================================
// 1. VERSÃO SÍNCRONA — recursão mútua clássica
// ============================================================
// listarPasta  ⇄  visitar
console.log(`=== 1. SYNC | alvo: ${ALVO} ===`);

const arquivosEncontrados = [];

function listarPasta(dir) {
    // readdirSync com withFileTypes devolve objetos Dirent —
    // já sabemos se é arquivo/pasta sem precisar de novo stat().
    const entradas = fs.readdirSync(dir, { withFileTypes: true });
    for (const entrada of entradas) {
        visitar(dir, entrada);   // ▼ delega cada entrada
    }
}

function visitar(dir, entrada) {
    const caminho = path.join(dir, entrada.name);

    if (entrada.isDirectory()) {
        // Ignora node_modules e .git pra não explodir a saída
        if (entrada.name === "node_modules" || entrada.name === ".git") return;
        listarPasta(caminho);    // ▲ devolve para a outra função
    } else if (entrada.isFile()) {
        arquivosEncontrados.push(caminho);
    }
    // (symlinks, sockets, FIFOs caem fora aqui de propósito)
}

listarPasta(ALVO);
console.log(`Total de arquivos: ${arquivosEncontrados.length}`);
console.log("Primeiros 5:");
for (const f of arquivosEncontrados.slice(0, 5)) {
    console.log("  •", path.relative(ALVO, f));
}

// ============================================================
// 2. VERSÃO COM PROFUNDIDADE E METADADOS
// ============================================================
// Mesma recursão mútua, mas agora cada função recebe contexto
// extra (profundidade) e devolve uma estrutura em árvore.
console.log("\n=== 2. ÁRVORE COM PROFUNDIDADE ===");

function montarPasta(dir, profundidade) {
    const filhos = [];
    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entrada.name === "node_modules" || entrada.name === ".git") continue;
        filhos.push(montarEntrada(dir, entrada, profundidade + 1));
    }
    return {
        tipo: "pasta",
        nome: path.basename(dir),
        profundidade,
        filhos,
    };
}

function montarEntrada(dir, entrada, profundidade) {
    const caminho = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
        return montarPasta(caminho, profundidade); // ↩ recursão mútua
    }
    const stat = fs.statSync(caminho);
    return {
        tipo: "arquivo",
        nome: entrada.name,
        profundidade,
        tamanho: stat.size,
    };
}

const arvore = montarPasta(ALVO, 0);

// Render simples em árvore (mais uma recursão mútua):
function imprimirNo(no, prefixo = "") {
    const marca = no.tipo === "pasta" ? "📁" : "📄";
    const tam   = no.tipo === "arquivo" ? ` (${no.tamanho} B)` : "";
    console.log(`${prefixo}${marca} ${no.nome}${tam}`);
    if (no.tipo === "pasta") imprimirFilhos(no, prefixo);
}
function imprimirFilhos(pasta, prefixo) {
    for (const filho of pasta.filhos) {
        imprimirNo(filho, prefixo + "  "); // ↩ volta para imprimirNo
    }
}
// Limita o output a 2 níveis pra caber na tela:
const arvorePodada = podar(arvore, 2);
imprimirNo(arvorePodada);

function podar(no, max) {
    if (no.tipo !== "pasta" || no.profundidade >= max) {
        if (no.tipo === "pasta") return { ...no, filhos: [] };
        return no;
    }
    return { ...no, filhos: no.filhos.map(f => podar(f, max)) };
}

// ============================================================
// 3. VERSÃO ASSÍNCRONA — fs.promises + async/await
// ============================================================
// Mesma estrutura mútua, porém não trava o event loop.
// Use esta em produção; a sync é boa pra script/CLI rápido.
console.log("\n=== 3. ASYNC ===");

const fsp = require("fs/promises");

async function listarPastaAsync(dir) {
    const entradas = await fsp.readdir(dir, { withFileTypes: true });
    const resultados = [];
    for (const e of entradas) {
        // Promise.all aqui paralelizaria ainda mais, mas para o
        // estudo manter o for...of deixa a recursão mútua nítida.
        const r = await visitarAsync(dir, e);
        resultados.push(...r);
    }
    return resultados;
}

async function visitarAsync(dir, entrada) {
    const caminho = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
        if (entrada.name === "node_modules" || entrada.name === ".git") return [];
        return listarPastaAsync(caminho);  // ↩ recursão mútua
    }
    if (entrada.isFile()) return [caminho];
    return [];
}

// Top-level await não está disponível em CommonJS, então
// envolvemos numa IIFE async:
(async () => {
    try {
        const lista = await listarPastaAsync(ALVO);
        console.log(`Async total: ${lista.length} arquivos`);
        console.log("Últimos 3:");
        for (const f of lista.slice(-3)) {
            console.log("  •", path.relative(ALVO, f));
        }
    } catch (err) {
        console.error("Falhou no async:", err.message);
    }

    // ========================================================
    // 4. FILTRANDO POR EXTENSÃO + AGREGANDO TAMANHO
    // ========================================================
    // Pequena variação útil: contagem + soma de bytes por
    // extensão. Ainda é a mesma recursão mútua sync de cima.
    console.log("\n=== 4. POR EXTENSÃO ===");

    const stats = new Map();
    for (const arq of arquivosEncontrados) {
        const ext = path.extname(arq).toLowerCase() || "(sem ext)";
        const s   = fs.statSync(arq);
        const acc = stats.get(ext) ?? { qtd: 0, bytes: 0 };
        acc.qtd++; acc.bytes += s.size;
        stats.set(ext, acc);
    }
    const ranking = [...stats.entries()]
        .sort((a, b) => b[1].bytes - a[1].bytes)
        .slice(0, 8);

    console.log("Top 8 extensões por bytes:");
    for (const [ext, info] of ranking) {
        console.log(`  ${ext.padEnd(10)} ${String(info.qtd).padStart(4)} arq.`
            + `   ${(info.bytes / 1024).toFixed(1).padStart(8)} KB`);
    }

    console.log("\n=== FIM ===");
})();

/**
 * RESUMO DOS PARES MÚTUOS DESTE ARQUIVO
 *
 *   listarPasta(dir)         ⇄  visitar(dir, entrada)
 *   montarPasta(dir, p)      ⇄  montarEntrada(dir, entrada, p)
 *   imprimirNo(no, prefixo)  ⇄  imprimirFilhos(pasta, prefixo)
 *   listarPastaAsync(dir)    ⇄  visitarAsync(dir, entrada)
 *
 * Cada par segue o mesmo princípio:
 *   "uma função quebra o trabalho em itens, a outra decide
 *    o que fazer com cada item — e quando o item é uma pasta,
 *    devolve para a primeira."
 */
