const userModel = require("../models/user");
const jwt = require('jsonwebtoken');
const res = require("express/lib/response");

const secret = 'mysecretstotoken';

module.exports = {
    allUsers: async(req, resp) => {
        try {
            const users = await userModel.find();
            resp.send(users);
        } catch (error) {
            resp.sendStatus(500).send({ msg: "ocurrio un error en el servidor" });
        }
    },
    createUser: async(req, resp) => {
        const usuario = req.body;
        try {
            const user = await userModel.create(usuario);
            resp.send(user);

        } catch (error) {
            console.log(error);
            resp
                .sendStatus(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    updateUser: async(req, resp) => {
        const { cedula } = req.body;
        try {
            const entrada = req.body;
            const userUpdate = await userModel.findOneAndUpdate({ cedula: cedula }, entrada);
            resp.send(userUpdate);
        } catch (error) {
            resp
                .sendStatus(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    deleteUser: async(req, resp) => {
        const { cedula } = req.body;
        try {
            const userDelete = await userModel.deleteOne({ cedula: cedula });
            resp.send(userDelete);
        } catch (error) {
            resp
                .sendStatus(500)
                .send({ msg: "ocurrio un error en el servidor" });
        }
    },
    authenticateUser: function(req, res) {
        const { cedula, password } = req.body;
        userModel.findOne({ cedula: cedula }, function(err, user) {
            console.log(userModel);
            if (err) {
                console.error(err);
                res.status(500).json({
                    error: 'Internal error please try again 1'
                });
            } else if (!user) {
                res.status(401).json({
                    error: 'Incorrect email or password 1'
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
                            error: 'Incorrect email or password'
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
                        console.log(token);
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
            resp.sendStatus(500).send({ msg: "ocurrio un error en el servidor" });
        }
    }
}