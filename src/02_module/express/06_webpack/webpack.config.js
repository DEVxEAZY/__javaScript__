/**
 * ============================================================
 * webpack.config.js
 * ============================================================
 *
 * Webpack e um BUNDLER — pega varios arquivos JS (com seus
 * imports/requires e dependencias do node_modules) e gera UM
 * unico arquivo (o "bundle") pronto pro navegador entender.
 *
 * Por que voce ia querer isso?
 *
 *   • O navegador antigamente NAO entendia `import`/`export`.
 *     Webpack resolve em build, gera codigo classico que roda
 *     em qualquer browser.
 *   • Voce quer escrever em modulos pequenos (uma funcao por
 *     arquivo), mas mandar UM JS pro cliente — menos requests,
 *     melhor performance.
 *   • Quer importar coisas do node_modules direto no front-end
 *     (lodash, dayjs, etc.). Sem bundler isso nao roda no browser.
 *   • Quer minificar / tree-shake / transpilar (Babel) automatico.
 *
 *
 * COMO USAR
 * ─────────
 *   npm install
 *   npm run build       (gera public/dist/bundle.js, modo production)
 *   npm run build:dev   (modo development + watch — rebuilda quando voce salva)
 *   npm start           (sobe o Express; ele serve public/ inclusive o bundle)
 *
 *
 * ANATOMIA DO CONFIG
 * ──────────────────
 *   entry   → POR ONDE comeca a "arvore" de imports.
 *   output  → ONDE escrever o bundle final.
 *   mode    → "development" (legivel) | "production" (minificado).
 *
 * Webpack resolve TODO o grafo a partir de entry: ele segue cada
 * import, junta tudo, gera o bundle.
 * ============================================================
 */

const path = require("path");

module.exports = {
    // PONTO DE ENTRADA — a partir daqui webpack segue os imports.
    entry: "./src/index.js",

    // SAIDA do bundle. Precisa ser caminho ABSOLUTO em "path".
    // Coloquei em public/dist pra ficar dentro do que Express ja
    // serve estaticamente — assim o HTML referencia /dist/bundle.js
    // direto.
    output: {
        path: path.resolve(__dirname, "public", "dist"),
        filename: "bundle.js",

        // Limpa a pasta antes de cada build. Util pra nao acumular
        // bundles antigos (especialmente quando voce passa a usar
        // hashing tipo bundle.[contenthash].js).
        clean: true,
    },

    // O modo controla otimizacoes default. Sobreposto pelo flag
    // `--mode` no CLI (ver scripts no package.json).
    mode: "development",

    // Source map serve pra debugar no DevTools enxergando seu
    // codigo-FONTE (src/...) em vez do bundle gigante. "eval-source-map"
    // e rapido pra dev. Em prod use "source-map" ou nada.
    devtool: "eval-source-map",
};
