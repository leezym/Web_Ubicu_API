const patientModel = require("../models/patient");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");
const bcrypt = require('bcrypt');
const mongo = require('mongoose');

const secret = 'mysecretstotoken';
const saltRounds = 10;

module.exports = {
    createPatient: async (req, res) => {
        const patient = req.body;
        try {
            const existingPatient = await patientModel.findOne({ cedula: patient.cedula });
    
            if (existingPatient) {
                return res.status(400).json({ msg: 'La cédula ya está registrada.' });
            }
    
            try {
                const hashedPassword = await bcrypt.hash(patient.password, saltRounds);
                patient.password = hashedPassword;
                const newPatient = await patientModel.create(patient);
                res.status(200).json(newPatient);
            } catch (hashError) {
                res.status(500).json({ msg: 'Error al encriptar la contraseña.' });
            }            
        } catch (error) {
            res.status(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    updatePatient: async (req, res) => {
        const { cedula, password } = req.body;
        const entrada = { ...req.body };
    
        try {
            const existingPatient = await patientModel.findOne({ cedula, _id: { $ne: req.body._id } });
            if (existingPatient) {
                return res.status(400).json({ msg: 'La cédula ya está registrada en otro paciente. No se puede modificar.' });
            }
    
            if (password) {
                try {
                    const hashedPassword = await bcrypt.hash(password, saltRounds);
                    entrada.password = hashedPassword;
                } catch (err) {
                    return res.status(500).json({ msg: 'Error al encriptar la contraseña.' });
                }
            }
    
            const patientUpdate = await patientModel.findOneAndUpdate({ cedula: cedula }, entrada, { new: true });
            if (patientUpdate) {
                res.json({ msg: 'Documento actualizado exitosamente.' });
            } else {
                res.status(404).json({ msg: 'Documento no encontrado.' });
            }
        } catch (error) {
            res.status(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    getPatientbyId: async(req, res) => {
        const { id_patient } = req.body;
        try {
            const patients = await patientModel.findById(id_patient);
            res.json(patients);
        } catch (error) {
            res.jsonStatus(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    getPatientbyCc: async(req, res) => {
        const { cedula } = req.body;
        try {
            const patients = await patientModel.findOne({ cedula: cedula });
            res.json(patients);
        } catch (error) {
            res.jsonStatus(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    getPatientbyUser: async(req, res) => {
        const { id_user } = req.body;
        const objectId = mongo.Types.ObjectId(id_user);
        try {
            const patients = await patientModel.find({ id_user: objectId });
            res.json(patients);
        } catch (error) {
            res.jsonStatus(500).json({ msg: "Ocurrió un error en el servidor. Por favor intente más tarde." });
        }
    },
    authenticatePatient: async(req, res) => {
        const { cedula, password } = req.body;
        try {
            const user = await patientModel.findOne({ cedula: cedula });
            if (!user) {
                return res.status(401).json('Usuario incorrecto');
            }
    
            const same = await user.isCorrectPassword(password);
            if (!same) {
                return res.status(401).json('Contraseña incorrecta');
            }
    
            // Issue token
            const payload = { cedula };
            const token = jwt.sign(payload, secret, { expiresIn: '3h'});
            res.status(200).json({ token: token, user: user });
        } catch (err) {
            res.status(500).json('Error del servidor');
        }
    }    
}