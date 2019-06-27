var express = require('express');
var app = express();
var fileUpload = require('express-fileupload');
var fs = require('fs');
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// Middleware
app.use(fileUpload());



app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message: 'Tipo de coleccion no es valida' }
        });
    }

    if (!req.files) {
        //devuelvo el error
        return res.status(400).json({
            ok: false,
            mensaje: 'Error al subir imagen',
            errors: { message: 'Seleccione una imagen' }
        });

    }
    // Si esta todo bien trabajo con la imagen
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Solo aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    // array.indexOf busca en el arreglo
    // si devuelve -1 es porque el valor no esta en el arreglo
    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Las extensiones valiadas son: ' + extensionesValidas.join(', ') }
        });
    }
    // Nombre de archivo personalizado
    //objeto_id-random.png

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;


    // muevo el archivo del temp a un path especifico
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });

        }
        subirPorTipo(tipo, id, nombreArchivo, res);
        res.status(200).json({
            ok: true,
            mensaje: 'Archivo Movido correctamente',
            nombreCortado: nombreCortado,
            extensionArchivo: extensionArchivo
        });

    });

});

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                //con esto remueve la imagen
                fs.unlink(pathViejo);
            }
            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });
        });

    }
    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                //con esto remueve la imagen
                fs.unlink(pathViejo);
            }
            medico.img = nombreArchivo;

            medico.save((err, medicoActualizado) => {

                medicoActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            });
        });

    }


    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                //con esto remueve la imagen
                fs.unlink(pathViejo);
            }
            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActualizado) => {
                hospitalActualizado.password = ':)';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });
            });
        });

    }

}



module.exports = app;