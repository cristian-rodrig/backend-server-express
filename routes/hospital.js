const express = require("express");

const mdAutenticacion = require('../middlewares/autenticacion');

const app = express();

const Hospital = require("../models/hospital");



// =========================================
//         Obtener todos los hospitales
// =========================================
app.get("/", (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
  
    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec((err, hospitales) => {
   
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando hospitales",
        errors: err,
      });
    }

    Hospital.count({}, (err, conteo) =>{

        res.status(200).json({
          ok: true,
          hospitales: hospitales,
          mensaje: "Peticion GET de hospitales correcta",
          totalHospital: conteo
        });
    });
  });
});



// =========================================
//         Actualizar un nuevo hospital
// =========================================

app.put('/:id', mdAutenticacion.verificaToken , (req, res) => {

  let id = req.params.id;
  let body = req.body;

  Hospital.findById( id , (err, hospital) =>{    

  if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar hospital",
        errors: err,
      });
    }

    if( !hospital ){
      return res.status(400).json({
          ok: false,
          mensaje: "El hospital con el + id " + " no existe",
          errors: {message: 'No existe un hospital con ese ID'},
        });
      }

      hospital.nombre = body.nombre;
      hospital.usuario = req.usuario._id;

      hospital.save(( err, hospitalGuardado) =>{

          if (err) {
              return res.status(400).json({
                ok: false,
                mensaje: "Error al actualizar hospital",
                errors: err,
              });
            }  
            
            res.status(200).json({
              ok: true,
              hospital: hospitalGuardado
        
            });

          });
      });
  });



// =========================================
//         Crear un nuevo hospital
// =========================================

app.post('/', mdAutenticacion.verificaToken , (req, res) => {

    let body = req.body;
    let hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save( (err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
              ok: false,
              mensaje: "Error al crear hospital",
              errors: err,
            });
          }

          res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,
            creadoPor: req.usuario.nombre          
      
          });
    });    
});





// =========================================
//         Eliminar un hospital
// =========================================

app.delete('/:id', mdAutenticacion.verificaToken , (req, res) =>{

    let id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) =>{

        if (err) {
            return res.status(500).json({
              ok: false,
              mensaje: "Error al borrar hospital",
              errors: err,
            });
          }  

          if (!hospitalBorrado) {
            return res.status(400).json({
              ok: false,
              mensaje: "No existe un hospital con ese id",
              errors: {message: 'No existe un hospital con ese id'}
            });
          }  

          res.status(200).json({
            ok: true,
            respuesta:'Hospital borrado',
            hospital: hospitalBorrado
      
          });
    });

});


module.exports = app;
