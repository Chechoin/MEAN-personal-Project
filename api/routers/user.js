'use strict' //es necesario para usar algunas caracteristicas de JS

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router(); //para usar los métodos get, post, put, delete,...
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'})

api.get('/home',UserController.home);
//api.get('/pruebas',md_auth.ensureAuth,UserController.pruebas); // el segundo parametro es el middleware
api.get('/pruebas',UserController.pruebas);
api.post('/pruebas',UserController.pruebas); // el segundo parametro es el middleware
api.post('/register',UserController.saveUser);
api.post('/login',UserController.loginUser);
api.get('/user/:id',md_auth.ensureAuth,UserController.getUser); // el segundo parametro es el middleware
api.get('/users/:page?',md_auth.ensureAuth,UserController.getUsers); // el segundo parametro es el middleware
api.put('/update-user/:id',md_auth.ensureAuth,UserController.updateUser); // el segundo parametro es el middleware
api.post('/upload-image-user/:id',[md_auth.ensureAuth,md_upload],UserController.uploadImage); // el segundo parametro es el middleware
api.get('/get-image-user/:imageFile',UserController.getImageFile);

module.exports = api;
