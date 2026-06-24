const mongo = require("mongoose");

const resultSchema = new mongo.Schema({
  id_ejercicio: { type: mongo.Schema.Types.ObjectId, ref: "Ejercicio", required: true },
  fecha: { type: String, required: true },
  hora: { type: Number, required: true },
  // S3 metadata
  s3Key: { type: String, default: null },
  s3Size: { type: Number, default: 0 },
  s3ETag: { type: String, default: null },
  hasData: { type: Boolean, default: false },
  // Preview pequeño (opcional): primeros puntos por serie, etc.
  // Mixed permite guardar objeto/array tal cual.
  preview: { type: mongo.Schema.Types.Mixed, default: null },
});

module.exports = mongo.model("Result", resultSchema);
