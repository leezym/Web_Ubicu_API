const mongo = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

mongo.set('useCreateIndex', true);

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

patientSchema.index({ cedula: 1 });
patientSchema.index({ id_user: 1 });

patientSchema.methods.isCorrectPassword = async function(password) {
    try {
        const same = await bcrypt.compare(password, this.password);
        return same;
    } catch (err) {
        throw err;
    }
};

module.exports = mongo.model("Patient", patientSchema);