const ejercicioController = require("../controllers/ejercicios")
const withAuth = require('./middleware');


module.exports = (app) => {
    app.get("/", (req, resp) => {
            resp.send("Servidor en expres y mongo");
        }),
        app.get("/allEjercicios", withAuth, ejercicioController.allEjercicios);
    app.post("/allEjerciciosByPatient", withAuth, ejercicioController.allEjerciciosByPatient);
    app.post("/createEjercicio", withAuth, ejercicioController.createEjercicio);
    app.put("/updateEjercicio", withAuth, ejercicioController.updateEjercicio);
    app.post("/getEjerciciobyId", withAuth, ejercicioController.getEjerciciobyId);


}