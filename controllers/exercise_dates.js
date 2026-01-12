const exerciseDateModel = require("../models/exercise_date");
const mongo = require('mongoose');

module.exports = {
    allExerciseDateByPatient: async(req, resp) => {
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
        const { id_exercise_date } = req.body;
        try {
            const exerciseDate = await exerciseDateModel.findById(id_exercise_date);
            resp.send(exerciseDate);
        } catch (error) {
            resp.sendStatus(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    createExerciseDate: async(req, resp) => {
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