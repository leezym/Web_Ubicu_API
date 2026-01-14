const resultModel = require("../models/result");
const mongo = require('mongoose');

function validateRequiredFields(body, requiredFields) {
    for (let field of requiredFields) {
        if (!body[field] || body[field] === '') {
            return false;
        }
    }
    return true;
}

module.exports = {
    allResultsByEjercicio: async (req,resp)=>{
        if (!validateRequiredFields(req.body, ['id_ejercicio', 'fecha', 'hora'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
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
        const requiredFields = ['id_ejercicio', 'fecha', 'hora', 'datos'];
        if (!validateRequiredFields(req.body, requiredFields)) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
        const result = req.body;
        try {
            const newResult = await resultModel.create(result);
            resp.status(201).send(newResult);
        } catch (error) {
            resp.status(500).json({ msg:"Ocurrió un error en el servidor" });
        }
    },
    allResultsByDate: async (req,resp)=>{
        if (!validateRequiredFields(req.body, ['id_ejercicio'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
        const { id_ejercicio } = req.body;
        const objectId = mongo.Types.ObjectId(id_ejercicio);
        try {
            const results = await resultModel.find({ id_ejercicio: objectId });
            resp.send(results);
        } catch (error) {
            resp.status(500).json({ msg:"Ocurrió un error en el servidor" });
        }
    }
}