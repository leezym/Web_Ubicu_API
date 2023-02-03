const mongo = require("mongoose");

mongo.Promise = global.Promise;

module.exports = {
    conectar: async(app) => {
        await mongo.connect("mongodb://44.198.30.162:27017/ubicu", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        app.listen(5000, () => {
            console.log("Conectamos mongo y el servidor");
        })
    }
}