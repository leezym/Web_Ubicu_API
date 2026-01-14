const patientModel = require("../models/patient");
const exerciseDateModel = require("../models/exercise_date");
const rewardModel = require("../models/reward");
const customizationModel = require("../models/customization");
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const mongo = require('mongoose');

const secret = 'mysecretstotoken';

function validateRequiredFields(body, requiredFields) {
    for (let field of requiredFields) {
        if (!body[field] || body[field] === '') {
            return false;
        }
    }
    return true;
}

module.exports = {
    createPatient: async(req, resp) => {
        const requiredFields = ['nombre', 'cedula', 'telefono', 'email', 'edad', 'sexo', 'peso', 'altura', 'direccion', 'ciudad', 'password', 'id_user'];
        if (!validateRequiredFields(req.body, requiredFields)) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
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
    createPatientWithDefaults: async (req, res) => {
        const requiredFields = ['nombre', 'cedula', 'telefono', 'email', 'edad', 'sexo', 'peso', 'altura', 'direccion', 'ciudad', 'password', 'id_user'];
        if (!validateRequiredFields(req.body, requiredFields)) {
            return res.status(400).send({ msg: "Faltan datos." });
        }
        const session = await mongo.startSession();
        session.startTransaction();

        try {
            const patientData = req.body;

            const existingPatient = await patientModel.findOne(
                { cedula: patientData.cedula }
            ).session(session);

            if (existingPatient) {
                throw new Error('El usuario ya existe');
            }

            const patient = await patientModel.create(
                [patientData],
                { session }
            );

            const patientId = patient[0]._id;

            await exerciseDateModel.create([{
                current_exercise_final_date: null,
                current_exercise_date: null,
                exercise_hour_array: null,
                id_patient: patientId
            }], { session });

            await rewardModel.create([{
                all_badges_array: "0,0,0,0,0,0,0;0,0,0,0,0,0,0;0,0,0,0,0,0,0;0,0,0,0,0,0,0;",
                session_reward: 0,
                day_reward: 0,
                total_reward: 0,
                total_series: 0,
                total_sessions: 0,
                total_days: 0,
                total_weeks: 0,
                id_patient: patientId
            }], { session });

            await customizationModel.create([{
                id_customization: 0,
                id_item_fondos_array: "0,-1,-1,-1,-1",
                id_item_figuras_array: "0,-1,-1,-1,-1",
                all_fondos_items_array: "1,1,1;0,0,0;0,0,0;0,0,0;0,0,0;",
                all_figuras_items_array: "1,1,1;0,0,0;0,0,0;0,0,0;0,0,0;",
                id_patient: patientId
            }], { session });

            await session.commitTransaction();
            session.endSession();

            res.status(201).json(patient[0]);

        } catch (error) {
            await session.abortTransaction();
            session.endSession();

            res.status(500).json({
                msg: error.message || 'Error creando paciente'
            });
        }
    },
    updatePatient: async(req, resp) => {
        if (!validateRequiredFields(req.body, ['cedula', 'password'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
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
        if (!validateRequiredFields(req.body, ['id_patient'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
        const { id_patient } = req.body;
        try {
            const patients = await patientModel.findById(id_patient);
            resp.send(patients);
        } catch (error) {
            resp.sendStatus(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    getPatientbyCc: async(req, resp) => {
        if (!validateRequiredFields(req.body, ['cedula'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
        const { cedula } = req.body;
        try {
            const patients = await patientModel.findOne({ cedula: cedula });
            resp.send(patients);
        } catch (error) {
            resp.sendStatus(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    getPatientbyUser: async(req, resp) => {
        if (!validateRequiredFields(req.body, ['id_user'])) {
            return resp.status(400).send({ msg: "Faltan datos." });
        }
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
        if (!validateRequiredFields(req.body, ['cedula', 'password'])) {
            return res.status(400).send({ msg: "Faltan datos." });
        }
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