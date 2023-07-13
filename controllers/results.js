const resultModel = require("../models/result");
const ejercicioModel = require("../models/ejercicio");

module.exports = {
    allResults: async (req,resp)=>{
        try {
            const results = await resultModel.find();
            resp.send(results);
        } catch (error) {
            resp.status(500).send({msg:"ocurrio un error en el servidor"});
        }
    },
    allResultsByUser: async (req,resp)=>{
        try {
            const {id} = req.body;
            console.log(id);
            const ejercicio = await ejercicioModel.findOne({id_user:id}).exec();
            console.log(ejercicio);
            const results = await resultModel.find({id_ejercicio:ejercicio._id});
            //agrego el nombre del jercicio anterior
           
            
           /* ejercicios.forEach((element,key) => {
                element.forEach((ele) => {
                 console.log("element -> "+ ele);
                /*if(element['type'] == "cicloActivo"){
                    ejercicioModel.findOne({ element['id_user'] },function (err, ejercicioAnterior) {
                    
                    if (err) {
                        console.error(err);
                        res.status(500).json({
                        error: 'Internal error please try again'
                        }); 
                    }else{
                        element['anterior'] = ejercicioAnterior.nombre;
                    }
                });
                } 
                 });
            });*/

            resp.send(results);
        } catch (error) {
            console.log(error);
            resp.senStatus(500).send({msg:"ocurrio un error en el servidor"});
        }
    },
    allResultsByEjercicio: async (req,resp)=>{
        try {
            const {id_ejercicio, fecha, hora} = req.body;
            console.log("id_ejercicio: ", id_ejercicio);
            console.log("fecha: ", fecha);
            console.log("hora: ", hora);
            const results = await resultModel.findOne({id_ejercicio:id_ejercicio, fecha:fecha, hora:hora});
            //agrego el nombre del jercicio anterior
            console.log("results: ",results);
            if(results){
                resp.send(results);
            }
            else{
                resp.send({msg: "No hay información", datos: ""})
            }

        } catch (error) {
            console.log(error);
            resp.sendStatus(500).send({msg:"ocurrio un error en el servidor"});
        }
    },
    createResult:async (req,resp)=>{
        const result = req.body;
        try {
            const resultado = await resultModel.create(result);
            resp.send(resultado);
        } catch (error) {
            console.log(error)
            resp
            .status(500)
            .send(error);
        }
    },
    updateResult:async (req,resp)=>{
        try {
            const {id} = req.body;
            const entrada = req.body;
            const resultUpdate = await resultModel.findOneAndUpdate({_id:id},entrada);
            resp.send(resultUpdate);
        } catch (error) {
            resp
            .status(500)
            .send({msg:"ocurrio un error en el servidor"});
        }
    },
    deleteResult:async (req,resp)=>{
        try {
            const {id} = req.body;
            const resultDelete = await resultModel.deleteOne({_id:id},(error)=>{
                console.log(error);
            });
            resp.send(resultDelete);
        } catch (error) {
            resp
            .status(500)
            .send({msg:"ocurrio un error en el servidor"});
        }
    }
}