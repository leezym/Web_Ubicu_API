const mongo = require("mongoose");

const resultSchema = new mongo.Schema({
    id_ejercicio: { type: mongo.Schema.Types.ObjectId, ref: 'Ejercicio', required: true },
    fecha: { type: String, required: true },
    hora: { type: Number, required: true },
    datos: { type: String, required: true }
});

module.exports = mongo.model("Result", resultSchema);