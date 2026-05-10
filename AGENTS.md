# AGENTS.md

## Cursor Cloud specific instructions

This is a JavaScript educational course repository ("JavaScript Completo - Básico e Avançado") containing independent lesson examples and mini-projects. There is **no root-level `package.json`** — each Express lesson has its own.

### Structure

- Root: basic JS examples (`exemplo-completo.js`, `index.html`) — run via `node` or open in browser.
- `src/01_module/`: front-end JS fundamentals — static HTML+JS, no server needed.
- `src/02_module/node/`: Node.js basics (CommonJS, NPM).
- `src/02_module/express/01-08`: 8 Express.js lessons, each self-contained with its own `package.json`.
- `___projects___/`: standalone browser-based projects.

### Running Express lessons

Each Express lesson uses port 3000. Only one lesson can run at a time.

```bash
cd src/02_module/express/01_servidor_basico
npm install   # if node_modules missing
npm start     # starts server on localhost:3000
```

### MongoDB (lesson 08 only)

Lesson `08_mongodb_session_seguranca` requires a MongoDB instance. It reads `MONGO_URI` from a `.env` file (defaults to `mongodb://127.0.0.1:27017/aulas`). All other lessons run without any external services.

### No lint/test framework

This repository does not include ESLint, Prettier, or a test framework. There is no `npm test` or `npm run lint` command at root level.

### Key caveats

- All Express lessons share port 3000 — stop one before starting another.
- The update script installs `node_modules` for all Express lessons automatically.
- For lesson 06 (webpack), run `npm run build` before `npm start` if the `dist/` folder is missing.
