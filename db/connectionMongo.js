const mongoose = require("mongoose");
const uri = "mongodb://admin:admin@54.81.16.94:27017/ubicu?authSource=admin";
mongoose.Promise = global.Promise;

module.exports = {
    conectar: async(app) => {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err) => {
            if (err)
                console.log("No hay conexión con mongodb. "+err);
            else
                console.log("Conectamos mongodb");
        })

        app.listen(5000, () => {
            console.log("Server está en el puerto 5000");
        })
    }
}