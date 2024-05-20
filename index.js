const express = require("express");
const mongo = require("./db/connectionMongo");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

mongo.conectar(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
    allowedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5001',
        'https://server.ubicu.co/',
        'http://server.ubicu.co/'
    ],
    headers: [
        'X-HTTP-Method-Override', 'Content-Type', 'Accept', 'X-Access-Token', '*'
    ]
}));


app.use(cookieParser());

const routeUsers = require("./routes/users")(app);
const routePatients = require("./routes/patients")(app);
const routeEjercicios = require("./routes/ejercicios")(app);
const routeResults = require("./routes/results")(app);
const routeRewards = require("./routes/rewards")(app);
const routeCustomizations = require("./routes/customizations")(app);
const routeCalibrations = require("./routes/calibrations")(app);

const port = 5001;
app.listen(port, () => { console.log(port) })