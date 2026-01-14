const customizationModel = require("../models/customization");
const mongo = require('mongoose');

function validateRequiredFields(body, requiredFields) {
    for (let field of requiredFields) {
        if (!body[field] || body[field] === '') {
            return false;
        }
    }
    return true;
}

module.exports = {
    allCustomizationsByPatient: async(req, resp) => {
        if (!validateRequiredFields(req.body, ['id_patient'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
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
        const requiredFields = ['id_customization', 'id_item_fondos_array', 'id_item_figuras_array', 'all_fondos_items_array', 'all_figuras_items_array', 'id_patient'];
        if (!validateRequiredFields(req.body, requiredFields)) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
        const customization = req.body;
        try {
            const newCustom = await customizationModel.create(customization);
            resp.status(201).send(newCustom);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updateCustomizations: async(req, resp) => {
        if (!validateRequiredFields(req.body, ['_id'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
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