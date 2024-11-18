const userModel = require("../models/user");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const secret = 'mysecretstotoken';
const saltRounds = 10;

module.exports = {
    createUser: async (req, res) => {
        const user = req.body;
        try {
            const existingUser = await userModel.findOne({ cedula: user.cedula });
    
            if (existingUser) {
                return res.status(400).json({ msg: 'El usuario ya existe' });
            }

            try {
                const hashedPassword = await bcrypt.hash(user.password, saltRounds);
                user.password = hashedPassword;
                const newUser = await userModel.create(user);
                res.status(201).json(newUser);
            } catch (hashError) {
                res.status(500).json({ msg: 'Error al encriptar la contraseña' });
            }
        } catch (error) {
            res.status(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updateUser: async(req, res) => {
        const { _id } = req.body;
        const entrada = req.body;
        try {
            const userUpdate = await userModel.findByIdAndUpdate(_id, entrada, { new: true });
            if (userUpdate) {
                res.json({ msg: 'Documento actualizado exitosamente' });
            } else {
                res.status(404).json({ msg: 'Documento no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    authenticateUser: async (req, res) => {
        const { cedula, password } = req.body;
        try {
            const user = await userModel.findOne({ cedula: cedula });
    
            if (!user) {
                return res.status(400).json({ msg: 'Usuario incorrecto' });
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
    checkToken: function(req, res) {
        res.jsonStatus(200);
    },
    getUserbyId: async(req, res) => {
        const { id_user } = req.body;
        try {
            const users = await userModel.findById(id_user);
            res.json(users);
        } catch (error) {
            res.jsonStatus(500).json({ msg: "Ocurrió un error en el servidor" });
        }
    },
    updatePassword: async (req, res) => {
        const { _id, password_actual, password, password_nueva, repeat_password_nueva } = req.body;
      
        try {
            const passwordMatches = await bcrypt.compare(password_actual, password);
        
            if (!passwordMatches) {
                res.json({ msg: 'La contraseña actual no es correcta' });
            }
        
            if (password_nueva !== repeat_password_nueva) {
                res.json({ msg: 'Las nuevas contraseñas no coinciden' });
            }
      
            bcrypt.hash(password_nueva, saltRounds, async (err, hashedPassword) => {
                if (err) {
                return res.status(500).json({ msg: 'Error al encriptar la contraseña' });
                }
        
                try {
                    const userUpdate = await userModel.findByIdAndUpdate(_id, { password: hashedPassword }, { new: true });
                
                    if (userUpdate) {
                        return res.json({ msg: 'Contraseña actualizada exitosamente', password: hashedPassword });
                    } else {
                        return res.status(404).json({ msg: 'Documento no encontrado' });                        
                    }
                } catch (error) {
                return res.status(500).json({ msg: 'Error al actualizar el documento' });
                }
            });
        } catch (error) {
          return res.status(500).json({ msg: 'Ocurrió un error en el servidor' });
        }
    },
    recoveryPassword: async (req, res) => {
        const { cedula } = req.body;
        try {
            const user = await userModel.findOne({ cedula: cedula });

            if (!user) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }

            // Generar token único para recuperación de contraseña
            const token = jwt.sign(
            { 
                id: user._id, 
                type: 'password_reset',
                iat: Date.now()
            }, 
            secret, 
            { expiresIn: '1h' }
        );

            // Configurar el transporte de correo
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ubicu.sistema@gmail.com',
                    pass: 'xetz iduj ijio mnct'
                }
            });

            // Enviar el correo
            let info = await transporter.jsonMail({
                from: '"UBICU: Fisioterapia Respiratoria" <ubicu.sistema@gmail.com>',
                to: user.email,
                subject: "Recuperación de contraseña",
                text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: 
                       https://www.ubicu.co/#/RestablecerContrasena/${token}
                       Este enlace expirará en 1 hora.`,
                html: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                       <a href="https://www.ubicu.co/#/RestablecerContrasena/${token}">Restablecer contraseña</a>
                       <p>Este enlace expirará en 1 hora.</p>`,
                headers: {
                    'X-Priority': '1',
                    'X-MSMail-Priority': 'High',
                    'Importance': 'high'
                }
            });

            res.status(200).json({ msg: 'Se ha enviado un correo con instrucciones para recuperar tu contraseña.' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ msg: 'Ocurrió un error en el servidor' });
        }
    },
    restablishPassword: async (req, res) => {
        const { token, nuevaContrasena } = req.body;
        try {
            const decoded = jwt.verify(token, secret);
            
            // Verificar que es un token de restablecimiento de contraseña
            if (decoded.type !== 'password_reset') {
                return res.status(400).json({ msg: 'Token inválido' });
            }
    
            const user = await userModel.findById(decoded.id);
            if (!user) {
                return res.status(400).json({ msg: 'Usuario no encontrado' });
            }
    
            // Hashear la nueva contraseña
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(nuevaContrasena, salt);
            await user.save();
    
            res.status(200).json({ msg: 'Contraseña actualizada exitosamente' });
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(400).json({ msg: 'Token expirado' });
            }
            res.status(500).json({ msg: 'Ocurrió un error en el servidor' });
        }
    }
}