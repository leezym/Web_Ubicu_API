import * as patientControllerNS from "../controllers/patients.js";
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

const patientController = normalizeController(patientControllerNS);

export default function route(app) {
  app.get("/", (req, res) => res.send("mi servidor en expres y mongo"));
  app.post("/authenticatePatient", patientController.authenticatePatient);
  app.post("/getPatientbyId", withAuth, patientController.getPatientbyId);
  app.post("/getPatientbyCc", withAuth, patientController.getPatientbyCc);
  app.post("/getPatientbyUser", withAuth, patientController.getPatientbyUser);
  app.post("/createPatient", withAuth, patientController.createPatient);
  app.post("/createPatientWithDefaults", withAuth, patientController.createPatientWithDefaults);
  app.put("/updatePatient", withAuth, patientController.updatePatient);
}
