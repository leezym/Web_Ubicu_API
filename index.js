const express = require("express");
const mongo = require("./db/connectionMongo");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const userModel = require("./models/user");

mongo.conectar(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors({
    origin: '*',
    /*allowedOrigins: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5001',
        'https://server.ubicu.co/',
        'http://server.ubicu.co/'
    ],*/
    headers: [
        'X-HTTP-Method-Override', 'Content-Type', 'Accept', 'X-Access-Token', '*'
    ]
}));


app.use(cookieParser());

const routeUsers = require("./routes/users")(app);
const routeCultivos = require("./routes/cultivos")(app);
const routeRecomendaciones = require("./routes/recomendaciones")(app);
const routeNovedades = require("./routes/novedades")(app);
const routeEjercicios = require("./routes/ejercicios")(app);
const routeResults = require("./routes/results")(app);

//test
app.post("/postData", async(req, res) => { //error
    try {
        const user = await userModel.create(usuario);
        res.send("user");
        //res.send(req.body);

    } catch (error) {
        res.send("error");
        resp
            .sendStatus(500)
            .send({ msg: "ocurrio un error en el servidor" });
    }
});

app.get("/getData", async(req, res) => { //funciona
    try {
        const user = await userModel.find();
        res.send("user");

    } catch (error) {
        res.send("error");
        resp
            .sendStatus(500)
            .send({ msg: "ocurrio un error en el servidor" });
    }
});


const port = 5001;
app.listen(port, () => { console.log(port) })