const customizationModel = require("../models/customization");

module.exports = {
    allCustomizationsByPatient: async(req, resp) => {
        try {
            const { id_patient } = req.body;
            const customization = await customizationModel.find({ id_patient: id_patient });

            resp.send(customization);
        } catch (error) {
            resp.status(500).send({ msg: "ocurrio un error en el servidor" });
        }
    },
    createCustomizations: async(req, resp) => {
        try {
            const customization = req.body;
            const user = await customizationModel.create(customization);
            resp.send(customization);
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    updateCustomizations: async(req, resp) => {
        try {
            const { _id } = req.body;
            const entrada = req.body;
            const customizationUpdate = await customizationModel.findOneAndUpdate({ _id: _id }, entrada);
            console.log("resp", customizationUpdate)
            resp.send(customizationUpdate);
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    deleteCustomizations: async(req, resp) => {
        try {
            const { id } = req.body;
            const customizationDelete = await customizationModel.deleteOne({ _id: id }, (error) => {
                console.log(error);
            });
            resp.send(customizationDelete);
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    getCustomizationsbyId: async(req, resp) => {
        const { id_customization } = req.body;
        try {
            const customization = await customizationModel.findOne({ _id: id_customization });
            resp.send(customization);
        } catch (error) {
            resp.sendStatus(500).send({ msg: "ocurrio un error en el servidor" });
        }
    }
}