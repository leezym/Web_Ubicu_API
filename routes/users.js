const userController = require("../controllers/users");
const withAuth = require('./middleware');


module.exports = (app) => {
    app.get("/", (req, resp) => {
            resp.send("mi servidor en expres y mongo");
        }),
        app.get("/allUsers", withAuth, userController.allUsers);
    app.post("/createUser", userController.createUser);
    app.put("/updateUser", withAuth, userController.updateUser);
    app.post("/authenticateUser", userController.authenticateUser);
    app.get("/checkToken", withAuth, userController.checkToken);
    app.post("/getUserbyId", withAuth, userController.getUserbyId);
    app.put("/updatePassword", withAuth, userController.updatePassword);
}