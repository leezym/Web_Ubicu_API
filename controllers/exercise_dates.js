const exerciseDateModel = require("../models/exercise_date");
const mongo = require('mongoose');

function validateRequiredFields(body, requiredFields) {
    for (let field of requiredFields) {
        if (!body[field] || body[field] === '') {
            return false;
        }
    }
    return true;
}

module.exports = {
    allExerciseDateByPatient: async(req, resp) => {
        if (!validateRequiredFields(req.body, ['id_patient'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
        const { id_patient } = req.body;
        const objectId = mongo.Types.ObjectId(id_patient);
        try {
            const exerciseDates = await exerciseDateModel.findOne({ id_patient: objectId });

            resp.send(exerciseDates);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    getExerciseDatebyId: async(req, resp) => {
        if (!validateRequiredFields(req.body, ['id_exercise_date'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
        const { id_exercise_date } = req.body;
        try {
            const exerciseDate = await exerciseDateModel.findById(id_exercise_date);
            resp.send(exerciseDate);
        } catch (error) {
            resp.sendStatus(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    createExerciseDate: async(req, resp) => {
        if (!validateRequiredFields(req.body, ['id_patient'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
        const exerciseDate = req.body;
        try {
            const newExerciseDate = await exerciseDateModel.create(exerciseDate);
            resp.status(201).send(newExerciseDate);
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updateExerciseDate: async(req, resp) => {
        if (!validateRequiredFields(req.body, ['_id'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
        const { _id } = req.body;
        const entrada = req.body;
        try {
            const exerciseDateUpdate = await exerciseDateModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (exerciseDateUpdate) {
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
}