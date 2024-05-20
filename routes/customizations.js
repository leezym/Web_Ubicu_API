const customizationController = require("../controllers/customizations")
const withAuth = require('./middleware');

module.exports = (app) => {
    app.get("/", (req, resp) => {
            resp.send("Servidor en expres y mongo");
        }),
    app.post("/allCustomizationsByPatient", withAuth, customizationController.allCustomizationsByPatient);
    app.post("/createCustomizations", withAuth, customizationController.createCustomizations);
    app.put("/updateCustomizations", withAuth, customizationController.updateCustomizations);
}