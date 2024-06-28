const userController = require("../controllers/users");
const withAuth = require('./middleware');

module.exports = (app) => {
    app.get("/", (req, resp) => {
        resp.send("mi servidor en expres y mongo");
    }),
    app.get("/checkToken", withAuth, userController.checkToken);
    app.post("/authenticateUser", userController.authenticateUser);
    app.post("/getUserbyId", withAuth, userController.getUserbyId);
    app.post("/createUser", userController.createUser);
    app.put("/updateUser", withAuth, userController.updateUser);
    app.put("/updatePassword", withAuth, userController.updatePassword);
}