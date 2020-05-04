
// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require ('cors');



//inicializar variables
const app = express();

//CORS
app.use(cors());

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//     res.header("POST, GET, PUT, DELETE, OPTIONS");
//     next();
//   });



//BodyParser for www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//Importar rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');
const hospitalRoutes = require('./routes/hospital');
const medicoRoutes = require('./routes/medico');
const busquedaRoutes = require('./routes/busqueda');
const uploadRoutes = require('./routes/upload');
const imagenesRoutes = require('./routes/imagenes');

//Algunos seteos de deprecating de mongoose
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);


//Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', 
 ( err, res)=>{
    if(err) throw err;
    console.log('Base de datos \x1b[36m%s\x1b[0m','online');

});

//Server index config
// const serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/uploads', serveIndex(__dirname + '/uploads'));

//Rutas
app.use('/img', imagenesRoutes);
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/medico', medicoRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);

app.use('/', appRoutes);//ultima ruta



//Escuchar peticiones
app.listen(3000, ()=>{
    console.log('Express server puerto 3000: \x1b[36m%s\x1b[0m','online');
});



