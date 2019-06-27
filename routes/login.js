var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');


app.post('/', (req, res) => {

    var body = req.body;
    //verifico si ya existe un usuario con ese correo electronico

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        // if (!usuarioDB) {
        //     return res.status(400).json({
        //         ok: false,
        //         mensaje: 'Credenciales incorrectas - email',
        //         errors: err

        //     });
        // }
        //Verifico la contrasena, regresa true or false
        // if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
        //     //Si no machean las credenciales
        //     return res.status(400).json({
        //         ok: false,
        //         mensaje: 'Credenciales incorrectas - password',
        //         errors: err
        //     });
        // }
        // Crear un token!!
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id

        });

    });

});

module.exports = app;