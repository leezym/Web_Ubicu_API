const ejercicioModel = require("../models/ejercicio");
const mongo = require('mongoose');

module.exports = {
    allEjerciciosByPatient: async(req, resp) => {
        const { id_patient } = req.body;
        const objectId = mongo.Types.ObjectId(id_patient);
        try {
            const ejercicios = await ejercicioModel.find({ id_patient: objectId });
            
            resp.status(200).json(ejercicios);
        } catch (error) {
            resp.status(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    createEjercicio: async(req, resp) => {
        const ejercicio = req.body;
        try {
            const newEjercicio = await ejercicioModel.create(ejercicio);
            resp.status(200).json(newEjercicio);
        } catch (error) {
            resp.status(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    updateEjercicio: async(req, resp) => {
        const { _id } = req.body;
        const entrada = {... req.body};
        
        try {
            const ejercicioUpdate = await ejercicioModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (ejercicioUpdate) {
                resp.status(200).json({ msg: 'Documento actualizado exitosamente.' });
            } else {
                resp.status(404).json({ msg: 'Documento no encontrado.' });
            }
        } catch (error) {
            resp.status(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    getEjerciciobyId: async(req, resp) => {
        const { id_ejercicio } = req.body;
        try {
            const ejercicio = await ejercicioModel.findById(id_ejercicio);
            resp.status(200).json(ejercicio);
        } catch (error) {
            resp.status(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    }
}