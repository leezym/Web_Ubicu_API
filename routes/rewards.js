const rewardController = require("../controllers/rewards")


module.exports = (app) => {
    app.get("/", (req, resp) => {
            resp.send("Servidor en expres y mongo");
        }),
    app.post("/allRewardsByPatient", rewardController.allRewardsByPatient);
    app.post("/createRewards", rewardController.createRewards);
    app.put("/updateRewards", rewardController.updateRewards);
    app.post("/deleteRewards", rewardController.deleteRewards);
    app.post("/getRewardsbyId", rewardController.getRewardsbyId);


}