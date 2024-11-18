const ejercicioController = require("../controllers/ejercicios")
const withAuth = require('./middleware');


module.exports = (app) => {
    app.get("/", (req, resp) => {
        resp.json("Servidor en expres y mongo");
    }),
    app.post("/allEjerciciosByPatient", withAuth, ejercicioController.allEjerciciosByPatient);
    app.post("/getEjerciciobyId", withAuth, ejercicioController.getEjerciciobyId);
    app.post("/createEjercicio", withAuth, ejercicioController.createEjercicio);
    app.put("/updateEjercicio", withAuth, ejercicioController.updateEjercicio);
}