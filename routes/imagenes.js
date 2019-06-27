var express = require('express');
var app = express();
//este path ya viene con node, no hace falta el npm install
const path = require('path');

const fs = require('fs');


app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    // verifico si el path es valido con el fs
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }

});

module.exports = app;