/*const mongo = require("mongoose");

mongo.Promise = global.Promise;

module.exports = {
    conectar: async(app) => {
        await mongo.connect("mongodb://44.198.30.162:27017/ubicu", { //mongodb://admin:admin@44.198.30.162:27017/?authMechanism=SCRAM-SHA-1
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        app.listen(5000, () => {
            console.log("Conectamos mongo y el servidor");
        })
    }
}*/

const mongo = require("mongoose");

mongo.Promise = global.Promise;

module.exports = {
    conectar: async(app) => {
        await mongo.connect("mongodb://admin:admin@44.198.30.162:27017/?directConnection=true/ubicu?retryWrites=true&w=majority", { //?directConnection=true/ubicu?retryWrites=true&w=majority&authMechanism=SCRAM-SHA-1
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err) => {
            if (err)
                console.log(err);
            else
                console.log("Conectamos mongo y el servidor");
        })

        app.listen(8000, () => {
            console.log("Puerto 8000");
        })
    }
}