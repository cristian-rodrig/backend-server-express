const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const rolesValidos = {
    values:['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} NO es un rol permitido' 
};


var usuarioSchema= new Schema({
    nombre: { type: String, required: [true, 'El nombre y apellido es requerido']},
    email: { type: String, unique: true, required: [true, 'El mail es requerido']},
    password: { type: String, required: [true, 'El password es requerido']},
    img:{ type: String, required: false},
    role:{ type: String, required: true, default: 'USER_ROLE', enum: rolesValidos },
    google:{ type: Boolean, default:false}
});

usuarioSchema.plugin( uniqueValidator, {message: ' {PATH} debe de ser unico '} );

module.exports=mongoose.model('Usuario', usuarioSchema);