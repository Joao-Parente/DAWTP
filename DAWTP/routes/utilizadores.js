var express = require('express');
var router = express.Router();

var User = require('../controllers/utilizadores')



// Lista utilizadores
router.get('/', function (req, res) {
  User.list()
    .then(data => {

      res.render('utilizadores', { list: data })
    })
    .catch(err => res.render('error', { error: err }))
});


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




//Consultar 1 utilizador
router.get('/:username', function (req, res) {
  User.lookUp(req.params.username)
    .then(data => {

      if (data != null) res.render('utilizador', { user: data })
      else res.render('UtilizadorNaoExiste')
    })
    .catch(err => res.render('error', { error: err }))
});




module.exports = router;
