import * as ejercicioControllerNS from "../controllers/ejercicios.js";
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

const ejercicioController = normalizeController(ejercicioControllerNS);

export default function route(app) {
  app.get("/", (req, res) => res.send("Servidor en expres y mongo"));
  app.post("/allEjerciciosByPatient", withAuth, ejercicioController.allEjerciciosByPatient);
  app.post("/getEjerciciobyId", withAuth, ejercicioController.getEjerciciobyId);
  app.post("/createEjercicio", withAuth, ejercicioController.createEjercicio);
  app.put("/updateEjercicio", withAuth, ejercicioController.updateEjercicio);
}
