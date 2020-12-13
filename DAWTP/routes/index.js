var express = require('express');
var router = express.Router();


//var Relatorio = require('../controllers/relatorio')
//var Livro = require('../controllers/livro')
//var Artigo = require('../controllers/artigo')

var Recurso = require('../controllers/recurso')


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/recursos', function (req, res) {



  Recurso.list()
    .then(data => {

      res.render('recursos', { list: data })
    })
    .catch(err => res.render('error', { error: err }))



});




module.exports = router;
