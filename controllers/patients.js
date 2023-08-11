const patientModel = require("../models/patient");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");
const bcrypt = require('bcrypt');

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
        try {
            const { cedula, password } = req.body;
            const entrada = req.body;
            const saltRounds = 10;

            if (password) {
                bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
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
            resp
                .status(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    getPatientbyId: async(req, resp) => {
        const { id_patient } = req.body;
        try {
            console.log("id_patient: " + id_patient);
            const patients = await patientModel.findOne({ _id: id_patient });
            resp.send(patients);
        } catch (error) {
            resp.sendStatus(500).send({ msg: "ocurrio un error en el servidor" });
        }
    },
    getPatientbyCc: async(req, resp) => {
        const { cedula } = req.body;
        try {
            console.log("cedula: " + cedula);
            const patients = await patientModel.findOne({ cedula: cedula });
            resp.send(patients);
        } catch (error) {
            resp.sendStatus(500).send({ msg: "ocurrio un error en el servidor" });
        }
    },
    getPatientbyUser: async(req, resp) => {
        const { id_user } = req.body;
        try {
            console.log("id_user: " + id_user);
            const patients = await patientModel.find({ id_user: id_user });
            resp.send(patients);
        } catch (error) {
            resp.sendStatus(500).send({ msg: "ocurrio un error en el servidor" });
        }
    },
    authenticatePatient: function(req, res) {
        const { cedula, password } = req.body;
        patientModel.findOne({ cedula: cedula }, function(err, user) {
            console.log(patientModel);
            if (err) {
                res.status(500).json('Error del servidor');
            } else if (!user) {
                res.status(401).json('Usuario incorrecto');
                console.error('Usuario incorrecto');
            } else {
                user.isCorrectPassword(password, function(err, same) {
                    if (err) {
                        res.status(500).json('Error del servidor');
                    } else if (!same) {
                        console.error('Contraseña incorrecta');
                        res.status(401).json('Contraseña incorrecta');
                    } else {
                        console.log(cedula);
                        console.log("Datos usuario:");
                        console.log(user);
                        // Issue token
                        const payload = { cedula };
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '3h'
                        });
                        res.status(200).json({ token: token, user: user });

                    }
                });
            }
        });
    }
}