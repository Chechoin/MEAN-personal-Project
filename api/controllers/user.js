'use strict' //es necesario para usar algunas caracteristicas de JS

var bcrypt= require('bcrypt-nodejs');// para cifrar contraseñas guardadas
var mongoosePaginate=require('mongoose-pagination');

var User = require('../models/user');//La primera letra en mayuscula para indicar que es un modelo
var jwt = require('../services/jwt');//importar para generar los token
var fs = require('fs');
var path = require('path');

// rutas

//métodos de prueba
function home(req,res){
    console.log("**********************");
    console.log("Alguien solicito /home");
    res.status(200).send({
        message: 'Hola mundo desde el servidor de NodeJS'
    });
}

function pruebas(req,res){
    console.log(req.body);
    res.status(200).send({
        message: 'Accion de pruebas en el servidor de NodeJS'
    });
}
//Registro de usuarios
function saveUser(req,res){
    var params = req.body;
    var user = new User(); //Crear instancia (objeto) de usuario

    if(params.name && params.surname && 
       params.nick && params.email   && params.password){
           
           user.name= params.name;
           user.surname= params.surname;
           user.nick= params.nick;
           user.email= params.email;
           user.role = 'ROLE_USER';
           user.image= null;

           const findEmail = new RegExp(user.email,"i");
           const findNick = new RegExp(user.nick,"i");

           //Evitar usuarios duplicados
           User.find({ $or: [
               {email: findEmail},
               {nick: findNick}
            ]}).exec((err,users) => {
                if(err) return res.status(500).send({messaage: 'Error en la petición de usuarios'})

                if(users && users.length >= 1){
                    return res.status(200).send({messaage: 'El usuario que intenta registrar ya existe!'});
                }
                
                else{
                    //Guardar hash de contraseña
                    
                     bcrypt.hash(params.password,null,null,(err,hash)=>{
                        user.password = hash;
                        user.save((err, userStored)=>{
                            if(err) return res.status(500).send({message:'Error al guardar el usuario'});
                            if(userStored){
                                res.status(200).send({user: userStored, params});
                            }else{
                                res.status(404).send({message: 'No se ha registrado el usuario'});
                            }
                        });
                    });//Callback, generar hash para la password
                }
            });

           
    }else{
        res.status(500).send({
            message: 'Envia todos los campos necesarios!'
        });
    }
}
//login
function loginUser(req,res){
    var params = req.body; //Aquí almacena los parametros enviados por post
    var email = params.email;
    var password = params.password;
    
    //Ahora buscar el email y contraseña en base de datos. El campo email coincide con la variable email creada en esta funcion
    User.findOne({email: email}, (err,user) => {
        if(err)return res.status(500).send({messaage: 'Error en la petición'});
        if(user){
            bcrypt.compare(password, user.password, (err, check) => {
                if(check){
                    if(params.gettoken){
                        //Devolver un token
                        //Generar un token
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    }
                    else{
                        //devolveer datos de usuario
                        user.password = undefined;
                        return res.status(200).send({user});
                    }
                    
                }
                else{
                    //devolver error
                    return res.status(404).send({messaage: 'El usuario no se ha podido identificar'});
                }
            });
        }
        else{
            return res.status(404).send({messaage: 'El usuario no se ha podido identificar!!'});
        }
    });

}

// Conseguir datos de un usuario
function getUser(req,res){
    var userId = req.params.id;

    User.findById(userId, (err,user) => {
        if(err) return res.status(500).send({message: 'Error en la petición'});

        if(!user) return res.status(404).send({messaage: 'El usuario no existe'});

        return res.status(200).send({user});
    });
}

//obtener lista de usuarios
function getUsers(req,res){
    var identity_user_id= req.user.sub; //en jwt esta con nombre sub
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }
    var itemsPerPage = 5;
    User.find().sort('_id').paginate(page, itemsPerPage, (err,users,total) => {
        if(err) return res.status(500).send({message: 'Error en la petición'});
        
        if(!users) return res.status(404).send({messaage: 'No hay usuarios disponibles'});

        return res.status(200).send({
            users, //Es igual que hacerlo así users: users
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    });
}

// Edición  de datos de usuarios
function updateUser(req,res){
    var userId = req.params.id;
    var update = req.body;
    //Borrar propiedad password del objeto
    delete update.password;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
    }

    const findEmail = new RegExp(update.email,"i");
    const findNick = new RegExp(update.nick,"i");

    User.find({ $or: [
        //{email: update.email.toLowerCase()},
        //{nick: update.nick.toLowerCase()}
        {email: findEmail},
        {nick: findNick}
     ]}).exec((err,users) => {
        var user_isset = false;
        users.forEach( (user) => {
            if( user && (user._id != userId)) user_isset = true;
        });
        
        if(user_isset)return res.status(404).send({message: 'The data is already use'});
         
         User.findByIdAndUpdate(userId,update,{new: true},(err,userUpdated)=>{//new true para retomar obj actual
            if(err) return res.status(500).send({message: 'Error en la petición'});
            
            if(!userUpdated)return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
    
            return res.status(200).send({user: userUpdated});
        });
     });

    

}

//subir archivos de imagen/avatar de usuario
function uploadImage(req,res){
    var userId = req.params.id;

    if(req.files){
        var file_path = req.files.image.path;
        console.log(file_path);
        var file_split = file_path.split('\\');
        console.log(file_split);
        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);
        var file_ext = ext_split[1];

        if(userId != req.user.sub){
            return removeFilesOfUploads(res,file_path, 'No tienes permiso para actualizar los datos del usuario');
        }

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            //Actualizar documento de usuario logeado
            User.findByIdAndUpdate(userId,{image: file_name},{new: true}, (err,userUpdated)=>{
                if(err) return res.status(500).send({message: 'Error en la petición'});
        
                if(!userUpdated)return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

                return res.status(200).send({user: userUpdated});
            })
        }
        else{
            return removeFilesOfUploads(res,file_path, 'Extensión no valida');
        }
    }
    else{
        return res.status(200).send({message: 'No se han subido archivos'});
    }
}

function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) =>{
        return res.status(200).send({message: message});
    });
}

function getImageFile(req,res){
    var image_file = req.params.imageFile;
    var path_file = './uploads/users/'+image_file;

    fs.exists(path_file, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(path_file));
        }
        else{
            res.status(200).send({messaage: 'No existe la imagen'});
        }
    });
}

module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile
}