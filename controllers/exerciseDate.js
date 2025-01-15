const exerciseDateModel = require("../models/exerciseDate");
const mongo = require('mongoose');

module.exports = {
    allExerciseDateByPatient: async(req, resp) => {
        const { id_patient } = req.body;
        if (!mongo.Types.ObjectId.isValid(id_patient)) {
            return resp.status(400).json({ msg: "ID de paciente inválido" });
        }
        
        const objectId = mongo.Types.ObjectId(id_patient);
        try {
            const exerciseDate = await exerciseDateModel.findOne({ id_patient: objectId });

            resp.status(200).json(exerciseDate);
        } catch (error) {
            resp.status(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    createExerciseDate: async(req, resp) => {
        const exerciseDate = req.body;
        try {
            const newExerciseDate = await exerciseDateModel.create(exerciseDate);
            resp.status(200).json(newExerciseDate);
        } catch (error) {
            resp.status(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    updateExerciseDate: async(req, resp) => {
        const { _id } = req.body;
        const entrada = { ...req.body };
        
        try {
            const exerciseDateUpdate = await exerciseDateModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (exerciseDateUpdate) {
                resp.status(200).json({ msg: 'Documento actualizado exitosamente.' });
            } else {
                resp.status(404).json({ msg: 'Documento no encontrado.' });
            }
        } catch (error) {
            resp.status(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    }
}