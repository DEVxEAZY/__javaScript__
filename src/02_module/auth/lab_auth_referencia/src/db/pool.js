/**
 * Pool de conexoes Postgres (node-postgres / pg).
 *
 * Por que pool e nao `new Client()` a cada request?
 *   Abrir conexao TCP + handshake Postgres e caro. O pool reutiliza
 *   conexoes prontas e limita quantas ficam abertas ao mesmo tempo.
 *
 * Seguranca: este modulo NAO executa SQL — so exporta o pool.
 * Toda query fica nos controllers, sempre com placeholders $1, $2...
 */

"use strict";

const { Pool } = require("pg");

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    // server.js tambem valida antes de subir; aqui evitamos pool "fantasma".
    throw new Error(
        "DATABASE_URL nao definida. Copie .env.example para .env e cole a URI do Postgres."
    );
}

const pool = new Pool({
    connectionString: DATABASE_URL,
    // Supabase/Neon exigem SSL na nuvem; em localhost pode ser false.
    ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false },
    max: 10,
});

pool.on("error", (err) => {
    // Erro em conexao ociosa — logar; em prod considere alerta/metricas.
    console.error("Erro inesperado no pool Postgres:", err.message);
});

module.exports = pool;
