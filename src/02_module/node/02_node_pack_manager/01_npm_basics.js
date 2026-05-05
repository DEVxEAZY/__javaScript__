/**
 * NODE PACKAGE MANAGER (NPM) — fundamentos
 *
 * Como rodar:
 *   node 01_npm_basics.js
 *   ou:  npm start   (definido em scripts do package.json)
 *
 * O que é o NPM?
 *   - Gerenciador de pacotes oficial do Node.
 *   - Registro central público: https://registry.npmjs.org
 *   - 3 partes: o REGISTRO (servidor), o CLI (`npm`) e o
 *     manifesto do projeto (`package.json`).
 *
 * Alternativas com a mesma ideia: yarn, pnpm, bun.
 */

// ============================================================
// 1. PACKAGE.JSON — o manifesto do projeto
// ============================================================
// É um JSON que descreve o projeto: nome, versão, dependências,
// scripts, autor, licença, etc. É o "RG" do seu pacote.
//
// Criando um do zero:
//   npm init           -> faz perguntas interativas
//   npm init -y        -> aceita tudo com defaults
//
// Campos principais:
//   "name"            nome do pacote (kebab-case, único no registry)
//   "version"         segue SemVer: MAJOR.MINOR.PATCH
//   "main"            arquivo de entrada quando alguém faz require()
//   "type"            "commonjs" (require) | "module" (import)
//   "private": true   impede publicação acidental no registry
//   "engines"         versões de Node/npm exigidas
//   "scripts"         atalhos de linha de comando
//   "dependencies"    libs necessárias em produção
//   "devDependencies" libs só de desenvolvimento (ex.: jest, eslint)
//
// Lendo o próprio package.json deste estudo:
const pkg = require("./package.json"); // require entende JSON nativamente
console.log("=== 1. PACKAGE.JSON ===");
console.log("Nome:    ", pkg.name);
console.log("Versão:  ", pkg.version);
console.log("Main:    ", pkg.main);
console.log("Engines: ", pkg.engines);
console.log("Scripts: ", Object.keys(pkg.scripts));

// ============================================================
// 2. INSTALANDO PACOTES
// ============================================================
// Sintaxe geral:
//   npm install <pacote>          -> salva em "dependencies"
//   npm i <pacote>                -> alias curto
//   npm i <pacote> --save-dev     -> salva em "devDependencies"
//   npm i <pacote> -D             -> alias de --save-dev
//   npm i -g <pacote>             -> instalação global (CLI tools)
//   npm i <pacote>@<versão>       -> versão específica
//   npm i                         -> instala tudo do package.json
//
// Exemplos práticos (NÃO vamos rodar aqui):
//   npm i lodash                  -> dep de produção
//   npm i -D jest                 -> dep de dev (testes)
//   npm i -g nodemon              -> CLI global (auto-reload)
//   npm i react@18.2.0            -> versão exata
//
// O que acontece ao instalar:
//   1) baixa o pacote do registry
//   2) coloca em ./node_modules
//   3) registra a versão em package.json
//   4) congela árvore exata em package-lock.json

// ============================================================
// 3. NODE_MODULES — a pasta dos pacotes
// ============================================================
// Aqui ficam os pacotes baixados. Características:
//   - NUNCA versionar no git (.gitignore /node_modules)
//   - Pode ser regenerada a qualquer momento com `npm install`
//   - Pode ficar gigante (memes "buraco negro" são reais)
//
// Quando você faz require("lodash"), o Node procura por:
//   ./node_modules/lodash
//   ../node_modules/lodash
//   ../../node_modules/lodash   ... até a raiz.

// ============================================================
// 4. PACKAGE-LOCK.JSON — o "instantâneo" exato
// ============================================================
// Gerado automaticamente pelo npm. Trava a árvore de dependências
// COMPLETA com versões exatas e checksums.
//
// Por que existe: package.json pode dizer "^4.17.0", mas em datas
// diferentes isso pode resolver para 4.17.5 ou 4.18.0. O lock
// garante que TODOS os devs (e o CI) instalem exatamente as mesmas
// versões.
//
// Comandos relacionados:
//   npm install     -> respeita o lock, atualiza se faltar algo
//   npm ci          -> install "limpo" e estrito; ideal para CI
//                       (apaga node_modules e instala do lock)

// ============================================================
// 5. SEMVER — versionamento semântico
// ============================================================
// Formato:  MAJOR.MINOR.PATCH   ex.: 4.17.21
//   MAJOR ↑  -> breaking change (quebrou compatibilidade)
//   MINOR ↑  -> nova feature, compatível
//   PATCH ↑  -> bugfix, compatível
//
// Ranges no package.json:
//   "4.17.21"    versão EXATA, sem flexibilidade
//   "^4.17.21"   compatível: pode subir minor/patch (>=4.17.21 <5.0.0)
//   "~4.17.21"   só patch:    (>=4.17.21 <4.18.0)
//   "*"          qualquer (péssima ideia em produção)
//   "latest"     sempre a mais recente (péssima ideia em produção)
//   ">=4.0.0 <5" range explícito
//
// O caret (^) é o default do `npm install`.
console.log("\n=== 5. SEMVER ===");
console.log("Lodash 4.17.21 com '^' aceita: 4.17.21 até <5.0.0");
console.log("Lodash 4.17.21 com '~' aceita: 4.17.21 até <4.18.0");

// ============================================================
// 6. TIPOS DE DEPENDÊNCIAS
// ============================================================
// "dependencies"
//    Necessárias em runtime/produção. Ex.: express, react, lodash.
//
// "devDependencies"
//    Só desenvolvimento: testes, build, lint. Ex.: jest, eslint,
//    typescript, webpack, prettier. NÃO são instaladas quando
//    alguém faz `npm install --production`.
//
// "peerDependencies"
//    "Eu funciono com X, mas X deve ser instalado pelo HOST".
//    Comum em plugins. Ex.: um plugin de eslint declara eslint
//    como peer porque ele só faz sentido junto do eslint do host.
//
// "optionalDependencies"
//    Tenta instalar; se falhar, segue em frente sem erro.
//    Ex.: fsevents (só no macOS).

// ============================================================
// 7. SCRIPTS DO NPM — atalhos de comando
// ============================================================
// No package.json:
//   "scripts": {
//       "start": "node index.js",
//       "test":  "jest",
//       "build": "webpack",
//       "dev":   "nodemon index.js"
//   }
//
// Como executar:
//   npm start        -> atalho oficial (sem `run`)
//   npm test         -> atalho oficial
//   npm run dev      -> qualquer script custom precisa de `run`
//   npm run build
//
// Composição (encadear comandos):
//   "build:all": "npm run lint && npm run test && npm run build"
//
// Variáveis úteis durante a execução:
//   process.env.npm_package_name     -> nome do pacote
//   process.env.npm_package_version  -> versão
//   process.env.npm_lifecycle_event  -> qual script está rodando
console.log("\n=== 7. SCRIPTS ===");
console.log("Rodando como script:", process.env.npm_lifecycle_event || "(node direto)");
console.log("Pacote (env):       ", process.env.npm_package_name);
console.log("Versão (env):       ", process.env.npm_package_version);

// ============================================================
// 8. NPX — executar binários sem instalar global
// ============================================================
// Antes:  npm i -g create-react-app && create-react-app meu-app
// Hoje:   npx create-react-app meu-app
//
// O npx:
//   1) procura o binário em ./node_modules/.bin
//   2) se não achar, baixa temporariamente do registry e executa
//   3) descarta depois
//
// Útil para CLIs de uso pontual (não poluir o sistema com globais):
//   npx eslint .
//   npx prettier --write src
//   npx http-server

// ============================================================
// 9. COMANDOS DO DIA A DIA
// ============================================================
// LISTAR
//   npm list                  árvore completa de deps
//   npm list --depth=0        só o primeiro nível
//   npm outdated              o que pode ser atualizado
//   npm view <pacote>         metadados do pacote no registry
//   npm view <pacote> versions  todas as versões publicadas
//
// ATUALIZAR
//   npm update                respeita os ranges (^, ~) do package.json
//   npm install <pacote>@latest   força a última versão
//
// REMOVER
//   npm uninstall <pacote>    remove e atualiza package.json + lock
//
// AUDITORIA
//   npm audit                 lista vulnerabilidades conhecidas
//   npm audit fix             tenta corrigir automaticamente
//
// CACHE / LIMPEZA
//   npm cache clean --force   limpa cache local
//   rm -rf node_modules && npm ci   reset total

// ============================================================
// 10. PUBLICANDO UM PACOTE (resumo)
// ============================================================
//   1) npm login                (uma vez)
//   2) ajustar "name", "version" e remover "private": true
//   3) npm publish              ou `npm publish --access public`
//   4) bump de versão antes de republicar:
//        npm version patch     1.0.0 -> 1.0.1
//        npm version minor     1.0.1 -> 1.1.0
//        npm version major     1.1.0 -> 2.0.0
//
// Boas práticas:
//   - "files" no package.json restringe o que vai no tarball
//   - .npmignore funciona como .gitignore para a publicação
//   - README.md é exibido na página do pacote no npmjs.com

// ============================================================
// 11. .npmrc — configurações
// ============================================================
// Arquivo (no projeto ou em ~/.npmrc) com configs do CLI:
//   registry=https://registry.npmjs.org/
//   save-exact=true            sem ^ ou ~ no install
//   engine-strict=true         falha se Node não bater com "engines"
//
// Comandos equivalentes:
//   npm config set save-exact true
//   npm config get registry
//   npm config list

// ============================================================
// 12. CICLO DE VIDA COMPLETO — exemplo prático
// ============================================================
// $ mkdir meu-projeto && cd meu-projeto
// $ npm init -y                    cria package.json
// $ npm i express                  dep de produção
// $ npm i -D jest eslint           deps de dev
// $ git init && echo node_modules > .gitignore
// $ npm test                       roda o script "test"
// $ npm run lint                   roda o script "lint"
// $ npm publish                    publica no registry (se for o caso)

console.log("\n=== FIM — NPM BÁSICO ===");
console.log("Próximo passo: rode `npm run hello` ou `npm run info`.");
