const mongo = require("mongoose");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const userSchema = new mongo.Schema({
    nombre: { type: String, required: true },
    cedula: { type: Number, required: true, unique: true },
    telefono: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcryptjs.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.isCorrectPassword = async function(password) {
    try {
        const same = await bcryptjs.compare(password, this.password);
        return same;
    } catch (err) {
        throw err;
    }
};

module.exports = mongo.model("User", userSchema);