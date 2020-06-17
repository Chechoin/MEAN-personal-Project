'use strict' //es necesario para usar algunas caracteristicas de JS

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FollowSchema = Schema({
    text: String,
    created_at: String,
    emiter: {type: Schema.ObjectId ,ref:'User'},
    receiver: {type: Schema.ObjectId ,ref:'User'}
});

module.exports = mongoose.model('Message',MessageSchema);