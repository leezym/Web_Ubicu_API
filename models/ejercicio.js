const mongo = require("mongoose");

const ejercicioSchema = new mongo.Schema({
    nombre: { type: String, required: true },
    duracion_total: { type: Number, required: true },
    frecuencia_dias: { type: Number, required: true },
    frecuencia_horas: { type: Number, required: true },
    repeticiones: { type: Number, required: true },
    series: { type: Number, required: true },
    periodos_descanso: { type: Number, required: true },
    fecha_inicio: { type: String, default: null },
    fecha_fin: { type: String, default: null },
    apnea: { type: Number, required: true },
    flujo: { type: Number, required: true },
    hora_inicio: { type: Number, required: true },
    id_patient: { type: mongo.Schema.Types.ObjectId, ref: 'Patient', required: true }
});

module.exports = mongo.model("Ejercicio", ejercicioSchema);