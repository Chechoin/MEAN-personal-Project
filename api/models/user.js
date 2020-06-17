'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String
});

//Exportar 
module.exports = mongoose.model('User',UserSchema); //Se hace para guardar en la base de datos la estructura
