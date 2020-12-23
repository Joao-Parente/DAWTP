var express = require('express');
var router = express.Router();

var User = require('../controllers/utilizadores')
var Recurso = require('../controllers/recursos')
var Zip = require('../public/javascripts/unzip')
var checkman = require('../public/javascripts/checkmanifesto')
var travman = require('../public/javascripts/travessiamanifesto')
var rm = require('../public/javascripts/rmrecursivo')



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

router.get('/estrutura-manifesto', function (req, res) {
  res.render('EstruturaManifesto')
});





router.get('/:id', function (req, res) {


  Recurso.lookUp(req.params.id)
    .then(dados => {

      if (dados != null) {

        var result = JSON.parse(dados.manifesto);


        res.render('recurso', { manifesto: result, recurso: dados }) //manifesto.ficheiros: [] ,recursod ados
      }

      else {
        res.render('RecursoInexistente')
      }


    })
    .catch(erro => res.render('error', { error: erro }))

});



router.get('/download/:id', function (req, res) {
   // ir a base de dados ver onde esta a ser gurdado o recurso de id  , zipar enviar e destuir zip

    //res.download(__dirname +'/../public/fileStore/'+req.params.id)

    Recurso.lookUp(req.params.id)
    .then(dados => {

      if (dados != null) {

        var path_zip=dados.path+'/'
        var nome_zip=dados.titulo+'.zip'
        Zip.zip(path_zip,nome_zip)
        res.download(path_zip+nome_zip)

        
      }

      else {
        res.render('RecursoInexistente')
      }


    })
    .catch(erro => res.render('error', { error: erro }))


});






router.get('/:id/*', function (req, res) {


  var path_recurso = req.url.split('/').slice(1)


  Recurso.lookUp(path_recurso[0])
    .then(dados => {

      if (dados != null) {

        var mani = JSON.parse(dados.manifesto);

        var tail_path = ""
        path_recurso.slice(1).forEach(function (value) {
          if (value != "") tail_path += value + '/'
        });
        tail_path = tail_path.slice(0, -1);

        var man_result = travman.travessiaManifesto(tail_path, mani)
        if (man_result != null) {

          console.log("tipo de " + (typeof man_result) +" e conteudo" + man_result)
          res.render('recurso', { manifesto: man_result, recurso: dados })
        }

        else res.render('DiretorioRecursoInvalido')

      } else {
        res.render('RecursoInexistente')
      }
    })



    .catch(erro => res.render('error', { error: erro }))


});








router.post('/novo', upload.single('myFile'), function (req, res) {



  if ( req.file!=null){
  console.log("POST   " + JSON.stringify(req.body))


  if (req.file.mimetype == 'application/zip') {

    Zip.unzip(req.file.path)


    if (checkman.processaManifesto(__dirname + '/../' + req.file.path + 'dir')) {


      var obj_json = __dirname + '/../' + req.file.path + 'dir' + '/manifesto.json'
      req.body.manifesto = JSON.stringify(require(obj_json))




      console.log("O MANIEFESTO" + req.body.manifesto)

      Recurso.insert(req.body)
        .then(dados => {


          let oldPath = __dirname + '/../' + req.file.path + 'dir'
          let newPath = dados.path


          console.log("Inseri o objeto:" + dados.id + "bd obj" + dados.path)

          fs.renameSync(oldPath, newPath)

          res.render('index')
        })
        .catch(erro => res.render('error', { error: erro }))
    }
    else {
      res.render('RecursoManifestoInválido')
      rm.deleteFolderRec(__dirname + '/../' + req.file.path + 'dir')
    }



  }
  else {
    res.render('RecursoFormatoInválido')
    rm.deleteFolderRec(__dirname + '/../' + req.file.path + 'dir')
  }

}
else res.render('UploadSemSucesso')

});


module.exports = router;
