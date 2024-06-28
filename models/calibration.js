const mongo = require("mongoose");

mongo.set('useCreateIndex', true);

const calibrationSchema = new mongo.Schema({
    fecha: { type: String, required: true },
    hora: { type: Number, required: true },
    minutos: { type: Number, required: true },
    datos: { type: String, required: true }
});

module.exports = mongo.model("Calibration", calibrationSchema);