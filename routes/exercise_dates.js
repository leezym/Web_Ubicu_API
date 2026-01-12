const exerciseDatesController = require("../controllers/exercise_dates")
const withAuth = require('./middleware');


module.exports = (app) => {
    app.get("/", (req, resp) => {
        resp.send("Servidor en expres y mongo");
    }),
    app.post("/allExerciseDateByPatient", withAuth, exerciseDatesController.allExerciseDateByPatient);
    app.post("/getExerciseDatebyId", withAuth, exerciseDatesController.getExerciseDatebyId);
    app.post("/createExerciseDate", withAuth, exerciseDatesController.createExerciseDate);
    app.put("/updateExerciseDate", withAuth, exerciseDatesController.updateExerciseDate);
}