import ejercicioModel from "../models/ejercicio.js";
import mongo from 'mongoose';

function validateRequiredFields(body, requiredFields) {
  for (const field of requiredFields) {
    const value = body[field];

    if (value === undefined || value === null) return false;
    if (typeof value === "string" && value.trim() === "") return false;
  }
  return true;
}

export async function allEjerciciosByPatient(req, resp) {
    if (!validateRequiredFields(req.body, ['id_patient'])) {
        return resp.status(400).send({ msg: "Faltan datos." });
    }
    const { id_patient } = req.body;
    const objectId = new mongo.Types.ObjectId(id_patient);
    try {
        const ejercicios = await ejercicioModel.find({ id_patient: objectId });
        
        resp.send(ejercicios);
    } catch (error) {
        resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
    }
}

export async function getEjerciciobyId(req, resp) {
    if (!validateRequiredFields(req.body, ['id_ejercicio'])) {
        return resp.status(400).send({ msg: "Faltan datos." });
    }
    const { id_ejercicio } = req.body;
    try {
        const ejercicio = await ejercicioModel.findById(id_ejercicio);
        resp.send(ejercicio);
    } catch (error) {
        resp.sendStatus(500).json({ msg: "Ocurrió un error en el servidor" });
    }
}

export async function createEjercicio(req, resp) {
    const requiredCommonFields = ['nombre', 'frecuencia_dias', 'frecuencia_horas', 'repeticiones', 'series', 'periodos_descanso', 'apnea', 'flujo', 'hora_inicio', 'id_patient'];
    const requiredExtraFields = ['duracion_total', 'fecha_inicio', 'fecha_fin'];
    
    if (!validateRequiredFields(req.body, requiredCommonFields)) {
        return resp.status(400).send({ msg: "Faltan datos." });
    }
    
    if(req.body.nombre !== "Predeterminado" && !validateRequiredFields(req.body, requiredExtraFields)) {
        return resp.status(400).send({ msg: "Faltan datos." });
    }

    const ejercicio = req.body;
    try {
        const newEjercicio = await ejercicioModel.create(ejercicio);
        resp.status(201).send(newEjercicio);
    } catch (error) {
        resp
            .status(500)
            .send({ msg: "Ocurrió un error en el servidor" });
    }
}

export async function updateEjercicio(req, resp) {
    if (!validateRequiredFields(req.body, ['_id'])) {
        return resp.status(400).send({ msg: "Faltan datos." });
    }
    const { _id } = req.body;
    const entrada = req.body;
    try {
        const ejercicioUpdate = await ejercicioModel.findByIdAndUpdate(_id, entrada, { new: true });
        if (ejercicioUpdate) {
            resp.send({ msg: 'Documento actualizado exitosamente' });
        } else {
            resp.status(404).send({ msg: 'Documento no encontrado' });
        }
    } catch (error) {
        resp
            .status(500)
            .send({ msg: "Ocurrió un error en el servidor" });
    }
}