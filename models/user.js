const mongo = require("mongoose");
const bcryptjs = require('bcryptjs');
const saltRounds = 10;

const userSchema = new mongo.Schema({
    nombre: { type: String, required: true },
    cedula: { type: Number, required: true, unique: true },
    telefono: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcryptjs.hash(this.password, saltRounds);
});

userSchema.methods.isCorrectPassword = async function (password) {
  const same = await bcryptjs.compare(password, this.password);
  return same;
};

module.exports = mongo.model("User", userSchema);