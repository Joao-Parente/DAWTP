var createError = require('http-errors');
var express = require('express');

var path = require('path');
var logger = require('morgan');

var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var { v4: uuidv4 } = require('uuid');
var session = require('express-session');
const FileStore = require('session-file-store')(session);

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('./controllers/utilizadores')

var favicon = require('serve-favicon');


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

/* Autenticação */

// Configuração da estratégia local
passport.use(new LocalStrategy(
  {usernameField: 'username'}, (username, password, done) => {
    console.log('1?')
    User.lookUp(username)
      .then(dados => {
        console.log('2? ' + dados)
        const user = dados
        if(!user) { return done(null, false, {message: 'Utilizador inexistente!\n'})}
        if(password != user.password) { return done(null, false, {message: 'Credenciais inválidas!\n'})}
        return done(null, user)
      })
      .catch(erro =>done(erro))
    })
)

// Indica-se ao passport como serializar o utilizador
passport.serializeUser((user,done) => {
  console.log('Serielização, id: ' + user.username)
  done(null, user.username)
});

// Desserialização: a partir do id obtem-se a informação do utilizador
passport.deserializeUser((uid, done) => {
  console.log('Desserielização, id: ' + uid)
  User.lookUp(uid)
    .then(dados => done(null, dados))
    .catch(erro => done(erro, false))
});



var usersRouter = require('./routes/utilizadores');
var indexRouter = require('./routes/index');
var recursosRouter = require('./routes/recursos');
var tiposRouter = require('./routes/tipos');
var publicacoesRouter = require('./routes/publicacoes');
var exportRouter = require('./routes/export');
var importRouter = require('./routes/import');


/* Iniciar express*/
var app = express();




app.use(session({
  genid: req => {
    return uuidv4()
  },
  store: new FileStore(),
  secret: 'segredo',
  resave: false,
  saveUninitialized: false
}));






// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');




app.use(logger('dev'));

/* Coloca o body no req.body*/

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser('segredo'));



/*Recursos Estáticos*/
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images','favicon.ico')));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  console.log('Signed Cookies: ', JSON.stringify(req.signedCookies))
  console.log('Session: ', JSON.stringify(req.session))
  next()
});

/* Rotas*/
app.use('/', indexRouter);
app.use('/utilizadores', usersRouter);
app.use('/recursos', recursosRouter);
app.use('/tipos', tiposRouter);
app.use('/publicacoes', publicacoesRouter);
app.use('/export', exportRouter);
app.use('/import', importRouter);




/*Erros*/


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});









module.exports = app;
