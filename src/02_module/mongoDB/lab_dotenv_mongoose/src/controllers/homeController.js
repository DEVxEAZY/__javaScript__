"use strict";

const Home = require("../models/HomeModel");

exports.listar = async (_req, res, next) => {
    try {
        const documentos = await Home.find({}).lean();
        res.json(documentos);
    } catch (err) {
        next(err);
    }
};
