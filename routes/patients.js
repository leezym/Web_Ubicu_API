const patientController = require("../controllers/patients");
const withAuth = require('./middleware');


module.exports = (app) => {
    app.get("/", (req, resp) => {
        resp.json("mi servidor en expres y mongo");
    }),
    app.post("/authenticatePatient", patientController.authenticatePatient);
    app.post("/getPatientbyId", withAuth, patientController.getPatientbyId);
    app.post("/getPatientbyCc", withAuth, patientController.getPatientbyCc);
    app.post("/getPatientbyUser", withAuth, patientController.getPatientbyUser);
    app.post("/createPatient", withAuth, patientController.createPatient);
    app.put("/updatePatient", withAuth, patientController.updatePatient);
}