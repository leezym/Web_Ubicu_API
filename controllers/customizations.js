const customizationModel = require("../models/customization");

module.exports = {
    allCustomizationsByPatient: async(req, resp) => {
        try {
            const { id_patient } = req.body;
            const customization = await customizationModel.findOne({ id_patient: id_patient });

            resp.send(customization);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    createCustomizations: async(req, resp) => {
        try {
            const customization = req.body;
            const newCustom = await customizationModel.create(customization);
            resp.send(newCustom);
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updateCustomizations: async(req, resp) => {
        try {
            const { _id } = req.body;
            const entrada = req.body;
            const customizationUpdate = await customizationModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (customizationUpdate) {
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
    getCustomizationsbyId: async(req, resp) => {
        const { id_customization } = req.body;
        try {
            const customization = await customizationModel.findOne({ _id: id_customization });
            resp.send(customization);
        } catch (error) {
            resp.sendStatus(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    }
}