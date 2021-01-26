var express = require('express');
var router = express.Router();


var Tipo = require('../controllers/tipos')
var Auth = require('../public/javascripts/verifyauth.js')



router.get('/',Auth.verifyAuth, function(req, res) {
  Tipo.list()
    .then(data => {
      res.render('tipos', { list: data,user:req.user })
    })
    .catch(err => res.render('error', { error: err }))
});



//Consultar 1 tipo
router.get('/:nome',Auth.verifyAuth, function (req, res) {
  Tipo.lookUp(req.params.nome)
    .then(data => {

      if (data != null) res.render('tipo', { tipo: data,user:req.user })
      else res.render('TipoNaoExiste',{user:req.user})
    })
    .catch(err => res.render('error', { error: err }))
});



module.exports = router;
