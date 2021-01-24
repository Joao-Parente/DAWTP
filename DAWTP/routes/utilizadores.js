var express = require('express');
var router = express.Router();

var User = require('../controllers/utilizadores')
var Auth = require('../public/javascripts/verifyauth.js')

var passport = require('passport')


/* Unicas rotas abertas do server*/
router.get('/menu', function (req, res) {
    res.render('index_porlogin')
});
//Login
router.get('/login', function (req, res) {
  console.log('3?')
  res.render('login-form')
});
router.post('/login', passport.authenticate('local'),Auth.verifyAuth, function(req, res){
  console.log('4?')
  res.redirect('/')
})

//Registar-from
router.get('/registo', function (req, res) {
  res.render('reg-utilizador-form')
});

//Registo
router.post('/registo', function(req, res) {


  User.insert(req.body)
    .then(dados => res.redirect('/'))
    .catch(erro => res.render('error',{error:erro}))
  
});
/* Unicas rotas abertas do server acima*/





// Lista utilizadores
router.get('/',Auth.verifyAuth, function (req, res) {
  User.list()
    .then(data => {

      res.render('utilizadores', { list: data,user:req.user })
    })
    .catch(err => res.render('error', { error: err }))
});





router.get('/logout',Auth.verifyAuth, function(req, res){
  req.logout();
  req.session.destroy(function (err) {
    if (!err) {
        res.redirect('/');
    } else {
        console.log('Destroy session error: ', err)
    }
  });
});




//Consultar 1 utilizador
router.get('/:username',Auth.verifyAuth, function (req, res) {
  User.lookUp(req.params.username)
    .then(data => {

      if (data != null) res.render('utilizador', { user: data ,user:req.user})
      else res.render('UtilizadorNaoExiste')
    })
    .catch(err => res.render('error', { error: err }))
});




module.exports = router;
