import * as userControllerNS from "../controllers/users.js";
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

const userController = normalizeController(userControllerNS);

export default function route(app) {
  app.get("/", (req, res) => res.send("mi servidor en expres y mongo"));
  app.get("/checkToken", withAuth, userController.checkToken);
  app.post("/authenticateUser", userController.authenticateUser);
  app.post("/getUserbyId", withAuth, userController.getUserbyId);
  app.post("/createUser", userController.createUser);
  app.put("/updateUser", withAuth, userController.updateUser);
  app.put("/updatePassword", withAuth, userController.updatePassword);
  app.post("/forgotPassword", userController.forgotPassword);
  app.post("/resetPassword", userController.resetPassword);
}
