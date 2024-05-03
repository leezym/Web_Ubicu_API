const resultController = require("../controllers/results")
const withAuth = require('./middleware');


module.exports = (app) =>{
    app.get("/",(req,resp)=>{
        resp.send("Servidor en expres y mongo");
    }),
    app.get("/allResults", withAuth,resultController.allResults);
    app.post("/allResultsByEjercicio", withAuth, resultController.allResultsByEjercicio);
    app.post("/createResult", withAuth, resultController.createResult);
}