const mongo = require("mongoose");

const calibrationScheme = new mongo.Schema({
    fecha: { type: String},
    hora: { type: Number },
    minutos: { type: Number },
    datos: { type: String }
});

module.exports = mongo.model("Calibration", calibrationScheme);