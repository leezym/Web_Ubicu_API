const patientModel = require("../models/patient");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");
const bcryptjs = require('bcryptjs');
const mongo = require('mongoose');

const secret = 'mysecretstotoken';

module.exports = {
    createPatient: async(req, resp) => {
        const patient = req.body;
        try {
            const existingPatient = await patientModel.findOne({ cedula: patient.cedula });
    
            if (existingPatient) {
                return resp.status(400).json({ msg: 'El usuario ya existe' });
            }

            const newPatient = await patientModel.create(patient);
            resp.status(201).send(newPatient);
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updatePatient: async(req, resp) => {
        const { cedula, password } = req.body;
        const entrada = req.body;
        const saltRounds = 10;
        try {

            if (password) {
                bcryptjs.hash(password, saltRounds, async (err, hashedPassword) => {
                    if (err) {
                        resp.status(500).send({ msg: 'Error al encriptar la contraseña' });
                    } else {
                        try {
                            entrada.password = hashedPassword;
                            const patientUpdate = await patientModel.findOneAndUpdate({ cedula: cedula }, entrada, { new: true });
                            if (patientUpdate) {
                                resp.send({ msg: 'Documento actualizado exitosamente' });
                            } else {
                                resp.status(404).send({ msg: 'Documento no encontrado' });
                            }
    
                        } catch (error) {
                            resp
                                .status(500)
                                .send({ msg: "Error al actualizar el documento" });
                        }
                    }
                });            
            }
            else{
                resp.send({ msg: 'Contraseña vacía' });
            }

        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    getPatientbyId: async(req, resp) => {
        const { id_patient } = req.body;
        try {
            const patients = await patientModel.findById(id_patient);
            resp.send(patients);
        } catch (error) {
            resp.sendStatus(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    getPatientbyCc: async(req, resp) => {
        const { cedula } = req.body;
        try {
            const patients = await patientModel.findOne({ cedula: cedula });
            resp.send(patients);
        } catch (error) {
            resp.sendStatus(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    getPatientbyUser: async(req, resp) => {
        const { id_user } = req.body;
        const objectId = mongo.Types.ObjectId(id_user);
        try {
            const patients = await patientModel.find({ id_user: objectId });
            resp.send(patients);
        } catch (error) {
            resp.sendStatus(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    authenticatePatient: async(req, res) => {
        const { cedula, password } = req.body;
        try {
            const user = await patientModel.findOne({ cedula: cedula });
            if (!user) {
                return res.status(401).json({msg: 'Usuario incorrecto'});
            }
    
            const same = await user.isCorrectPassword(password);
            if (!same) {
                return res.status(401).json({msg: 'Contraseña incorrecta'});
            }
    
            // Issue token
            const payload = { cedula };
            const token = jwt.sign(payload, secret, { expiresIn: '3h' });
            res.status(200).json({ token: token, user: user });
        } catch (err) {
            res.status(500).json({msg: 'Error del servidor'});
        }
    }    
}