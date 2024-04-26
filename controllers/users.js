const userModel = require("../models/user");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");
const bcrypt = require('bcrypt');

const secret = 'mysecretstotoken';

module.exports = {
    allUsers: async(req, resp) => {
        try {
            const users = await userModel.find();
            resp.send(users);
        } catch (error) {
            resp.sendStatus(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    createUser: async (req, resp) => {
        const user = req.body;
        try {
            const existingUser = await userModel.findOne({ cedula: user.cedula });
    
            if (existingUser) {
                return resp.status(400).json({ msg: 'El usuario ya existe' });
            }
    
            const newUser = await userModel.create(user);
            resp.send(newUser);
        } catch (error) {
            console.log(error);
            resp.status(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updateUser: async(req, resp) => {
        try {
            const { _id } = req.body;
            const entrada = req.body;
            const userUpdate = await userModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (userUpdate) {
                resp.send({ msg: 'Documento actualizado exitosamente' });
            } else {
                resp.status(404).send({ msg: 'Documento no encontrado' });
            }
        } catch (error) {
            resp
                .status(500)
                .send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    authenticateUser: function(req, res) {
        const { cedula, password } = req.body;
        userModel.findOne({ cedula: cedula }, function(err, user) {
            console.log(userModel);
            console.log(err);
            if (err) {
                console.error(err);
                res.status(500).json({
                    error: 'Internal error please try again 1'
                });
            } else if (!user) {
                res.status(401).json({
                    error: 'Usuario incorrecto'
                });
                console.error(err);
            } else {
                user.isCorrectPassword(password, function(err, same) {
                    if (err) {
                        res.status(500).json({
                            error: 'Internal error please try again'
                        });
                    } else if (!same) {
                        res.status(401).json({
                            error: 'Contraseña incorrecta'
                        });
                    } else {
                        console.log(cedula);
                        console.log("Datos usuario:");
                        console.log(user);
                        // Issue token
                        const payload = { cedula };
                        const token = jwt.sign(payload, secret, {
                            expiresIn: '3h'
                        });
                        //res.cookie('token', token, { httpOnly: true }).sendStatus(200);
                        //res.send(user)
                        res.status(200).json({ token: token, user: user });
                        //res.status(200).json({token:token});
                        //res.sendStatus(200);

                    }
                });
            }
        });
    },
    checkToken: function(req, resp) {
        resp.sendStatus(200);
    },
    getUserbyId: async(req, resp) => {
        const { id_user } = req.body;
        try {
            console.log("id_user: " + id_user);
            const users = await userModel.find({ _id: id_user });
            resp.send(users[0]);
            console.log(users[0]);
        } catch (error) {
            resp.sendStatus(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updatePassword: async (req, resp) => {
        const { _id, password_actual, password, password_nueva, repeat_password_nueva } = req.body;
        const saltRounds = 10;
      
        try {
            const passwordMatches = await bcrypt.compare(password_actual, password);
        
            if (!passwordMatches) {
                resp.send({ msg: 'La contraseña actual no es correcta' });
            }
        
            if (password_nueva !== repeat_password_nueva) {
                resp.send({ msg: 'Las nuevas contraseñas no coinciden' });
            }
      
            bcrypt.hash(password_nueva, saltRounds, async (err, hashedPassword) => {
                if (err) {
                return resp.status(500).send({ msg: 'Error al encriptar la contraseña' });
                }
        
                try {
                    const userUpdate = await userModel.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true });
                
                    if (userUpdate) {
                        return resp.send({ msg: 'Contraseña actualizada exitosamente', password: hashedPassword });
                    } else {
                        return resp.status(404).send({ msg: 'Documento no encontrado' });                        
                    }
                } catch (error) {
                return resp.status(500).send({ msg: 'Error al actualizar el documento' });
                }
            });
        } catch (error) {
          return resp.status(500).send({ msg: 'Ocurrió un error en el servidor' });
        }
    }
}