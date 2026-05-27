"use strict";

const express = require("express");
const homeController = require("../controllers/homeController");

const router = express.Router();

router.get("/", (_req, res) => {
    res.type("html").send(
        "<pre>" +
            "Mongo + Express (aula).\n\n" +
            "GET /documentos → JSON com documentos da collection (pluralizada pelo Mongoose).\n" +
            "Seed de um documento sem nodemon repetir inserts: npm run seed\n" +
            "</pre>"
    );
});

router.get("/documentos", homeController.listar);

module.exports = router;
