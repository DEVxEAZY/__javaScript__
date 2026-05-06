/**
 * ESCREVENDO E MANIPULANDO ARQUIVOS COM FS
 *
 * Como rodar:
 *   node 01_writing_files.js
 *
 * Roteiro do arquivo:
 *   1. writeFileSync          → escrever do zero (sobrescreve)
 *   2. appendFileSync         → adicionar no fim (não apaga)
 *   3. readFileSync           → ler de volta (string vs Buffer)
 *   4. fs.promises (async)    → mesma coisa, sem travar event loop
 *   5. copyFile / rename      → mover e duplicar arquivos
 *   6. unlink / rm            → apagar arquivos e pastas
 *   7. JSON read/write        → caso prático: persistir objeto
 *
 * IDEIA-CHAVE:
 *   O fs trabalha com 3 sabores da mesma função:
 *
 *     fs.writeFileSync(path, data)            ← bloqueia, retorna direto
 *     fs.writeFile(path, data, callback)      ← callback estilo antigo
 *     fs.promises.writeFile(path, data)       ← Promise (async/await)
 *
 *   Em scripts/CLI o sync é prático. Em servidor/produção,
 *   sempre o async — senão o event loop trava enquanto o disco gira.
 *
 * ATENÇÃO:
 *   Tudo aqui escreve dentro de uma SANDBOX (./sandbox) que é
 *   apagada e recriada a cada execução. Nada toca o resto do
 *   projeto — pode rodar várias vezes sem medo.
 */

const fs   = require("fs");
const fsp  = require("fs/promises");
const path = require("path");

// Pasta isolada: tudo que criarmos vive aqui dentro.
const SANDBOX = path.join(__dirname, "sandbox");

// Se já existir de uma execução anterior, apaga recursivamente.
// { recursive: true, force: true } = "apaga tudo dentro, sem reclamar
// se não existir". Disponível desde Node 14.14+.
fs.rmSync(SANDBOX, { recursive: true, force: true });
fs.mkdirSync(SANDBOX, { recursive: true });

console.log(`Sandbox criada em: ${SANDBOX}\n`);

// ============================================================
// 1. WRITEFILESYNC — escrever do zero
// ============================================================
// writeFileSync(caminho, conteúdo) cria o arquivo se não existir
// e SOBRESCREVE inteiro se já existir. Não há "modo append" aqui.
console.log("=== 1. writeFileSync (sobrescreve) ===");

const arquivoNotas = path.join(SANDBOX, "notas.txt");

fs.writeFileSync(arquivoNotas, "Linha 1: primeira escrita\n");
console.log("Criado:", path.basename(arquivoNotas));

// Escrevendo de novo: o conteúdo anterior é PERDIDO.
fs.writeFileSync(arquivoNotas, "Linha A: sobrescreveu tudo\n");
console.log("Sobrescrito (linha 1 sumiu)");

// ============================================================
// 2. APPENDFILESYNC — adicionar no fim
// ============================================================
// appendFileSync NÃO apaga: ele abre o arquivo no modo "a"
// (append) e escreve no final. Se o arquivo não existir, cria.
console.log("\n=== 2. appendFileSync (acumula) ===");

fs.appendFileSync(arquivoNotas, "Linha B: appendada\n");
fs.appendFileSync(arquivoNotas, "Linha C: appendada\n");
fs.appendFileSync(arquivoNotas, "Linha D: appendada\n");
console.log("Adicionadas 3 linhas no fim");

// ============================================================
// 3. READFILESYNC — ler de volta
// ============================================================
// SEM encoding → devolve um Buffer (bytes crus).
// COM encoding (ex.: "utf8") → devolve uma string já decodificada.
// Em arquivos de texto, quase sempre você quer "utf8".
console.log("\n=== 3. readFileSync ===");

const buf = fs.readFileSync(arquivoNotas);              // Buffer
const txt = fs.readFileSync(arquivoNotas, "utf8");      // string
console.log("Tipo sem encoding :", buf.constructor.name, `(${buf.length} bytes)`);
console.log("Tipo com encoding :", typeof txt);
console.log("Conteúdo:");
console.log(txt.split("\n").map(l => "  | " + l).join("\n"));

// ============================================================
// 4. VERSÃO ASYNC (fs.promises)
// ============================================================
// Mesma API, porém devolve Promise. Em servidor é o padrão:
// enquanto o disco responde, o Node atende outras requisições.
console.log("\n=== 4. fs.promises (async) ===");

async function exemploAsync() {
    const arq = path.join(SANDBOX, "async.log");

    await fsp.writeFile(arq, "evento=start\n");
    await fsp.appendFile(arq, "evento=tick\n");
    await fsp.appendFile(arq, "evento=tick\n");
    await fsp.appendFile(arq, "evento=stop\n");

    const conteudo = await fsp.readFile(arq, "utf8");
    const linhas   = conteudo.trim().split("\n");
    console.log(`async.log tem ${linhas.length} eventos:`);
    for (const l of linhas) console.log("  •", l);
}

// ============================================================
// 5. COPYFILE E RENAME — mover e duplicar
// ============================================================
// copyFile  → faz uma cópia bit-a-bit em outro caminho.
// rename    → muda o nome OU move para outra pasta (no mesmo
//             dispositivo). Entre dispositivos, use copyFile + unlink.
async function exemploCopiarMover() {
    console.log("\n=== 5. copyFile / rename ===");

    const original  = path.join(SANDBOX, "original.txt");
    const copia     = path.join(SANDBOX, "copia.txt");
    const renomeado = path.join(SANDBOX, "renomeado.txt");

    await fsp.writeFile(original, "sou o original\n");

    // Duplicar:
    await fsp.copyFile(original, copia);
    console.log("Copiado:  original.txt → copia.txt");

    // Renomear (= mover dentro da sandbox):
    await fsp.rename(copia, renomeado);
    console.log("Renomeado: copia.txt → renomeado.txt");

    const finais = await fsp.readdir(SANDBOX);
    console.log("Arquivos atuais na sandbox:", finais);
}

// ============================================================
// 6. UNLINK / RM — apagar
// ============================================================
// unlink  → apaga UM arquivo. Erra se for pasta.
// rm      → versão moderna, com { recursive, force } funciona
//           para arquivo OU pasta. É o que substitui o velho
//           rmdir + unlink em scripts.
async function exemploApagar() {
    console.log("\n=== 6. unlink / rm ===");

    const descartavel = path.join(SANDBOX, "descartavel.tmp");
    await fsp.writeFile(descartavel, "vida curta\n");
    console.log("Criado descartavel.tmp");

    await fsp.unlink(descartavel);
    console.log("Apagado com unlink");

    // Pasta com conteúdo: unlink não dá conta, rm com recursive sim.
    const pastaTemp = path.join(SANDBOX, "pasta_temp");
    await fsp.mkdir(pastaTemp);
    await fsp.writeFile(path.join(pastaTemp, "a.txt"), "a\n");
    await fsp.writeFile(path.join(pastaTemp, "b.txt"), "b\n");
    console.log("Criada pasta_temp com 2 arquivos");

    await fsp.rm(pastaTemp, { recursive: true, force: true });
    console.log("Pasta_temp removida recursivamente");
}

// ============================================================
// 7. CASO PRÁTICO — persistindo um objeto em JSON
// ============================================================
// Padrão muito comum em scripts, configs, CLIs:
//   1. Tenta ler um JSON do disco;
//   2. Se não existir, parte de um objeto padrão;
//   3. Modifica em memória;
//   4. Grava de volta com JSON.stringify(obj, null, 2).
//
// O `null, 2` formata bonito (indenta 2 espaços) e fica legível
// no editor — vale o byte extra em arquivos de configuração.
async function exemploJson() {
    console.log("\n=== 7. JSON read/write ===");

    const arq = path.join(SANDBOX, "config.json");

    // 1+2: ler ou criar default
    let config;
    try {
        const cru = await fsp.readFile(arq, "utf8");
        config = JSON.parse(cru);
        console.log("Config existente carregada");
    } catch (err) {
        if (err.code !== "ENOENT") throw err; // só ignora "não existe"
        config = { execucoes: 0, ultimoRun: null };
        console.log("Config não existia — criando default");
    }

    // 3: mutar
    config.execucoes += 1;
    config.ultimoRun = new Date().toISOString();

    // 4: gravar formatado
    await fsp.writeFile(arq, JSON.stringify(config, null, 2));
    console.log("Gravado:", config);

    // Lê de volta só pra mostrar como ficou no disco:
    const final = await fsp.readFile(arq, "utf8");
    console.log("Conteúdo do config.json:");
    console.log(final.split("\n").map(l => "  | " + l).join("\n"));
}

// ============================================================
// EXECUÇÃO — encadeia os exemplos async
// ============================================================
// Top-level await não está disponível em CommonJS, então usamos
// uma IIFE async. Cada exemplo é independente: dá pra comentar
// um bloco e os outros continuam funcionando.
(async () => {
    try {
        await exemploAsync();
        await exemploCopiarMover();
        await exemploApagar();
        await exemploJson();

        console.log("\n=== FIM ===");
        console.log("Sandbox preservada em:", SANDBOX);
        console.log("(será apagada na próxima execução)");
    } catch (err) {
        console.error("Falhou:", err);
    }
})();

/**
 * RESUMO DAS OPERAÇÕES
 *
 *   ESCRITA
 *     writeFile / writeFileSync     → cria ou SOBRESCREVE
 *     appendFile / appendFileSync   → cria ou ADICIONA no fim
 *
 *   LEITURA
 *     readFile(path)                → Buffer (bytes)
 *     readFile(path, "utf8")        → string
 *
 *   MOVER / DUPLICAR
 *     copyFile(origem, destino)     → duplica
 *     rename(antigo, novo)          → renomeia ou move
 *
 *   APAGAR
 *     unlink(path)                  → arquivo único
 *     rm(path, { recursive, force })→ arquivo OU pasta inteira
 *
 *   PASTAS
 *     mkdir(path, { recursive })    → cria (e cria os pais)
 *     readdir(path)                 → lista nomes
 *
 *   REGRA DE BOLSO:
 *     CLI/script rápido  → *Sync (código linear, fácil de ler)
 *     servidor/produção  → fs.promises + async/await
 */
