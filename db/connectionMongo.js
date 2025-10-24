const mongoose = require("mongoose");
const uri = "mongodb://admin:admin@54.81.16.94:27017/ubicu?authSource=admin";
mongoose.Promise = global.Promise;

module.exports = {
    conectar: async(app) => {
        try {
        await mongoose.connect(uri);

        console.log("Conectamos MongoDB");

        const PORT = 5000;
        app.listen(PORT, () => {
            console.log(`Server está en el puerto ${PORT}`);
        });
        } catch (err) {
        console.error("No hay conexión con MongoDB:", err);
        process.exit(1);
        }
    }
}