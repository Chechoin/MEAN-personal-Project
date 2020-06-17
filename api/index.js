'use strict' //es necesario para usar algunas caracteristicas de JS

var mongoose = require('mongoose'); //Cargar libreria
var app = require('./app');
var port = 3800;

// Conexión DataBase
mongoose.Promise = global.Promise; //Para conetarse a mongodb
console.log("Llegue aqui");
//mongoose.connect('mongodb://localhost:27017/curso_mean_social')//,{useMongoClient: true}) 
mongoose.connect('mongodb://database/curso_mean_social')//,{useMongoClient: true}) 
        .then(() => {
            console.log("La conexión a la base de datos curso_mean_social se ha realizado correctamente");

            //Crear servidor
            app.listen(port, ()=>{
                console.log("Servidor corriendo en http://localhost:3800");
            });

        })
        .catch(err => console.log(err));

//Se hará then cuando se conecte y Catch para cuando no se conecte
//Es necesario lanzar el fichero index.js desde la consola

/*
// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

// Get our API routes
const api = require('./routers/api');

const app = express();

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Set our api routes
app.use('/', api);

// _Get port from environment and store in Express.
const port = process.env.PORT || '3800';
app.set('port', port);

// _Create HTTP server._
const server = http.createServer(app);

//Listen on provided port, on all network interfaces.

server.listen(port, () => console.log(`API running on localhost:${port}`));
*/