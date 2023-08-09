const patientController = require("../controllers/patients");
const withAuth = require('./middleware');


module.exports = (app) => {
    app.get("/", (req, resp) => {
            resp.send("mi servidor en expres y mongo");
        }),
        app.get("/allPatients", withAuth, patientController.allPatients);
    app.post("/createPatient", withAuth, patientController.createPatient);
    app.put("/updatePatient", withAuth, patientController.updatePatient);
    app.post("/getPatientbyId", withAuth, patientController.getPatientbyId);
    app.post("/getPatientbyCc", withAuth, patientController.getPatientbyCc);
    app.post("/getPatientbyUser", withAuth, patientController.getPatientbyUser);
    app.post("/authenticatePatient", patientController.authenticatePatient);
}