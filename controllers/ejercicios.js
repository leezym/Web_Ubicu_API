const ejercicioModel = require("../models/ejercicio");
const mongo = require('mongoose');

module.exports = {
    allEjerciciosByPatient: async(req, resp) => {
        const { id_patient } = req.body;
        const objectId = mongo.Types.ObjectId(id_patient);
        try {
            const ejercicios = await ejercicioModel.find({ id_patient: objectId });
            
            resp.json(ejercicios);
        } catch (error) {
            resp.status(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    createEjercicio: async(req, resp) => {
        const ejercicio = req.body;
        try {
            const newEjercicio = await ejercicioModel.create(ejercicio);
            resp.status(200).json(newEjercicio);
        } catch (error) {
            resp
                .status(500)
                .json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updateEjercicio: async(req, resp) => {
        const { _id } = req.body;
        const entrada = req.body;
        try {
            const ejercicioUpdate = await ejercicioModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (ejercicioUpdate) {
                resp.json({ msg: 'Documento actualizado exitosamente' });
            } else {
                resp.status(404).json({ msg: 'Documento no encontrado' });
            }
        } catch (error) {
            resp
                .status(500)
                .json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    getEjerciciobyId: async(req, resp) => {
        const { id_ejercicio } = req.body;
        try {
            const ejercicio = await ejercicioModel.findById(id_ejercicio);
            resp.json(ejercicio);
        } catch (error) {
            resp.jsonStatus(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    }
}