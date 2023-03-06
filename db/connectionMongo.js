const mongoose = require("mongoose");
const uri = "mongodb://admin:admin@44.198.30.162:27017/ubicu?authSource=admin";
mongoose.Promise = global.Promise;

module.exports = {
    conectar: async(app) => {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err) => {
            if (err)
                console.log(err);
            else
                console.log("Conectamos mongodb");
        })

        app.listen(5000, () => {
            console.log("Server está en el puerto 5000");
        })
    }
}