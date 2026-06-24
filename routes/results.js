import * as resultControllerNS from "../controllers/results.js";
import withAuth from "./middleware.js";

function normalizeController(ns) {
  const c = ns?.default ?? ns;
  // Compat: algunos controllers exportan { controllerName: {...} }
  if (c && typeof c === "object") {
    const keys = Object.keys(c);
    if (keys.length === 1 && typeof c[keys[0]] === "object") return c[keys[0]];
    if (c.controller) return c.controller;
  }
  return c;
}

const resultController = normalizeController(resultControllerNS);

export default function route(app) {
  app.get("/", (req, res) => res.send("Servidor en expres y mongo"));

  // Queries
  app.post("/allResultsByEjercicio", withAuth, resultController.allResultsByEjercicio);
  app.post("/allResultsByDate", withAuth, resultController.allResultsByDate);
  app.post("/createResult", withAuth, resultController.createResult); // Crear "cabecera" del resultado en Mongo (sin datos grandes)
  app.post("/:id/presignUpload", resultController.presignUpload);
  app.post("/:id/confirmUpload", resultController.confirmUpload); 
  app.get("/:id/preview", resultController.preview); // Preview rápido (metadata + preview guardado)
  app.get("/:id/downloadUrl", resultController.downloadUrl); // Preview rápido (metadata + preview guardado)
}
