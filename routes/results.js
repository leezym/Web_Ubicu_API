const resultController = require("../controllers/results")
const withAuth = require('./middleware');


module.exports = (app) =>{
    app.get("/",(req,resp)=>{
        resp.json("Servidor en expres y mongo");
    }),
    app.post("/allResultsByEjercicio", withAuth, resultController.allResultsByEjercicio);
    app.post("/createResult", withAuth, resultController.createResult);
}