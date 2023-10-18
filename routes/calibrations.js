const calibrationController = require("../controllers/calibrations")
const withAuth = require('./middleware');


module.exports = (app) =>{
    app.get("/",(req,resp)=>{
        resp.send("Servidor en expres y mongo");
    }),
    app.get("/allCalibrations",calibrationController.allCalibrations);
    app.post("/createCalibration",calibrationController.createCalibration);
    app.post("/deleteCalibration",calibrationController.deleteCalibration);
    app.get("/verifyConnection",calibrationController.verifyConnection);
}