'use strict' //es necesario para usar algunas caracteristicas de JS

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = Schema({
    text: String,
    file: String,
    created_at: String,
    user: {type: Schema.ObjectId, ref:'User'}
});

//Exportar
module.exports = mongoose.model('Publication',PublicationSchema);