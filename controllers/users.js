import userModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Compat: si no defines JWT_SECRET en .env, mantiene el secreto original.
const secret = process.env.JWT_SECRET || "mysecretstotoken";

function validateRequiredFields(body, requiredFields) {
  for (const field of requiredFields) {
    const value = body[field];

    if (value === undefined || value === null) return false;
    if (typeof value === "string" && value.trim() === "") return false;
  }
  return true;
}

export async function createUser(req, res) {
  const requiredFields = ["nombre", "cedula", "telefono", "email", "password"];
  if (!validateRequiredFields(req.body, requiredFields)) {
    return res.status(400).send({ msg: "Faltan datos." });
  }

  const user = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [
        { cedula: user.cedula },
        { email: user.email }
      ]
    });
    if (existingUser) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    const newUser = await userModel.create(user);
    return res.status(201).send(newUser);
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrió un error en el servidor" });
  }
}

export async function updateUser(req, res) {
  if (!validateRequiredFields(req.body, ["_id"])) {
    return res.status(400).send({ msg: "Faltan datos." });
  }
  const { _id } = req.body;
  const entrada = req.body;

  try {
    const userUpdate = await userModel.findByIdAndUpdate(_id, entrada, { new: true });
    if (userUpdate) return res.send({ msg: "Documento actualizado exitosamente" });
    return res.status(404).send({ msg: "Documento no encontrado" });
  } catch (error) {
    return res.status(500).send({ msg: "Ocurrió un error en el servidor" });
  }
}

export const updateUse = updateUser;

export async function authenticateUser(req, res) {
  if (!validateRequiredFields(req.body, ["cedula", "password"])) {
    return res.status(400).send({ msg: "Faltan datos." });
  }

  const { cedula, password } = req.body;

  try {
    const user = await userModel.findOne({ cedula });
    if (!user) return res.status(400).json({ msg: "Usuario no existe" });

    const same = await user.isCorrectPassword(password);
    if (!same) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const payload = { cedula };
    const token = jwt.sign(payload, secret, { expiresIn: "3h" });

    return res.status(200).json({ token, user });
  } catch (err) {
    return res.status(500).json({ msg: "Ocurrió un error en el servidor" });
  }
}

// Compat con nombre viejo
export const authenticateUse = authenticateUser;

export function checkToken(req, res) {
  return res.sendStatus(200);
}

// RUTA ESPERA: getUserbyId
export async function getUserbyId(req, res) {
  if (!validateRequiredFields(req.body, ["id_user"])) {
    return res.status(400).send({ msg: "Faltan datos." });
  }
  const { id_user } = req.body;

  try {
    const user = await userModel.findById(id_user);
    return res.send(user);
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrió un error en el servidor" });
  }
}

// Compat con nombre viejo
export const getUserbyI = getUserbyId;

export async function forgotPassword(req, res) {
  if (!validateRequiredFields(req.body, ["email"])) {
    return res.status(400).send({ msg: "Faltan datos." });
  }

  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      // Respuesta genérica para no revelar si el email existe
      return res.status(200).json({ msg: "Si el correo está registrado, recibirás un enlace de recuperación." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL || "https://ubicu.co"}/#/ResetContrasena/${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Ubicu" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Recuperación de contraseña - Ubicu",
      html: `
        <p>Hola ${user.nombre},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace (válido por 1 hora):</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
      `,
    });

    return res.status(200).json({ msg: "Si el correo está registrado, recibirás un enlace de recuperación." });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrió un error en el servidor." });
  }
}

export async function resetPassword(req, res) {
  if (!validateRequiredFields(req.body, ["token", "password_nueva"])) {
    return res.status(400).send({ msg: "Faltan datos." });
  }

  const { token, password_nueva } = req.body;
  const saltRounds = 10;

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ msg: "El enlace de recuperación es inválido o ha expirado." });
    }

    user.password = await bcryptjs.hash(password_nueva, saltRounds);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({ msg: "Contraseña actualizada exitosamente." });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrió un error en el servidor." });
  }
}

export async function updatePassword(req, res) {
  const requiredFields = ["_id", "password_actual", "password", "password_nueva", "repeat_password_nueva"];
  if (!validateRequiredFields(req.body, requiredFields)) {
    return res.status(400).send({ msg: "Faltan datos." });
  }

  const { _id, password_actual, password, password_nueva, repeat_password_nueva } = req.body;
  const saltRounds = 10;

  try {
    const passwordMatches = await bcryptjs.compare(password_actual, password);
    if (!passwordMatches) return res.send({ msg: "La contraseña actual no es correcta" });

    if (password_nueva !== repeat_password_nueva) {
      return res.send({ msg: "Las nuevas contraseñas no coinciden" });
    }

    bcryptjs.hash(password_nueva, saltRounds, async (err, hashedPassword) => {
      if (err) return res.status(500).send({ msg: "Error al encriptar la contraseña" });

      try {
        const userUpdate = await userModel.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true });

        if (userUpdate) {
          return res.send({ msg: "Contraseña actualizada exitosamente", password: hashedPassword });
        }
        return res.status(404).send({ msg: "Documento no encontrado" });
      } catch (error) {
        return res.status(500).send({ msg: "Error al actualizar el documento" });
      }
    });
  } catch (error) {
    return res.status(500).send({ msg: "Ocurrió un error en el servidor" });
  }
}
