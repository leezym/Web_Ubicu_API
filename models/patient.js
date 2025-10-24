const mongo = require("mongoose");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const patientSchema = new mongo.Schema({
    nombre: { type: String, required: true },
    cedula: { type: Number, required: true, unique: true },
    telefono: { type: Number, required: true },
    email: { type: String, required: true },
    edad: { type: Number, required: true },
    sexo: { type: String, required: true },
    peso: { type: Number, required: true },
    altura: { type: Number, required: true },
    direccion: { type: String, required: true },
    ciudad: { type: String, required: true },
    password: { type: String, required: true },
    id_user: { type: mongo.Schema.Types.ObjectId, ref: 'User', required: true }
});

patientSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcryptjs.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

patientSchema.methods.isCorrectPassword = async function(password) {
    try {
        const same = await bcryptjs.compare(password, this.password);
        return same;
    } catch (err) {
        throw err;
    }
};

module.exports = mongo.model("Patient", patientSchema);