const calibrationModel = require("../models/calibration");
const ejercicioModel = require("../models/ejercicio");

module.exports = {
    allCalibrations: async (req,resp)=>{
        try {
            const results = await calibrationModel.find();
            resp.send(results);
        } catch (error) {
            resp.status(500).send({msg:"ocurrio un error en el servidor"});
        }
    },
    createCalibration:async (req,resp)=>{
        const result = req.body;
        console.log(result);
        try {
            const resultado = await calibrationModel.create(result);
            resp.send(resultado);
        } catch (error) {
            console.log(error)
            resp
            .status(500)
            .send(error);
        }
    },
    deleteCalibration:async (req,resp)=>{
        try {
            const {id} = req.body;
            const resultDelete = await calibrationModel.deleteOne({_id:id},(error)=>{
                console.log(error);
            });
            resp.send(resultDelete);
        } catch (error) {
            resp
            .status(500)
            .send({msg:"ocurrio un error en el servidor"});
        }
    },
    verifyConnection: function(req, res) {        
        fetch('https://server.ubicu.co/')
        .then(response => {
            if (response.status === 200) {
                res.status(200).json('Conexión exitosa');
            } else {
                res.status(500).json('Error del servidor');
            }
        })
        .catch(error => {
            res.status(500).json('Error del servidor');
        });
    }
}