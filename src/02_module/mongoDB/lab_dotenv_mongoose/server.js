/**
 * ============================================================
 * LAB — dotenv + Mongoose + ordem da conexao antes do listen
 * ============================================================
 *
 * Como rodar:
 *
 *   cd src/02_module/mongoDB/lab_dotenv_mongoose
 *   cp .env.example .env           # cole sua MONGO_URI
 *   npm install
 *   npm run seed                   # opcional — 1 insert de teste
 *   npm start
 *
 * GET http://localhost:3000/
 * GET http://localhost:3000/documentos
 *
 * Documentação detalhada: AULA.md (nesta pasta).
 * aparecer warning em versoes antigas, vide documentacao dessa serie.
 */

"use strict";

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const homeRoutes = require("./src/routes/homeRoutes");

const app = express();

app.use(express.json());
app.use("/", homeRoutes);

app.use((_req, res) => {
    res.status(404).send("Nao encontrado");
});

app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).send("Erro interno.");
});

const MONGO_URI = process.env.MONGO_URI;
const PORTA = Number(process.env.PORTA) || 3000;

if (!MONGO_URI) {
    console.error("Defina MONGO_URI no arquivo .env (copie .env.example).");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("Conectei na base de dados.");
        app.emit("pronto");
    })
    .catch((err) => {
        console.error("Erro na conexao com o Mongo:", err.message);
        process.exit(1);
    });

app.once("pronto", () => {
    app.listen(PORTA, () => {
        console.log(`Aplicativo escutando em http://localhost:${PORTA}`);
    });
});
