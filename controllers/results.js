const resultModel = require("../models/result");
const mongo = require('mongoose');

module.exports = {
    allResultsByEjercicio: async (req,resp)=>{
        const {id_ejercicio, fecha, hora} = req.body;
        const objectId = mongo.Types.ObjectId(id_ejercicio);
        try {
            const results = await resultModel.findOne({id_ejercicio: objectId, fecha: fecha, hora: hora});

            if(results){
                resp.send(results);
            }
            else{
                resp.send({ msg: "No hay información", datos: "" })
            }
        } catch (error) {
            resp.status(500).json({ msg:"Ocurrió un error en el servidor" });
        }
    },
    createResult:async (req,resp)=>{
        const result = req.body;
        try {
            const newResult = await resultModel.create(result);
            resp.status(201).send(newResult);
        } catch (error) {
            resp.status(500).send(error);
        }
    }
}