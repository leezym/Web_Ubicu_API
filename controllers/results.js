import resultModel from "../models/result.js";
import mongo from "mongoose";
import { presignPut } from "../services/s3PresignPut.js";
import { presignGet } from "../services/s3PresignGet.js";
import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../services/s3Client.js";

function validateRequiredFields(body, requiredFields) {
  for (const field of requiredFields) {
    const value = body[field];

    if (value === undefined || value === null) return false;
    if (typeof value === "string" && value.trim() === "") return false;
  }
  return true;
}

export async function allResultsByEjercicio(req, res) {
  if (!validateRequiredFields(req.body, ["id_ejercicio", "fecha", "hora"])) {
    return res.status(400).send({ msg: "Faltan datos." });
  }

  const { id_ejercicio, fecha, hora } = req.body;
  const objectId = new mongo.Types.ObjectId(id_ejercicio);

  try {
    const result = await resultModel.findOne({ id_ejercicio: objectId, fecha, hora });

    if (result) return res.send(result);
    return res.send({ msg: "No hay información", datos: "" });
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrió un error en el servidor" });
  }
}

export async function createResult(req, res) {
  const requiredFields = ["id_ejercicio", "fecha", "hora"];
  if (!validateRequiredFields(req.body, requiredFields)) {
    return res.status(400).send({ msg: "Faltan datos." });
  }

  const { id_ejercicio, fecha, hora } = req.body;

  try {
    const newResult = await resultModel.create({ id_ejercicio, fecha, hora });
    return res.status(201).send(newResult);
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrió un error en el servidor" });
  }
}

export async function allResultsByDate(req, res) {
  if (!validateRequiredFields(req.body, ["id_ejercicio"])) {
    return res.status(400).send({ msg: "Faltan datos." });
  }

  const { id_ejercicio } = req.body;
  const objectId = new mongo.Types.ObjectId(id_ejercicio);


  try {
    const results = await resultModel.find({ id_ejercicio: objectId });
    return res.send(results);
  } catch (error) {
    return res.status(500).json({ msg: "Ocurrió un error en el servidor" });
  }
}

/**
 * POST /results/:id/presign-upload  (alias /results/:id/presignUpload)
 * Devuelve URL firmada para PUT a S3.
 */
export async function presignUpload(req, res) {
  try {
    const resultId = req.params.id;
    const key = `results/${resultId}.json.gz`;

    const expiresInSeconds = 3600; // 1h (dev-friendly)
    const uploadUrl = await presignPut({
      key,
      contentType: "application/json",
      expiresInSeconds,
    });

    return res.json({
      ok: true,
      uploadUrl,
      s3Key: key,
      expiresInSeconds,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}

/**
 * POST /results/:id/confirm-upload (alias /results/:id/confirmUpload)
 * Body: { s3Key, preview? }
 * - headObject para confirmar existencia
 * - guarda metadata S3 en Mongo
 * - opcional: guarda preview en Mongo (pequeño)
 */
export async function confirmUpload(req, res) {
  try {
    const resultId = req.params.id;
    const { s3Key, preview } = req.body || {};

    if (!s3Key) return res.status(400).json({ ok: false, msg: "Falta s3Key" });

    const head = await s3.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
      })
    );

    const contentLength = head.ContentLength ?? 0;
    if (contentLength === 0)
      return res.status(400).json({ ok: false, msg: "El archivo subido está vacío." });

    const updateDoc = {
      s3Key,
      s3Size: contentLength,
      s3ETag: head.ETag ?? null,
      hasData: true,
    };

    // Guardar preview si viene (recomendado: poco tamaño)
    if (preview !== undefined) updateDoc.preview = preview;

    const updated = await resultModel.findByIdAndUpdate(resultId, updateDoc, { new: true });

    return res.json({ ok: true, result: updated });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}

/**
 * GET /results/:id/preview
 * Devuelve metadata + preview si existe en Mongo.
 * (NO descarga el archivo grande de S3)
 */
export async function preview(req, res) {
  try {
    const resultId = req.params.id;
    const doc = await resultModel.findById(resultId);

    if (!doc) return res.status(404).json({ ok: false, msg: "Result no encontrado" });

    return res.json({
      ok: true,
      _id: doc._id,
      id_ejercicio: doc.id_ejercicio,
      fecha: doc.fecha,
      hora: doc.hora,
      hasData: doc.hasData,
      s3Key: doc.s3Key,
      s3Size: doc.s3Size,
      s3ETag: doc.s3ETag,
      preview: doc.preview ?? null,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}

export async function downloadUrl(req, res) {
  try {
    const resultId = req.params.id;
    const doc = await resultModel.findById(resultId);

    if (!doc) return res.status(404).json({ ok: false, msg: "Result no encontrado" });
    if (!doc.s3Key) return res.status(400).json({ ok: false, msg: "Este result no tiene s3Key" });

    const url = await presignGet({ key: doc.s3Key, expiresInSeconds: 900 });

    return res.json({ ok: true, url, s3Key: doc.s3Key, expiresInSeconds: 900 });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
}


