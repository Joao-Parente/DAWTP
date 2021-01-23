var express = require('express');
var router = express.Router();


var Tipo = require('../controllers/tipos')



router.get('/', function(req, res) {
  Tipo.list()
    .then(data => {
      res.render('tipos', { list: data })
    })
    .catch(err => res.render('error', { error: err }))
});


//Consultar 1 tipo
router.get('/:nome', function (req, res) {
  Tipo.lookUp(req.params.nome)
    .then(data => {

      if (data != null) res.render('tipo', { tipo: data })
      else res.render('TipoNaoExiste')
    })
    .catch(err => res.render('error', { error: err }))
});



module.exports = router;
