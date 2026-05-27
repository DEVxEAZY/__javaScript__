"use strict";

const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
    },
    descricao: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Home", homeSchema);
