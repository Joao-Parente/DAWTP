var express = require('express');
var router = express.Router();

var User = require('../controllers/utilizadores')
var Recurso = require('../controllers/recursos')
var Zip = require('../public/javascripts/unzip')
var checkman = require('../public/javascripts/checkmanifesto')
var travman = require('../public/javascripts/travessiamanifesto')
var rm = require('../public/javascripts/rmrecursivo')


var bman= require('../public/javascripts/buildmanifesto')

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

  console.log("obtemm inicio recurso")
 
  Recurso.lookUp(req.params.id)
    .then(dados => {

      if (dados != null) {

        var result = JSON.parse(dados.manifesto);


        var path_filestore_aux= dados.path.split('public')[1].split('/');
        path_filestore_aux[2]=path_filestore_aux[2] + '/data';
        var path_filestore = path_filestore_aux.join('/')+'/'

        res.render('recurso', { manifesto: result, recurso: dados,path_g :  path_filestore,download: "/recursos/download/"+req.params.id}) //manifesto.ficheiros: [] ,recursod ados
      }

      else {
        res.render('RecursoInexistente')
      }


    })
    .catch(erro => res.render('error', { error: erro }))

});



router.get('/download/:id/*', function (req, res) {

  var path_recurso = req.url.split('/').slice(2)

console.log("download parte do recurso")
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
        if (man_result != null && man_result!=true) {


          var path_zip = dados.path + '/data/' + tail_path + '/' 
          
          var nome_zip = dados.titulo + '.zip'
  
          bman.buildManifesto(dados.path + '/data/' + tail_path +'/')
  

          Zip.zip(path_zip, nome_zip)
  
          res.download(__dirname + '/../tempzip/' + nome_zip)
          
          fs.unlinkSync(dados.path + '/data/' + tail_path + '/manifesto.json');
          
        }
        else if (man_result != null && man_result==true){

         //download de so um ficheiro
          var tempfile= __dirname+'/../tempfile/'+path_recurso[path_recurso.length-1];

          fs.copyFileSync(dados.path + '/data/' + tail_path, tempfile);
          bman.buildManifesto(__dirname+'/../tempfile/')

          var nome_zip = path_recurso[path_recurso.length-1] + '.zip'
          Zip.zip(__dirname+'/../tempfile/', nome_zip)
          res.download(__dirname + '/../tempzip/' + nome_zip)

          rm.deleteFolderRec(__dirname + '/../tempfile/' )
          fs.mkdirSync(__dirname + '/../tempfile/' )

        }

        else res.render('DiretorioRecursoInvalido')

      } else {
        res.render('RecursoInexistente')
      }
    })



    .catch(erro => res.render('error', { error: erro }))

});





router.get('/download/:id', function (req, res) {
  // ir a base de dados ver onde esta a ser gurdado o recurso de id  , zipar enviar e destuir zip

  //res.download(__dirname +'/../public/fileStore/'+req.params.id)

console.log("donload recurso compelto")

  Recurso.lookUp(req.params.id)
    .then(dados => {


      if (dados != null) {

        var path_zip = dados.path + '/'
        var nome_zip = dados.titulo + '.zip'


        Zip.zip(path_zip, nome_zip)

        res.download(__dirname + '/../tempzip/' + nome_zip)

      }


      else {
        res.render('RecursoInexistente')
      }


    })
    .catch(erro => res.render('error', { error: erro }))


});






router.get('/:id/*', function (req, res) {


  var path_recurso = req.url.split('/').slice(1)

console.log("obter recurso uma pasta")

  Recurso.lookUp(path_recurso[0])
    .then(dados => {

      if (dados != null) {

        var mani = JSON.parse(dados.manifesto);

        var tail_path = ""
        path_recurso.slice(1).forEach(function (value) {
          if (value != "") tail_path += value + '/'
        });
        tail_path = tail_path.slice(0, -1);
        console.log("PATH G " +dados.path+ tail_path)

        var man_result = travman.travessiaManifesto(tail_path, mani)
        if (man_result != null && man_result!=true) {


          var path_filestore_aux= dados.path.split('public')[1].split('/');
          path_filestore_aux[2]=path_filestore_aux[2] + '/data';
          var path_filestore = path_filestore_aux.join('/')+'/'+path_recurso.slice(1).join('/') + '/'

          console.log(path_filestore)


          res.render('recurso', { manifesto: man_result, recurso: dados, path_g : path_filestore,download: "/recursos/download/"+path_recurso.join('/')})
        }

        else res.render('DiretorioRecursoInvalido')

      } else {
        res.render('RecursoInexistente')
      }
    })



    .catch(erro => res.render('error', { error: erro }))


});








router.post('/novo', upload.single('myFile'), function (req, res) {



  if (req.file != null) {
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

            console.log("reqqqqqqqqq")
            console.log(req.body)

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
