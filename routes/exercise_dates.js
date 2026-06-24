import * as exerciseDatesControllerNS from "../controllers/exercise_dates.js";
import withAuth from "./middleware.js";

function normalizeController(ns) {
  const c = ns?.default ?? ns;
  // Compat: algunos controllers exportan { controllerName: {...} }
  if (c && typeof c === 'object') {
    const keys = Object.keys(c);
    if (keys.length === 1 && typeof c[keys[0]] === 'object') return c[keys[0]];
    if (c.controller) return c.controller;
  }
  return c;
}

const exerciseDatesController = normalizeController(exerciseDatesControllerNS);

export default function route(app) {
  app.get("/", (req, res) => res.send("Servidor en expres y mongo"));
  app.post("/allExerciseDateByPatient", withAuth, exerciseDatesController.allExerciseDateByPatient);
  app.post("/getExerciseDatebyId", withAuth, exerciseDatesController.getExerciseDatebyId);
  app.post("/createExerciseDate", withAuth, exerciseDatesController.createExerciseDate);
  app.put("/updateExerciseDate", withAuth, exerciseDatesController.updateExerciseDate);
}
