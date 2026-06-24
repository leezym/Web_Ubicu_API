import * as rewardControllerNS from "../controllers/rewards.js";
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

const rewardController = normalizeController(rewardControllerNS);

export default function route(app) {
  app.get("/", (req, res) => res.send("Servidor en expres y mongo"));
  app.post("/allRewardsByPatient", withAuth, rewardController.allRewardsByPatient);
  app.post("/createRewards", withAuth, rewardController.createRewards);
  app.put("/updateRewards", withAuth, rewardController.updateRewards);
}
