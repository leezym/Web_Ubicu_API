const mongo = require("mongoose");

const resultScheme = new mongo.Schema({
    id_ejercicio: { type: String },
    fecha: { type: String},
    hora: { type: Number },
    datos: { type: String }
});

module.exports = mongo.model("Result", resultScheme);