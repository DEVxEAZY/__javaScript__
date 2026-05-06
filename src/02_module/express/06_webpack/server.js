/**
 * ============================================================
 * EXPRESS + WEBPACK
 * ============================================================
 *
 * A ideia desta aula NAO e o Express ficar mais complexo. Ele
 * continua simples: um app que serve uma pasta `public/`. A
 * novidade e que dentro dessa pasta ha um JS GERADO POR WEBPACK
 * a partir do nosso codigo modular em `src/`.
 *
 *
 *   ┌──────────────────┐                ┌────────────────────┐
 *   │   src/index.js   │   webpack →    │ public/dist/bundle.js │
 *   │   src/contador.js│                │  (1 arquivo so)     │
 *   │   src/relogio.js │                └─────────┬──────────┘
 *   └──────────────────┘                          │
 *           ↑ voce edita                          │ servido pelo Express
 *                                                 ▼
 *                                       <script src="/dist/bundle.js">
 *
 *
 * COMO RODAR
 * ──────────
 *   npm install
 *   npm run build      (gera o bundle uma vez)
 *   npm start          (sobe servidor em :3000)
 *
 *   Em dev: rode `npm run build:dev` num terminal (rebuilda a
 *   cada save) e `npm start` em outro.
 *
 *
 * COMPARANDO COM A AULA ANTERIOR
 * ──────────────────────────────
 * Na aula 135 voce escrevia direto em public/js/app.js. Funciona
 * pra projetinhos. Mas:
 *
 *   • Sem `import`/`export` voce vai concatenando funcoes em UM
 *     arquivo gigante.
 *   • Importar lib do npm (ex.: dayjs) nao da — node_modules nao
 *     vai pro navegador.
 *
 * Webpack resolve isso. Voce escreve normal em src/, com
 * imports, e ele empacota.
 * ============================================================
 */

const express = require("express");
const path = require("path");

const app = express();

// Servimos public/ inteiro — incluindo public/dist/bundle.js que
// o webpack gerou.
app.use(express.static(path.join(__dirname, "public")));

const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`Servidor em http://localhost:${PORTA}`);
    console.log(`(rode \`npm run build\` antes da 1a vez pra gerar o bundle)`);
});
