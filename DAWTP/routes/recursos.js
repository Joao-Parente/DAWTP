var express = require('express');
var router = express.Router();
var User = require('../controllers/utilizadores')
var Recurso = require('../controllers/recursos')
var Zip = require('../public/javascripts/unzip')
var checkman = require('../public/javascripts/checkmanifesto')
var travman = require('../public/javascripts/travessiamanifesto')
var cp = require('../public/javascripts/cprecursivo')
var rm = require('../public/javascripts/rmrecursivo')
var Tipo = require('../controllers/tipos')
var bman = require('../public/javascripts/buildmanifesto')
var newPath = require('../public/javascripts/createpath')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })
var fs = require('fs');

var { log } = require('../public/javascripts/debug');
var Auth = require('../public/javascripts/verifyauth.js')

// Lista Recursos
router.get('/', Auth.verifyAuth, function (req, res) {

  if (req.query.hashtags) {

    Recurso.listHashtags(req.query.hashtags)
      .then(data => {

        res.render('recursos', { list: data, user: req.user })
      })
      .catch(err => res.render('error', { error: err }))
  }
  else if (req.query.ano) {

    Recurso.listAno(req.query.ano)
      .then(data => {

        res.render('recursos', { list: data, user: req.user })
      })
      .catch(err => res.render('error', { error: err }))
  }
  else if (req.query.byTitulo) {

    Recurso.listTitulo(req.query.byTitulo)
      .then(data => {

        res.render('recursos', { list: data, user: req.user })
      })
      .catch(err => res.render('error', { error: err }))
  }
  else if (req.query.byAntigos) {

    Recurso.listAntigos(req.query.byAntigos)
      .then(data => {

        res.render('recursos', { list: data, user: req.user })
      })
      .catch(err => res.render('error', { error: err }))
  }
  else if (req.query.byLikes) {

    Recurso.listLikes(req.query.byLikes)
      .then(data => {

        res.render('recursos', { list: data, user: req.user })
      })
      .catch(err => res.render('error', { error: err }))
  }
  else {
    Recurso.list()
      .then(data => {

        res.render('recursos', { list: data, user: req.user })
      })
      .catch(err => res.render('error', { error: err }))
  }
});




//Novo recurso
router.get('/novo', Auth.verifyAuthUserorAdminCreate, function (req, res) {
  res.render('novo-recurso-form', { user: req.user })
});

//Esquema estrtura manifesto
router.get('/estrutura-manifesto', Auth.verifyAuthUserorAdminCreate, function (req, res) {
  res.render('EstruturaManifesto', { user: req.user })
});


//like se tiver no inicio
router.get('/like/:id', Auth.verifyAuth, function (req, res) {
  Recurso.lookUp(req.params.id)
    .then(dados => {


      if (dados.likes.includes(req.user._id)) {
        dados.likes.splice(dados.likes.indexOf(req.user._id), 1);
      }
      else {
        dados.likes.push(req.user._id)
      }
      Recurso.edit(dados)
        .then(el => res.redirect('/recursos/' + req.params.id))
        .catch(err => res.render('error', { error: err }))


    })
    .catch(err => res.render('error', { error: err }))

});

//like se nao tiver no inico do recurso
router.get('/like/:id/*', Auth.verifyAuth, function (req, res) {

  Recurso.lookUp(req.params.id)
    .then(dados => {

      if (dados.likes.includes(req.user._id)) {
        dados.likes.splice(dados.likes.indexOf(req.user._id), 1);
      }
      else {
        dados.likes.push(req.user._id)
      }
      Recurso.edit(dados)
        .then(el => res.redirect('/recursos/' + req.url.split('/').splice(2).join('/')))
        .catch(err => res.render('error', { error: err }))


    })
    .catch(err => res.render('error', { error: err }))

});



//Consulta 1 recurso
router.get('/:id', Auth.verifyAuth, function (req, res) {


  Recurso.lookUp(req.params.id)
    .then(dados => {

      if (dados != null) {

        var result = JSON.parse(dados.manifesto);
        log("                           DOWNLOAD: " + req.params.id)
        log(result)

        res.render('recurso', { manifesto: result, recurso: dados, path_g: dados.path + '/data', download: req.params.id, user: req.user }) //manifesto.ficheiros: [] ,recursod ados

      }

      else {
        res.render('RecursoInexistente', { user: req.user })
      }


    })
    .catch(erro => res.render('error', { error: erro }))

});

//Download de parte de um recurso
router.get('/download/:id/*', Auth.verifyAuth, function (req, res) {


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
        log("Resultado do man" + man_result)
        //diretorio
        if (man_result != null && man_result != true) {


          log("isto e um dir")
          var random_tempdir = Math.random() + '_' + Math.random() + '-' + Math.random();
          fs.mkdirSync(__dirname + '/../tempfile/' + random_tempdir);
          fs.mkdirSync(__dirname + '/../tempfile/' + random_tempdir + '/data');
          var tempfile = __dirname + '/../tempfile/' + random_tempdir + '/data/' + path_recurso[path_recurso.length - 1];
          cp.cpRecursivo(__dirname + '/../public/' + dados.path + '/data/' + tail_path, tempfile)

          // nome do zip
          var nome_zip = dados.titulo + '.zip'

          var tempzip = __dirname + '/../tempzip/' + nome_zip

          //cria um manifesto
          bman.buildManifesto(__dirname + '/../tempfile/' + random_tempdir + '/data')

           Zip.zip('../tempfile/' + random_tempdir + '/', nome_zip)

            res.download(tempzip, function (err) {
              rm.deleteFolderRec(__dirname + '/../tempfile/' + random_tempdir)
              fs.unlinkSync(tempzip);
              if (err) log(err)
            });



        }
        //ficheiro
        else if (man_result != null && man_result == true) {

          var nome_zip = path_recurso[path_recurso.length - 1] + '.zip'

          //path para o tempfile
          var random_tempdir = Math.random() + '_' + Math.random() + '-' + Math.random();
          fs.mkdirSync(__dirname + '/../tempfile/' + random_tempdir);
          fs.mkdirSync(__dirname + '/../tempfile/' + random_tempdir + '/data');
          var tempfile = __dirname + '/../tempfile/' + random_tempdir + '/data/' + path_recurso[path_recurso.length - 1];

          var tempzip = __dirname + '/../tempzip/' + nome_zip

          //copiar o file para o diretorio de tempfile
          fs.copyFileSync(__dirname + '/../public/' + dados.path + '/data/' + tail_path, tempfile);

          //criar manifesto
          bman.buildManifesto(__dirname + '/../tempfile/' + random_tempdir + '/data')



           Zip.zip('../tempfile/' + random_tempdir, nome_zip)
            res.download(tempzip, function (err) {
              rm.deleteFolderRec(__dirname + '/../tempfile/' + random_tempdir)
              fs.unlinkSync(tempzip);
              if (err) log(err)
            });


        }

        else res.render('DiretorioRecursoInvalido', { user: req.user })

      } else {
        res.render('RecursoInexistente', { user: req.user })
      }
    })



    .catch(erro => res.render('error', { error: erro }))

});




// Donwload recurso completo
router.get('/download/:id', Auth.verifyAuth, function (req, res) {
  // ir a base de dados ver onde esta a ser gurdado o recurso de id  , zipar enviar e destuir zip


  log("donload recurso compelto")

  Recurso.lookUp(req.params.id)
    .then(dados => {


      if (dados != null) {

        var path_zip = dados.path 
        var nome_zip = dados.titulo + '.zip'

        Zip.zip(path_zip, nome_zip)
          

          //zipa tudo para /tempzip e faz download dai (zipar noo sitio tava a por o zip dentro X)  )
          res.download(__dirname + '/../tempzip/' + nome_zip, function (err) {
            fs.unlinkSync(__dirname + '/../tempzip/' + nome_zip);
            if (err) log(err)
          });

      }


      else {
        res.render('RecursoInexistente', { user: req.user })
      }


    })
    .catch(erro => res.render('error', { error: erro }))


});

router.get('/delete/:id', Auth.verifyAuthUserorAdminEditRecurso, function (req, res) {

  Recurso.lookUp(req.params.id).then(dados => {

    rm.deleteFolderRec(__dirname + '/../public/'+dados.path)
    Recurso.remove(req.params.id)
      .then(el => res.redirect('/recursos'))
      .catch(err => res.render('UtilizadorNaoExiste', { user: req.user }))
  })
  .catch(err => res.render('UtilizadorNaoExiste', { user: req.user }))
});

router.get('/editar/:id', Auth.verifyAuthUserorAdminEditRecurso, function (req, res) {
  Recurso.lookUp(req.params.id)
    .then(data => {

      if (data != null)
        res.render('edit-recurso-form', { user: req.user, recurso: data })
      else
        res.render('RecursoInexistente', { user: req.user })
    })
    .catch(err => res.render('RecursoInexistente', { user: req.user }))
});



router.post('/editar/:id', Auth.verifyAuthUserorAdminEditRecurso, function (req, res) {
  Recurso.lookUp(req.params.id)
    .then(data => {
      if (data != null) {
        data.titulo = req.body.titulo;
        data.subtitulo = req.body.subtitulo;
        //tratar dos hashtags
        var tags = req.body.hashtags.split(',')
        data.hashtags = []
        tags.forEach(tag => {
          if (tag != '') data.hashtags.push(tag)
        })
        Recurso.edit(data)
          .then(dados => res.redirect('/recursos/' + data._id))
          .catch(err => res.render('RecursoInexistente', { user: req.user }))
      }

      else
        res.render('RecursoInexistente', { user: req.user })
    })
    .catch(err => res.render('RecursoInexistente', { user: req.user }))
});




// Preview Recurso (sem ser o inicial)
router.get('/:id/*', Auth.verifyAuth, function (req, res) {


  var path_recurso = req.url.split('/').slice(1)

  console.log("obter recurso uma pasta")

  Recurso.lookUp(path_recurso[0])
    .then(dados => {

      if (dados != null) {

        var mani = JSON.parse(dados.manifesto);
        var tail_path = path_recurso.slice(1).join('/')

        var man_result = travman.travessiaManifesto(tail_path, mani)
        if (man_result != null && man_result != true) {

          log("                           path: " + path_recurso.join('/'))
          console.log("Manifesto" + JSON.stringify(mani))
          log("ataoz  ")
          log(man_result)
          res.render('recurso', { manifesto: man_result, recurso: dados, path_g: dados.path + '/data/' + path_recurso.slice(1).join('/') + '/', download: path_recurso.join('/'), user: req.user })
        }

        else res.render('DiretorioRecursoInvalido', { user: req.user })

      } else {
        res.render('RecursoInexistente', { user: req.user })
      }
    })



    .catch(erro => res.render('error', { error: erro }))


});







// Upload de um recurso
router.post('/novo', upload.single('myFile'), Auth.verifyAuthUserorAdminCreate, function (req, res) {



  if (req.file != null) {
    console.log("POST   " + JSON.stringify(req.body))


    if (req.file.mimetype == 'application/zip') {

        Zip.unzip(req.file.path) //this is sync

        var fl = true;
        Tipo.list().then(dados => {
          fl = checkman.processaManifesto(__dirname + '/../' + req.file.path + 'dir', dados)
          // se o pacote corresponder com o manifesto vamos inserir
          if (fl) {

            //ler manifesto 
            var obj_json = __dirname + '/../' + req.file.path + 'dir' + '/manifesto.json'
            req.body.manifesto = JSON.stringify(require(obj_json))

            //tratar dos hashtags
            var tags = req.body.hashtags.split(',')
            req.body.hashtags = []
            tags.forEach(tag => {
              if (tag != '') req.body.hashtags.push(tag)
            })


            log("O MANIEFESTO" + req.body.manifesto)

            var dest = newPath.createPath(req.body);

            Recurso.insert(req.body, dest, req.user)
              .then(dados => {

                let oldPath = __dirname + '/../' + req.file.path + 'dir';
                log("oldPath: " + oldPath)

                let newPath = __dirname + '/../public/' + dados.path;
                log("newPath: " + newPath)

                let dir = __dirname + '/../public/' + dest;

                if (fs.existsSync(dir) == false) fs.mkdirSync(dir)

                log("Inseri o objeto:" + dados._id + "bd obj" + dados.path)

                fs.renameSync(oldPath, newPath)
                res.redirect('/recursos/' + dados._id)
              })
              .catch(erro => res.render('error', { error: erro }))
          }
          else {
            res.render('RecursoManifestoInválido', { user: req.user })
            rm.deleteFolderRec(__dirname + '/../' + req.file.path + 'dir')
            fs.unlinkSync(req.file.path);
          

          }


        })

    }
    else {
      res.render('RecursoFormatoInválido', { user: req.user })
      rm.deleteFolderRec(__dirname + '/../' + req.file.path + 'dir')
      fs.unlinkSync(req.file.path);
    }

  }
  else res.render('UploadSemSucesso', { user: req.user })

});



module.exports = router;
