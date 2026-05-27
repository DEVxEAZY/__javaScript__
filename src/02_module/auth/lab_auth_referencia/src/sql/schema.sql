-- Schema minimo para auth com Express + pg.
-- Rode no SQL Editor do Supabase/Neon ou via psql:
--   psql "$DATABASE_URL" -f src/sql/schema.sql
--
-- A tabela "session" e criada automaticamente por connect-pg-simple
-- (createTableIfMissing: true no server.js). Este arquivo cobre so usuarios.

CREATE TABLE IF NOT EXISTS usuarios (
    id          SERIAL PRIMARY KEY,
    email       TEXT NOT NULL UNIQUE,
    senha_hash  TEXT NOT NULL,
    nome        TEXT NOT NULL,
    criado_em   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (email);
