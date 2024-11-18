const rewardModel = require("../models/reward");
const mongo = require('mongoose');

module.exports = {
    allRewardsByPatient: async(req, resp) => {
        const { id_patient } = req.body;
        if (!mongo.Types.ObjectId.isValid(id_patient)) {
            return resp.status(400).json({ msg: "ID de paciente inválido" });
        }
        
        const objectId = mongo.Types.ObjectId(id_patient);
        try {
            const reward = await rewardModel.findOne({ id_patient: objectId });

            resp.json(reward);
        } catch (error) {
            resp.status(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    createRewards: async(req, resp) => {
        const reward = req.body;
        try {
            const newReward = await rewardModel.create(reward);
            resp.status(200).json(newReward);
        } catch (error) {
            resp.status(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updateRewards: async(req, resp) => {
        const { _id } = req.body;
        const entrada = req.body;
        try {
            const rewardUpdate = await rewardModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (rewardUpdate) {
                resp.json({ msg: 'Documento actualizado exitosamente' });
            } else {
                resp.status(404).json({ msg: 'Documento no encontrado' });
            }
        } catch (error) {
            resp.status(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    }
}