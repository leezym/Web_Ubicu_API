const ejercicioModel = require("../models/ejercicio");
const mongo = require('mongoose');

module.exports = {
    allEjerciciosByPatient: async(req, resp) => {
        const { id_patient } = req.body;
        const objectId = mongo.Types.ObjectId(id_patient);
        try {
            const ejercicios = await ejercicioModel.find({ id_patient: objectId });
            
            resp.send(ejercicios);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    createEjercicio: async(req, resp) => {
        const ejercicio = req.body;
        try {
            const newEjercicio = await ejercicioModel.create(ejercicio);
            resp.status(201).send(newEjercicio);
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    updateEjercicio: async(req, resp) => {
        const { _id } = req.body;
        const entrada = req.body;
        try {
            const ejercicioUpdate = await ejercicioModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (ejercicioUpdate) {
                resp.send({ msg: 'Documento actualizado exitosamente.' });
            } else {
                resp.status(404).send({ msg: 'Documento no encontrado.' });
            }
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    getEjerciciobyId: async(req, resp) => {
        const { id_ejercicio } = req.body;
        try {
            const ejercicio = await ejercicioModel.findById(id_ejercicio);
            resp.send(ejercicio);
        } catch (error) {
            resp.sendStatus(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    }
}