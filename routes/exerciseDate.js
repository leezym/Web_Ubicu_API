const exerciseDateController = require("../controllers/exerciseDate")
const withAuth = require('./middleware');

module.exports = (app) => {
    app.get("/", (req, resp) => {
        resp.json("Servidor en expres y mongo");
    }),
    app.post("/allExerciseDateByPatient", withAuth, exerciseDateController.allExerciseDateByPatient);
    app.post("/createExerciseDate", withAuth, exerciseDateController.createExerciseDate);
    app.put("/updateExerciseDate", withAuth, exerciseDateController.updateExerciseDate);
}