var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var bcrypt = require('bcryptjs');
var Hospital = require('../models/hospital');


// ==========================================
// Obtener todos los usuarios
// ==========================================

app.get('/', (req, res, next) => {

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al listar hospitales',
                        errors: err
                    });
                }
                // Si no hay errores...
                res.status(200).json({
                    ok: true,
                    mensaje: 'Get de hospitales',
                    hospitales: hospitales,
                    //usuario: req.hospitales.usuario._id
                });

            });

});

// ==========================================
// Crear hospital - POST
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    // Esto funciona gracias al body parser
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id

    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear hospital en BD',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });

    res.status(200).json({
        ok: true,
        body: body,
        mensaje: 'Post de hospitales!!!'
    });

});

// ==========================================
// Actualizar hospital - POST
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //Verifico que el id exista
    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + ' no existe',
                errors: { message: 'No existe usuario con ese id' }

            });
        }

        //Actualizo el hospital
        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });

            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });
    });
});

// ==========================================
// DELETE - Borrar usuario por ID
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err

            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id: ' + id + ' no existe',
                errors: { message: 'El hospital con el id: ' + id + ' no existe' }

            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });
});


module.exports = app;