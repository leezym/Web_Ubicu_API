const rewardModel = require("../models/reward");
const mongo = require('mongoose');

module.exports = {
    allRewardsByPatient: async(req, resp) => {
        const { id_patient } = req.body;
        const objectId = mongo.Types.ObjectId(id_patient);
        try {
            const reward = await rewardModel.findOne({ id_patient: objectId });

            resp.send(reward);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    createRewards: async(req, resp) => {
        const reward = req.body;
        try {
            const newReward = await rewardModel.create(reward);
            resp.status(201).send(newReward);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    updateRewards: async(req, resp) => {
        const { _id } = req.body;
        const entrada = req.body;
        try {
            const rewardUpdate = await rewardModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (rewardUpdate) {
                resp.send({ msg: 'Documento actualizado exitosamente.' });
            } else {
                resp.status(404).send({ msg: 'Documento no encontrado.' });
            }
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    }
}