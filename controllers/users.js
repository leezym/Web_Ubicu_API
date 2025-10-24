const userModel = require("../models/user");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");
const bcrypt = require('bcrypt');

const secret = 'mysecretstotoken';

module.exports = {
    createUser: async (req, resp) => {
        const user = req.body;
        try {
            const existingUser = await userModel.findOne({ cedula: user.cedula });
    
            if (existingUser) {
                return resp.status(400).json({ msg: 'El usuario ya existe' });
            }
    
            const newUser = await userModel.create(user);
            resp.status(201).send(newUser);
        } catch (error) {
            resp.status(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updateUser: async(req, resp) => {
        const { _id } = req.body;
        const entrada = req.body;
        try {
            const userUpdate = await userModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (userUpdate) {
                resp.send({ msg: 'Documento actualizado exitosamente' });
            } else {
                resp.status(404).send({ msg: 'Documento no encontrado' });
            }
        } catch (error) {
            resp.status(500).send({ msg: "Ocurrió un error en el servidor" });
        }
    },
    authenticateUser: async (req, res) => {
        const { cedula, password } = req.body;
        try {
            const user = await userModel.findOne({ cedula: cedula });
    
            if (!user) {
                return res.status(400).json({ msg: 'Usuario no existe' });
            }
    
            const same = await user.isCorrectPassword(password);
    
            if (!same) {
                return res.status(400).json({ msg: 'Contraseña incorrecta' });
            }
    
            const payload = { cedula };
            const token = jwt.sign(payload, secret, {
                expiresIn: '3h'
            });
    
            res.status(200).json({ token: token, user: user });
        } catch (err) {
            res.status(500).json({ msg: 'Ocurrió un error en el servidor' });
        }
    },
    checkToken: function(req, resp) {
        resp.sendStatus(200);
    },
    getUserbyId: async(req, resp) => {
        const { id_user } = req.body;
        try {
            const users = await userModel.findById(id_user);
            resp.send(users);
        } catch (error) {
            resp.sendStatus(500).json({ msg: "Ocurrió un error en el servidor" });
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
