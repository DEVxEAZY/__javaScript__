/**
 * ESLint 9+ — flat config
 *
 * O guia Airbnb ainda é distribuído no formato antigo (.eslintrc).
 * O pacote @eslint/eslintrc traduz "extends: airbnb-base" para este array.
 *
 * Regras extras abaixo espelham o que a aula costuma ajustar ao longo do curso.
 */
import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

export default defineConfig([
  {
    // O próprio arquivo de config não precisa ser lintado como app.
    ignores: ["node_modules/**", "eslint.config.mjs"],
  },
  ...compat.extends("airbnb-base"),
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        console: "readonly",
      },
    },
    rules: {
      // Aula: console.log só para debug — desligamos a proibição do Airbnb aqui.
      "no-console": "off",
      // Aula futura: métodos de classe sem `this` — costuma virar "off" também.
      // "class-methods-use-this": "off",
    },
  },
]);
