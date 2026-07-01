import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongo from "./db/connectionMongo.js";

const app = express();

mongo.conectar(app);

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5001",
      "https://www.ubicu.co",
      "https://ubicu.co",
      "https://server.ubicu.co",
      "http://server.ubicu.co",
    ],
    allowedHeaders: [
      "X-HTTP-Method-Override",
      "Content-Type",
      "Accept",
      "Authorization",
      "X-Access-Token",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(cookieParser());

import routeUsers from "./routes/users.js";
import routePatients from "./routes/patients.js";
import routeEjercicios from "./routes/ejercicios.js";
import routeExerciseDates from "./routes/exercise_dates.js";
import routeResults from "./routes/results.js";
import routeRewards from "./routes/rewards.js";
import routeCustomizations from "./routes/customizations.js";
import routePings from "./routes/pings.js";

routeUsers(app);
routePatients(app);
routeEjercicios(app);
routeExerciseDates(app);
routeResults(app);
routeRewards(app);
routeCustomizations(app);
routePings(app);

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`API running on ${port}`));