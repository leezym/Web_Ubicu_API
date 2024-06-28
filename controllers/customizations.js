const customizationModel = require("../models/customization");
const mongo = require('mongoose');

module.exports = {
    allCustomizationsByPatient: async(req, resp) => {
        const { id_patient } = req.body;
        const objectId = mongo.Types.ObjectId(id_patient);
        try {
            const customization = await customizationModel.findOne({ id_patient: objectId });

            resp.send(customization);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    createCustomizations: async(req, resp) => {
        const customization = req.body;
        try {
            const newCustom = await customizationModel.create(customization);
            resp.status(201).send(newCustom);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updateCustomizations: async(req, resp) => {
        const { _id } = req.body;
        const entrada = req.body;
        try {
            const customizationUpdate = await customizationModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (customizationUpdate) {
                resp.send({ msg: 'Documento actualizado exitosamente' });
            } else {
                resp.status(404).send({ msg: 'Documento no encontrado' });
            }
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    }
}