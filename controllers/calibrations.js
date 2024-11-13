const calibrationModel = require("../models/calibration");
const https = require('https');

module.exports = {
    allCalibrations: async (req,resp)=>{
        try {
            const results = await calibrationModel.find();
            resp.send(results);
        } catch (error) {
            resp.status(500).send({msg:"Ocurrió un error en el servidor. Por favor intente más tarde."});
        }
    },
    createCalibration:async (req,resp)=>{
        const result = req.body;
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
            .send({msg:"Ocurrió un error en el servidor. Por favor intente más tarde."});
        }
    },
    verifyConnection: (req, resp) => {
        const serverUrl = 'https://server.ubicu.co';

        const options = {
            method: 'HEAD', // Realiza una solicitud HEAD para verificar la existencia del servidor
        };

        const request = https.request(serverUrl, options, (response) => {
            if (response.statusCode === 200) {
                resp.send({ message: 'Conexión exitosa.' });
            } else {
                resp.status(500).send('Fallo la conexión al servidor.');
            }
        });

        request.on('error', (error) => {
            resp.status(500).send({ msg: 'No se pudo conectar al servidor.' });
        });

        request.end();
    }
}