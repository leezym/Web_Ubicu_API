const resultModel = require("../models/result");

module.exports = {
    allResults: async (req,resp)=>{
        try {
            const results = await resultModel.find();
            resp.send(results);
        } catch (error) {
            resp.status(500).send({ msg:"Ocurrió un error en el servidor" });
        }
    },
    allResultsByEjercicio: async (req,resp)=>{
        try {
            const {id_ejercicio, fecha, hora} = req.body;
            const results = await resultModel.findOne({id_ejercicio:id_ejercicio, fecha:fecha, hora:hora});

            //agrego el nombre del ejercicio anterior
            if(results){
                resp.send(results);
            }
            else{
                resp.send({ msg: "No hay información", datos: "" })
            }
        } catch (error) {
            resp.sendStatus(500).json({ msg:"Ocurrió un error en el servidor" });
        }
    },
    createResult:async (req,resp)=>{
        const result = req.body;
        try {
            const newResult = await resultModel.create(result);
            resp.send(newResult);
        } catch (error) {
            resp.status(500).send(error);
        }
    }
}