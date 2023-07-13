const customizationController = require("../controllers/customizations")


module.exports = (app) => {
    app.get("/", (req, resp) => {
            resp.send("Servidor en expres y mongo");
        }),
    app.post("/allCustomizationsByPatient", customizationController.allCustomizationsByPatient);
    app.post("/createCustomizations", customizationController.createCustomizations);
    app.put("/updateCustomizations", customizationController.updateCustomizations);
    app.post("/deleteCustomizations", customizationController.deleteCustomizations);
    app.post("/getCustomizationsbyId", customizationController.getCustomizationsbyId);


}