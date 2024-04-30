const resultModel = require("../models/result");
const ejercicioModel = require("../models/ejercicio");

module.exports = {
    allResults: async (req,resp)=>{
        try {
            const results = await resultModel.find();
            resp.send(results);
        } catch (error) {
            resp.status(500).send({msg:"Ocurrió un error en el servidor"});
        }
    },
    allResultsByUser: async (req,resp)=>{
        try {
            const {id} = req.body;
            console.log(id);
            const ejercicio = await ejercicioModel.findOne({id_user:id}).exec();
            console.log(ejercicio);
            const results = await resultModel.find({id_ejercicio:ejercicio._id});
            resp.send(results);
        } catch (error) {
            console.log(error);
            resp.senStatus(500).send({msg:"Ocurrió un error en el servidor"});
        }
    },
    allResultsByEjercicio: async (req,resp)=>{
        try {
            const {id_ejercicio, fecha, hora} = req.body;
            console.log("id_ejercicio: ", id_ejercicio);
            console.log("fecha: ", fecha);
            console.log("hora: ", hora);
            const results = await resultModel.findOne({id_ejercicio:id_ejercicio, fecha:fecha, hora:hora});
            //agrego el nombre del ejercicio anterior
            console.log("results: ",results);
            if(results){
                resp.send(results);
            }
            else{
                resp.send({msg: "No hay información", datos: ""})
            }

        } catch (error) {
            console.log(error);
            resp.sendStatus(500).send({msg:"Ocurrió un error en el servidor"});
        }
    },
    createResult:async (req,resp)=>{
        const result = req.body;
        try {
            const newResult = await resultModel.create(result);
            resp.send(newResult);
        } catch (error) {
            console.log(error)
            resp
            .status(500)
            .send(error);
        }
    }
}