var express = require('express');
var router = express.Router();

var User = require('../controllers/utilizadores')

var Recurso = require('../controllers/recursos')
var multer = require('multer')
var upload = multer({dest:'uploads/'})

/* GET users listing. */
router.get('/', function(req, res) {
  Recurso.list()
    .then(data => {

      res.render('recursos', { list: data })
    })
    .catch(err => res.render('error', { error: err }))
});

router.get('/novo', function (req, res) {
  res.render('novo-recurso-form')
});


router.post('/novo', upload.single('myFile'),function(req, res) {

  console.log( "POST   "+JSON.stringify(req.body))

  Recurso.insert(req.body)
    .then(dados => res.redirect('/'))
    .catch(erro => res.render('error',{error:erro}))
  
});


module.exports = router;
