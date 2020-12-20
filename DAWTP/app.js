var createError = require('http-errors');
var express = require('express');

var path = require('path');
var logger = require('morgan');
//var multer = require('multer')
var bodyParser = require('body-parser')




/* Base de dados*/

//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/DAWTP';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.once('open', function () {
    console.log("Conexão ao MongoDB realizada com sucesso...")
});

var usersRouter = require('./routes/utilizadores');
var indexRouter = require('./routes/index');
var recursosRouter = require('./routes/recursos');
var tiposRouter = require('./routes/tipos');





/* Iniciar express*/
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');




app.use(logger('dev'));

/* Coloca o body no req.body*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


/*Recursos Estáticos*/
app.use(express.static(path.join(__dirname, 'public')));


/* Rotas*/
app.use('/', indexRouter);
app.use('/utilizadores', usersRouter);
app.use('/recursos', recursosRouter);
app.use('/tipos', tiposRouter);





/*Erros*/


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});









module.exports = app;
