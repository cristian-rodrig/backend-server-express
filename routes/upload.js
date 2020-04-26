const express = require('express');
const fileUpload = require('express-fileupload');
var fs = require('fs');

const app = express();

const Hospital = require("../models/hospital");
const Medico = require("../models/medico");
const Usuario = require("../models/usuario");



app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) =>{
    let tipo = req.params.tipo;
    let id = req.params.id;

    //Tipos de coleccion
    let tiposValidos = ['hospitales', 'usuarios', 'medicos'];
    if(tiposValidos.indexOf( tipo )< 0){
        return res.status(400).json({
            ok: false,
            mensaje: "Tipo de coleccion invalida",
            errors: {message: ' Debe ser una coleccion de ' + tiposValidos.join(', ')},
          });
    }

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: "No selecciono ningun archivo",
            errors: {message: ' Debe seleccionar una imagen'},
          });
    }

    //Obtener nombre del archivo
    let nombreArchivo = req.files.imagen;
    let nombreCortado = nombreArchivo.name.split('.');
    let extensionArchivo = nombreCortado[nombreCortado.length-1];

    //Solo estas extensiones aceptamos
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if(extensionesValidas.indexOf(extensionArchivo) < 0 ){
        return res.status(500).json({
            ok: false,
            mensaje: "Extension no valida",
            errors: {message: ' Las extensiones permitidas son ' + extensionesValidas.join(', ')}
          });
    }

    // Nombre de archivo personalizado
    let nombreArchivoPers= `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo del temporal a un path
    let path =  `./uploads/${tipo}/${nombreArchivoPers}`;

    nombreArchivo.mv(path, err =>{
        if(err){ 
            return res.status(500).json({
            ok: false,
            mensaje: "Error al mover archivo",
            errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivoPers, res);

    });

});


function subirPorTipo(tipo, id, nombreArchivoPers, res){

    if(tipo === 'usuarios'){

        Usuario.findById(id, (err, usuario) =>{

            if(!usuario){
                return res.status(400).json({
                    ok:false,
                    mensaje:'No exisrte usuario',
                    errors: {message: 'Usuario no existe'}    
                }); 
            }

            let pathViejo = './uploads/usuarios/' + usuario.img;

            //Si existe una imagen anterior la elimina
            if(fs.existsSync(pathViejo)){

                fs.unlink(pathViejo, ()=>{

                });
            }

            usuario.img = nombreArchivoPers;

            usuario.save( (err, usuarioActualizado) =>{

                usuarioActualizado.password=" :)";

              return res.status(200).json({
                ok:true,
                mensaje:'Imagen de usuario actualizado',
                usuario: usuarioActualizado    

                });
            });

        });
    }


    if(tipo === 'medicos'){

        Medico.findById(id, (err, medico) =>{

            if(!medico){
                return res.status(400).json({
                    ok:false,
                    mensaje:'No existe medico',
                    errors: {message: 'Medico no existe'}    
                }); 
            }

            let pathViejo = './uploads/medicos/' + medico.img;

            //Si existe una imagen anterior la elimina
            if(fs.existsSync(pathViejo)){

                fs.unlink(pathViejo, ()=>{

                });
            }

            medico.img = nombreArchivoPers;

            medico.save( (err, medicoActualizado) =>{
               
              return res.status(200).json({
                ok:true,
                mensaje:'Imagen de medico actualizado',
                medico: medicoActualizado
               
                });
            });

        });
        
    }

    if(tipo === 'hospitales'){

        Hospital.findById(id, (err, hospital) =>{

            if(!hospital){
                return res.status(400).json({
                    ok:false,
                    mensaje:'No existe hospital',
                    errors: {message: 'Hospital no existe'}    
                }); 
            }

            let pathViejo = './uploads/hospitales/' + hospital.img;

            //Si existe una imagen anterior la elimina
            if(fs.existsSync(pathViejo)){

                fs.unlink(pathViejo, ()=>{

                });
            }

            hospital.img = nombreArchivoPers;

            hospital.save( (err, hospitalActualizado) =>{

              return res.status(200).json({
                ok:true,
                mensaje:'Imagen de hospital actualizada',
                hospital: hospitalActualizado
                
                });
            });

        });
        
    }
}

module.exports=app;