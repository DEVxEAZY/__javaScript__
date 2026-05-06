/**
 * src/index.js — PONTO DE ENTRADA do bundle
 *
 * Webpack comeca aqui, segue cada `import`, e empacota tudo
 * em public/dist/bundle.js. O navegador carrega o bundle e
 * executa este codigo.
 *
 * Repare: estamos usando `import` (ESM). No browser direto,
 * isso so rola via <script type="module">. Mas como passou
 * pelo webpack, ele converteu pra forma compativel com qualquer
 * navegador.
 */

import { iniciarContador } from "./contador.js";
import { iniciarRelogio } from "./relogio.js";

iniciarContador(document.getElementById("contador"));
iniciarRelogio(document.getElementById("relogio"));

console.log("Bundle carregado!");
