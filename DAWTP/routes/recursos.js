var express = require('express');
var router = express.Router();

var User = require('../controllers/utilizadores')
var Recurso = require('../controllers/recursos')
var Zip = require('../public/javascripts/unzip')
var checkman = require('../public/javascripts/checkmanifesto')



var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var fs = require('fs');
const { unzip } = require('zlib');



/* GET users listing. */
router.get('/', function (req, res) {
  Recurso.list()
    .then(data => {

      res.render('recursos', { list: data })
    })
    .catch(err => res.render('error', { error: err }))
});

router.get('/novo', function (req, res) {
  res.render('novo-recurso-form')
});


router.post('/novo', upload.single('myFile'), function (req, res) {

  console.log("POST   " + JSON.stringify(req.body))


  if (req.file.mimetype == 'application/zip') {

    Zip.unzip(req.file.path)


    if (checkman.processaManifesto(__dirname + '/../' + req.file.path + 'dir')) {



      Recurso.insert(req.body)
        .then(dados => res.redirect('/'))
        .catch(erro => res.render('error', { error: erro }))



    }
    else fs.rmdir(__dirname + '/../' + req.file.path + 'dir', { recursive: false }, (err) => {
      if (err) {
        throw err;
      }
    })


  }
  else console.log("formato invalido")

});


module.exports = router;
