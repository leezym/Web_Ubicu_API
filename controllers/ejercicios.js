const ejercicioModel = require("../models/ejercicio");

module.exports = {
    allEjercicios: async(req, resp) => {
        try {
            const ejercicios = await ejercicioModel.find();
            resp.send(ejercicios);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    allEjerciciosByPatient: async(req, resp) => {
        try {
            const { id_patient } = req.body;
            const ejercicios = await ejercicioModel.find({ id_patient: id_patient });

            resp.send(ejercicios);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    createEjercicio: async(req, resp) => {
        try {
            const ejercicio = req.body;
            const newEjercicio = await ejercicioModel.create(ejercicio);
            resp.send(newEjercicio);
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updateEjercicio: async(req, resp) => {
        try {
            const { _id } = req.body;
            const entrada = req.body;
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
    },
    deleteEjercicio: async(req, resp) => {
        try {
            const { id } = req.body;
            const ejercicioDelete = await ejercicioModel.deleteOne({ _id: id }, (error) => {
                console.log(error);
            });
            resp.send(ejercicioDelete);
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    getEjerciciobyId: async(req, resp) => {
        const { id_ejercicio } = req.body;
        try {
            const ejercicio = await ejercicioModel.find({ _id: id_ejercicio });
            resp.send(ejercicio[0]);
        } catch (error) {
            resp.sendStatus(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    }
}