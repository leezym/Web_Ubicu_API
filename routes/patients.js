const patientController = require("../controllers/patients");
const withAuth = require('./middleware');


module.exports = (app) => {
    app.get("/", (req, resp) => {
            resp.send("mi servidor en expres y mongo");
        }),
        app.get("/allPatients", withAuth, patientController.allPatients);
    app.post("/createPatient", withAuth, patientController.createPatient);
    app.post("/updatePatient", withAuth, patientController.updatePatient);
    app.post("/deletePatient", withAuth, patientController.deletePatient);
    app.post("/getPatientbyId", patientController.getPatientbyId);
    app.post("/authenticatePatient", patientController.authenticatePatient);
}