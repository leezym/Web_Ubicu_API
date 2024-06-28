const mongo = require("mongoose");
const bcrypt = require('bcrypt');
const saltRounds = 10;

mongo.set('useCreateIndex', true);

const userSchema = new mongo.Schema({
    nombre: { type: String, required: true },
    cedula: { type: Number, required: true, unique: true },
    telefono: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

userSchema.methods.isCorrectPassword = async function(password) {
    try {
        const same = await bcrypt.compare(password, this.password);
        return same;
    } catch (err) {
        throw err;
    }
};

userSchema.index({ cedula: 1 });

module.exports = mongo.model("User", userSchema);