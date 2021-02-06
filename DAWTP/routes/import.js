var express = require('express');
var router = express.Router();

var Recurso = require('../controllers/recursos')
var Utilizador = require('../controllers/utilizadores')
var Tipo = require('../controllers/tipos')
var LineReaderSync = require("line-reader-sync")


var { log } = require('../public/javascripts/debug')
var Zip = require('../public/javascripts/unzip')

var fs = require('fs');
var rm = require('../public/javascripts/rmrecursivo');

var newPath = require('../public/javascripts/createpath')
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })

var checkman = require('../public/javascripts/checkmanifesto')
var importCSV = require('../public/javascripts/importCSV')
var Auth = require('../public/javascripts/verifyauth.js')

function addlog(id, status, str, array, link) {

  var result = []
  if (array != null) result = array;

  result.push({ input: id, status: status, msg: str, link: link }) // para link colocar status 201
  return result
}

router.get('/', Auth.verifyAuthAdmin, function (req, res) {
  res.render('menu_import', { user: req.user })
});

router.get('/recursos', Auth.verifyAuthAdmin, function (req, res) {
  res.render('import-recurso', { user: req.user })
});
router.get('/utilizadores', Auth.verifyAuthAdmin, function (req, res) {
  res.render('import-utilizador', { user: req.user })
});
router.get('/tipos', Auth.verifyAuthAdmin, function (req, res) {
  res.render('import-tipo', { user: req.user })
});

router.post('/tipos', upload.single('myFile'), Auth.verifyAuthAdmin, function (req, res) {


  if (req.file != null) {

    if (req.file.mimetype == 'text/csv') {
      var alog = []


      var promisses = []

      let criar_promessas = new Promise((resolve) => {
        var first_line = true


        var lrs = new LineReaderSync(req.file.path)


        var flag_ciclo = true;
        while (flag_ciclo) {
          var line = lrs.readline()
          if (line == null) {
            flag_ciclo = false
            resolve()
          }
          else {
            if (first_line) first_line = false;
            else {
              let pins = new Promise((resolve) => {
                var tipo = importCSV.csvToTipo(line)
                var linha = line
                Tipo.insert(tipo)
                  .then(dados => {
                    alog = addlog(linha, 201, "Importado com sucesso", alog, '/tipos/' + dados._id)
                    resolve()
                  })
                  .catch(err => { log(err); alog = addlog(linha, 409, "Não conseguiu importar,inserção inválida", alog, null); resolve() })
              })
              promisses.push(pins)
            }
          }
        }
      })
      criar_promessas.then(() => { Promise.all(promisses).then(() => { log("Esperei por tudo"); fs.unlinkSync(req.file.path); res.render('resultado_import', { lista: alog, user: req.user }) }) })




    } else {
      res.render('ImportFormatoInválidoUT', { user: req.user })
    }
  }
  else res.render('UploadSemSucesso', { user: req.user })

})


router.post('/utilizadores', upload.single('myFile'), Auth.verifyAuthAdmin, function (req, res) {

  if (req.file != null) {

    if (req.file.mimetype == 'text/csv') {

      var alog = []

      var promisses = []

      let criar_promessas = new Promise((resolve) => {
        var first_line = true


        var lrs = new LineReaderSync(req.file.path)


        var flag_ciclo = true;
        while (flag_ciclo) {
          var line = lrs.readline()
          if (line == null) {
            flag_ciclo = false
            resolve()
          }
          else {
            if (first_line) first_line = false;
            else {
              let pins = new Promise((resolve) => {
                var user = importCSV.csvToUtilizador(line)
                var linha = line
                Utilizador.insert(user)
                  .then(dados => {
                    alog = addlog(linha, 201, "Importado com sucesso", alog, '/utilizadores/' + user._id)
                    resolve()
                  })
                  .catch(err => { log(err); alog = addlog(linha, 409, "Não conseguiu importar, inserção inválida", alog, null); resolve() })
              })
              promisses.push(pins)
            }
          }
        }
      })
      criar_promessas.then(() => { Promise.all(promisses).then(() => { log("Esperei por tudo"); fs.unlinkSync(req.file.path); res.render('resultado_import', { lista: alog, user: req.user }) }) })



    }
    else {
      log(req.file)
      res.render('ImportFormatoInválidoUT', { user: req.user })
    }

  }
  else res.render('UploadSemSucesso', { user: req.user })

})




router.post('/recursos', upload.single('myFile'), Auth.verifyAuthAdmin, function (req, res) {

  if (req.file != null) {


    if (req.file.mimetype == 'application/zip') {

      var alog = []
      Zip.unzip(req.file.path)

      let dirCont = fs.readdirSync(__dirname + '/../' + req.file.path + 'dir');
      let files = dirCont.filter(function (elm) { return elm.match(/.*\.csv/); });
      log(files)

      Tipo.list().then(dados => {




        var promisses = []

        let criar_promessas = new Promise((resolve) => {
          var first_line = true


          var lrs = new LineReaderSync(req.file.path + 'dir/' + files[0])


          var flag_ciclo = true;
          while (flag_ciclo) {
            var line = lrs.readline()
            if (line == null) {
              flag_ciclo = false
              resolve()
            }
            else {
              if (first_line) first_line = false;
              else {
                let pins = new Promise((resolve) => {


                  var recurso = importCSV.csvToRecurso(line)
                  var linha = line

                  fs.renameSync(__dirname + '/../' + req.file.path + 'dir/' + recurso._id + '.zip', __dirname + '/../' + req.file.path + 'dir/' + recurso._id)
                  Zip.unzip(__dirname + '/../' + req.file.path + 'dir/' + recurso._id)

                  var fl = true;


                  fl = checkman.processaManifesto(__dirname + '/../' + req.file.path + 'dir/' + recurso._id + 'dir', dados)
                  if (fl) {

                    var obj_json = __dirname + '/../' + req.file.path + 'dir/' + recurso._id + 'dir/manifesto.json'
                    recurso.manifesto = JSON.stringify(require(obj_json))


                    var dest = newPath.createPath(recurso);


                    Recurso.insert(recurso, dest, req.user)
                      .then(dados => {
                        let oldPath = __dirname + '/../' + req.file.path + 'dir/' + recurso._id + 'dir'

                        let newPath = __dirname + '/../public/' + dados.path;
                        let dir = __dirname + '/../public/' + dest;
                        if (fs.existsSync(dir) == false) fs.mkdirSync(dir)
                        fs.renameSync(oldPath, newPath)
                        alog = addlog(linha, 201, "Importado com sucesso", alog, '/recursos/' + recurso._id)
                        resolve()
                      })
                      .catch(err => { log(err); alog = addlog(linha, 409, "Não conseguiu importar, inserção não foi possível", alog, null); resolve() })

                  }
                  else { alog = addlog(linha, 409, "Não conseguiu importar, manifesto não é válido", alog, null); resolve(); }
                })
                promisses.push(pins)

              }
            }
          }
        }); criar_promessas.then(() => { Promise.all(promisses).then(() => { log("Esperei por tudo"); rm.deleteFolderRec(__dirname + '/../' + req.file.path + 'dir/'); res.render('resultado_import', { lista: alog, user: req.user }) }) })
          .catch(err => { log(err); rm.deleteFolderRec(__dirname + '/../' + req.file.path + 'dir/'); res.render('error', { erro: err }) }) // a criar promessas

      })
        .catch(err => { log(err); rm.deleteFolderRec(__dirname + '/../' + req.file.path + 'dir/'); res.render('error', { erro: err }) }) // a obter tipos

    } else {
      log(req.file)
      res.render('ImportFormatoInválidoR', { user: req.user })
    }


  }
  else res.render('UploadSemSucesso', { user: req.user })
});

module.exports = router;
