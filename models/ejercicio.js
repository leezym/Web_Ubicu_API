const mongo = require("mongoose");

const ejercicioScheme = new mongo.Schema({
    nombre: { type: String },
    duracion_total: { type: Number },
    frecuencia_dias: { type: Number },
    frecuencia_horas: { type: Number },
    repeticiones: { type: Number },
    series: { type: Number },
    periodos_descanso: { type: Number },
    fecha_inicio: { type: String },
    fecha_fin: { type: String },
    apnea: { type: Number },
    flujo: { type: Number },
    hora_inicio: { type: Number },
    id_user: { type: String }
});

module.exports = mongo.model("Ejercicio", ejercicioScheme);