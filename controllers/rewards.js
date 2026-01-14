const rewardModel = require("../models/reward");
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
    allRewardsByPatient: async(req, resp) => {
        if (!validateRequiredFields(req.body, ['id_patient'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
        const { id_patient } = req.body;
        const objectId = mongo.Types.ObjectId(id_patient);
        try {
            const reward = await rewardModel.findOne({ id_patient: objectId });

            resp.send(reward);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    createRewards: async(req, resp) => {
        const requiredFields = ['all_badges_array', 'session_reward', 'day_reward', 'total_reward', 'total_series', 'total_sessions', 'total_days', 'total_weeks', 'id_patient'];
        if (!validateRequiredFields(req.body, requiredFields)) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
        const reward = req.body;
        try {
            const newReward = await rewardModel.create(reward);
            resp.status(201).send(newReward);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updateRewards: async(req, resp) => {
        if (!validateRequiredFields(req.body, ['_id'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
        const { _id } = req.body;
        const entrada = req.body;
        try {
            const rewardUpdate = await rewardModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (rewardUpdate) {
                resp.send({ msg: 'Documento actualizado exitosamente' });
            } else {
                resp.status(404).send({ msg: 'Documento no encontrado' });
            }
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    }
}