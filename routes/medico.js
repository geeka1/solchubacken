var express = require('express');
var app = express();
var mdAutenticacion = require('../middlewares/autenticacion');
var bcrypt = require('bcryptjs');
var Medico = require('../models/medico');


// ==========================================
// Obtener todos los medicos
// ==========================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(3)
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al listar medicos',
                        errors: err
                    });
                }
                Medico.count({}, (err, conteo) => {
                    // Si no hay errores...
                    res.status(200).json({
                        ok: true,
                        mensaje: 'Get de medicos',
                        medicos: medicos,
                        total: conteo
                    });

                });

            });

});

// ==========================================
// Crear medico - POST
// ==========================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    // Esto funciona gracias al body parser
    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear medico en BD',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            mensaje: 'Datos medico guardado',
            medico: medicoGuardado
        });

    });

    res.status(200).json({
        ok: true,
        body: body,
        mensaje: 'Post de medicos!!!'
    });

});

// ==========================================
// Actualizar medico - POST
// ==========================================
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //Verifico que el id exista
    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id: ' + id + ' no existe',
                errors: { message: 'No existe medico con ese id' }

            });
        }
        //Actualizo el medico
        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });
        });
    });
});

// ==========================================
// DELETE - Borrar usuario por ID
// ==========================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err

            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id: ' + id + ' no existe',
                errors: { message: 'El medico con el id: ' + id + ' no existe' }

            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });
});


module.exports = app;