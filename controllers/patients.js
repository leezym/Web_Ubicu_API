const patientModel = require("../models/patient");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");

const secret = 'mysecretstotoken';

module.exports = {
    allPatients: async(req, resp) => {
        try {
            const patients = await patientModel.find();
            resp.send(patients);
        } catch (error) {
            resp.sendStatus(500).send({ msg: "ocurrio un error en el servidor" });
        }
    },
    createPatient: async(req, resp) => {
        const usuario = req.body;
        try {
            const patient = await patientModel.create(usuario);
            resp.send(patient);

        } catch (error) {
            console.log(error);
            resp
                .sendStatus(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    updatePatient: async(req, resp) => {
        const { cedula } = req.body;
        try {
            const entrada = req.body;
            const patientUpdate = await patientModel.findOneAndUpdate({ cedula: cedula }, entrada);
            resp.send(patientUpdate);
        } catch (error) {
            resp
                .sendStatus(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    deletePatient: async(req, resp) => {
        const { cedula } = req.body;
        try {
            const patientDelete = await patientModel.deleteOne({ cedula: cedula });
            resp.send(patientDelete);
        } catch (error) {
            resp
                .sendStatus(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    getPatientbyId: async(req, resp) => {
        const { id_patient } = req.body;
        try {
            console.log("id_patient: " + id_patient);
            const patients = await patientModel.find({ _id: id_patient });
            resp.send(patients[0]);
            console.log(patients[0]);
        } catch (error) {
            resp.sendStatus(500).send({ msg: "ocurrio un error en el servidor" });
        }
    }
}