const rewardModel = require("../models/reward");

module.exports = {
    allRewardsByPatient: async(req, resp) => {
        try {
            const { id_patient } = req.body;
            const reward = await rewardModel.findOne({ id_patient: id_patient });

            resp.send(reward);
        } catch (error) {
            resp.status(500).send({ msg: "ocurrio un error en el servidor" });
        }
    },
    createRewards: async(req, resp) => {
        try {
            const reward = req.body;
            const user = await rewardModel.create(reward);
            resp.send(reward);
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    updateRewards: async(req, resp) => {
        try {
            const { _id } = req.body;
            const entrada = req.body;
            const rewardUpdate = await rewardModel.findOneAndUpdate({ _id: _id }, entrada);
            console.log("resp", rewardUpdate)
            resp.send(rewardUpdate);
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    deleteRewards: async(req, resp) => {
        try {
            const { id } = req.body;
            const rewardDelete = await rewardModel.deleteOne({ _id: id }, (error) => {
                console.log(error);
            });
            resp.send(rewardDelete);
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    getRewardsbyId: async(req, resp) => {
        const { id_reward } = req.body;
        try {
            const reward = await rewardModel.findOne({ _id: id_reward });
            resp.send(reward);
        } catch (error) {
            resp.sendStatus(500).send({ msg: "ocurrio un error en el servidor" });
        }
    }
}