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
        const customization = req.body;
        try {
            const newCustom = await customizationModel.create(customization);
            resp.send(newCustom);
            console.log("creada custom")
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
    }
}