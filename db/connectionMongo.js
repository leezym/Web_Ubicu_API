const mongoose = require("mongoose");
const uri = "mongodb://admin:admin@44.198.30.162:27017/ubicu?authSource=admin";
mongoose.Promise = global.Promise;

module.exports = {
    conectar: async(app) => {
        try {
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log("Conectamos mongodb");
            
            app.listen(5000, () => {
                console.log("Server está en el puerto 5000");
            });
        } catch (err) {
            console.error("No hay conexión con mongodb. " + err);
            process.exit(1);
        }
    }
}