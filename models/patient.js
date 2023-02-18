const mongo = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

mongo.set('useCreateIndex', true);

const userScheme = new mongo.Schema({
    nombre: { type: String },
    cedula: { type: Number, unique: true },
    telefono: { type: Number },
    email: { type: String },
    edad: { type: Number },
    sexo: { type: String },
    peso: { type: Number },
    altura: { type: Number },
    direccion: { type: String },
    ciudad: { type: String }
});

module.exports = mongo.model("Patient", userScheme);