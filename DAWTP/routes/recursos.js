var express = require('express');
var router = express.Router();
var fse = require('fs-extra');
var User = require('../controllers/utilizadores')
var Recurso = require('../controllers/recursos')
var Zip = require('../public/javascripts/unzip')
var checkman = require('../public/javascripts/checkmanifesto')
var travman = require('../public/javascripts/travessiamanifesto')
var cp = require('../public/javascripts/cprecursivo')
var rm = require('../public/javascripts/rmrecursivo')
var Tipo = require('../controllers/tipos')
var bman = require('../public/javascripts/buildmanifesto')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var fs = require('fs');
const { unzip } = require('zlib');
const { exportCSV } = require('../public/javascripts/exportCSV');
const { importCSV } = require('../public/javascripts/importCSV');
var { log } = require('../public/javascripts/debug');


// Lista Recursos
router.get('/', function (req, res) {


  if (req.query.hashtags) {


    Recurso.listHashtags(req.query.hashtags)
      .then(data => {

        res.render('recursos', { list: data })
      })
      .catch(err => res.render('error', { error: err }))
  }
  else {
    Recurso.list()
      .then(data => {

        res.render('recursos', { list: data })
      })
      .catch(err => res.render('error', { error: err }))
  }
});





//Novo recurso
router.get('/novo', function (req, res) {
  res.render('novo-recurso-form')
});

//Esquema estrtura manifesto
router.get('/estrutura-manifesto', function (req, res) {
  res.render('EstruturaManifesto')
});




//Consulta 1 recurso
router.get('/:id', function (req, res) {

  log("obtemm inicio recurso")

  Recurso.lookUp(req.params.id)
    .then(dados => {

      if (dados != null) {

        var result = JSON.parse(dados.manifesto);
        log("                           DOWNLOAD: " + req.params.id)
        res.render('recurso', { manifesto: result, recurso: dados, path_g: dados.path + '/data', download: req.params.id }) //manifesto.ficheiros: [] ,recursod ados

      }

      else {
        res.render('RecursoInexistente')
      }


    })
    .catch(erro => res.render('error', { error: erro }))

});

//Download de parte de um recurso
router.get('/download/:id/*', function (req, res) {


  var path_recurso = req.url.split('/').slice(2)

  console.log("download parte do recurso")
  Recurso.lookUp(path_recurso[0])
    .then(dados => {

      if (dados != null) {

        var mani = JSON.parse(dados.manifesto);

        var tail_path = path_recurso.slice(1).join('/')

        //faz a travessia a partir do path da rota e ve se é possivel se nao for retorna null
        // se for e for um diretorio retorna false
        // se for e for um ficheiro retorna true
        var man_result = travman.travessiaManifesto(tail_path, mani)

        //diretorio
        if (man_result != null && man_result != true) {



          var random_tempdir=Math.random()+'_'+Math.random()+'-' +Math.random();
          fs.mkdirSync(__dirname + '/../tempfile/'+random_tempdir);
          fs.mkdirSync(__dirname + '/../tempfile/'+random_tempdir+'/data');
          var tempfile = __dirname + '/../tempfile/'+random_tempdir+'/data/' + path_recurso[path_recurso.length - 1];
          cp.cpRecursivo(__dirname + '/../public/' + dados.path + '/data/' + tail_path,tempfile)
         
          // nome do zip
          var nome_zip = dados.titulo + '.zip'

          var tempzip  = __dirname + '/../tempzip/'+nome_zip

          //cria um manifesto
          bman.buildManifesto(__dirname + '/../tempfile/'+random_tempdir+'/data')

          Zip.zip('../tempfile/'+random_tempdir+'/', nome_zip)
          res.download(tempzip,function(err){
               rm.deleteFolderRec(__dirname + '/../tempfile/'+random_tempdir)
               fs.unlinkSync(tempzip);
               if (err) log(err)
          });
          

       


        }
        //ficheiro
        else if (man_result != null && man_result == true) {


          var nome_zip = path_recurso[path_recurso.length - 1] + '.zip'

          //path para o tempfile
          var random_tempdir=Math.random()+'_'+Math.random()+'-' +Math.random();
          fs.mkdirSync(__dirname + '/../tempfile/'+random_tempdir);
          fs.mkdirSync(__dirname + '/../tempfile/'+random_tempdir+'/data');
          var tempfile = __dirname + '/../tempfile/'+random_tempdir+'/data/' + path_recurso[path_recurso.length - 1];
          
          var tempzip  = __dirname + '/../tempzip/'+nome_zip

          //copiar o file para o diretorio de tempfile
          fs.copyFileSync(__dirname + '/../public/' + dados.path + '/data/' + tail_path, tempfile);
          
          //criar manifesto
          bman.buildManifesto(__dirname + '/../tempfile/'+random_tempdir+'/data')

         

          Zip.zip('../tempfile/'+random_tempdir, nome_zip)
          res.download(tempzip,function(err){
            rm.deleteFolderRec(__dirname + '/../tempfile/'+random_tempdir)
            fs.unlinkSync(tempzip);
            if (err) log(err)
       });
          

        }

        else res.render('DiretorioRecursoInvalido')

      } else {
        res.render('RecursoInexistente')
      }
    })



    .catch(erro => res.render('error', { error: erro }))

});




// Donwload recurso completo
router.get('/download/:id', function (req, res) {
  // ir a base de dados ver onde esta a ser gurdado o recurso de id  , zipar enviar e destuir zip


  log("donload recurso compelto")

  Recurso.lookUp(req.params.id)
    .then(dados => {


      if (dados != null) {

        var path_zip = dados.path + '/'
        var nome_zip = dados.titulo + '.zip'


        Zip.zip(path_zip, nome_zip)

        //zipa tudo para /tempzip e faz download dai (zipar noo sitio tava a por o zip dentro X)  )
        res.download(__dirname + '/../tempzip/' + nome_zip)

      }


      else {
        res.render('RecursoInexistente')
      }


    })
    .catch(erro => res.render('error', { error: erro }))


});





// Preview Recurso (sem ser o inicial)
router.get('/:id/*', function (req, res) {


  var path_recurso = req.url.split('/').slice(1)

  console.log("obter recurso uma pasta")

  Recurso.lookUp(path_recurso[0])
    .then(dados => {

      if (dados != null) {

        var mani = JSON.parse(dados.manifesto);

        var tail_path = path_recurso.slice(1).join('/')

        var man_result = travman.travessiaManifesto(tail_path, mani)
        if (man_result != null && man_result != true) {

          //log("/recursos/download/" + path_recurso.join('/'))       
          log("                           DOWNLOAD: " + path_recurso.join('/'))
          console.log("Manifesto" + JSON.stringify(mani))

          res.render('recurso', { manifesto: man_result, recurso: dados, path_g: dados.path + '/data/' + path_recurso.slice(1).join('/') + '/', download: path_recurso.join('/') })
        }

        else res.render('DiretorioRecursoInvalido')

      } else {
        res.render('RecursoInexistente')
      }
    })



    .catch(erro => res.render('error', { error: erro }))


});







// Upload de um recurso
router.post('/novo', upload.single('myFile'), function (req, res) {



  if (req.file != null) {
    console.log("POST   " + JSON.stringify(req.body))


    if (req.file.mimetype == 'application/zip') {

      Zip.unzip(req.file.path)

      var fl = true;
      Tipo.list().then(dados => {
        fl = checkman.processaManifesto(__dirname + '/../' + req.file.path + 'dir', dados)
        // se o pacote corresponder com o manifesto vamos inserir
        if (fl) {

          //ler manifesto 
          var obj_json = __dirname + '/../' + req.file.path + 'dir' + '/manifesto.json'
          req.body.manifesto = JSON.stringify(require(obj_json))


          log("O MANIEFESTO" + req.body.manifesto)

          Recurso.insert(req.body)
            .then(dados => {


              let oldPath = __dirname + '/../' + req.file.path + 'dir'
              let newPath = __dirname + '/../public/' + dados.path
              log("new" + newPath)

              log("reqqqqqqqqq")
              log(req.body)

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


      })
        .catch(err => res.render('error', { error: err }));
    }
    else {
      res.render('RecursoFormatoInválido')
      rm.deleteFolderRec(__dirname + '/../' + req.file.path + 'dir')
    }

  }
  else res.render('UploadSemSucesso')

});


module.exports = router;
