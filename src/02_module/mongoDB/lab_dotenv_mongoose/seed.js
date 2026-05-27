/**
 * Rode UMA vez (sem nodemon): insere exemplo na collection.
 *
 *   cd src/02_module/mongoDB/lab_dotenv_mongoose
 *   npm run seed
 */

"use strict";

require("dotenv").config();

const mongoose = require("mongoose");
const Home = require("./src/models/HomeModel");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("Defina MONGO_URI no arquivo .env (veja .env.example).");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(async () => {
        const doc = await Home.create({
            titulo: "Titulo de teste",
            descricao: "Descricao exemplo — seed da aula.",
        });
        console.log("Documento criado:");
        console.log(doc.toObject());
        await mongoose.connection.close();
        process.exit(0);
    })
    .catch((err) => {
        console.error("Falha no seed:", err.message);
        process.exit(1);
    });
