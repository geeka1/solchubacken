var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


//=======================================
// Busqueda por coleccion
//=======================================

// localhost:3000/busqueda/coleccion/medico/fernando
app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {

        case 'usuario':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los criterios de busqueda solo son: usuarios, medicos y hospitalees',
                error: { message: 'Tipos de tabla/coleccion no validos' }
            });

    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            //javascript 'Propiedades de objeto computadas' [tabla],
            //para que muestr el valor de tabla y no la pablabra tabla
            [tabla]: data
        });
    });
});

//=======================================
// Busqueda general
//=======================================

app.get('/todo/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');
    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});


function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Error al cargar hospitales', err);

                } else {
                    resolve(hospitales);
                }
            });
    });

}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre')
            .exec((err, medicos) => {
                if (err) {
                    reject('Error al cargar hospitales', err);

                } else {
                    resolve(medicos);
                }
            });
    });

}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        //Aqui busco en 2 campos a la vez
        Usuario.find({}, 'nombre email rol')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuario', err);
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = app;