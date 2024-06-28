const rewardController = require("../controllers/rewards")
const withAuth = require('./middleware');

module.exports = (app) => {
    app.get("/", (req, resp) => {
        resp.send("Servidor en expres y mongo");
    }),
    app.post("/allRewardsByPatient", withAuth, rewardController.allRewardsByPatient);
    app.post("/createRewards", withAuth, rewardController.createRewards);
    app.put("/updateRewards", withAuth, rewardController.updateRewards);
}