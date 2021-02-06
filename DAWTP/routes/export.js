var express = require('express');
var router = express.Router();

var Recurso = require('../controllers/recursos')
var Tipo = require('../controllers/tipos')
var User = require('../controllers/utilizadores')

var { log } = require('../public/javascripts/debug')
var exportcsv = require('../public/javascripts/exportCSV')
var Zip = require('../public/javascripts/unzip')
var date = require('../public/javascripts/mymood')
var fs = require('fs');
var Auth = require('../public/javascripts/verifyauth.js')




function writetoCsv(path, str) {
  fs.writeFileSync(path, str + '\n', { flag: 'a+' }, (err) => {
    if (err) {
      throw err;
    }
  })
}

router.get('/', Auth.verifyAuthAdmin, function (req, res) {
  res.render('menu_export', { user: req.user })
});

router.get('/recursos', Auth.verifyAuthAdmin, function (req, res) {

  Recurso.list()
    .then(data => {


      var zipobj = Zip.create_zip()

      var nome = 'export-recursos' + Math.random() + '-' + date.myDateTime()
      var nome_zipFinal = nome + '.zip'
      var nome_csv = nome + '.csv'
      writetoCsv(__dirname + '/../tempzip/' + nome_csv, exportcsv.csvRecurso)

      var promisses = []

      let criar_promessas = new Promise((resolve) => {


        for (var i = 0; i < data.length; i++) {
          var recurso = data[i]
          writetoCsv(__dirname + '/../tempzip/' + nome_csv, exportcsv.recursoToCSV(recurso))

          let pins = new Promise((resolve) => {
            log(exportcsv.recursoToCSV(recurso))
            //Escrever para o csv este recurso

            var path_zip = recurso.path //+ '/data'
            var nome_zip = recurso.id + '.zip'
            var temp_zip = '../tempzip/' + nome_zip
            try{

            //zipa o recurso
            //Zip.zipBigFiles(path_zip, nome_zip).then(() => {
            Zip.zip(path_zip, nome_zip)

            //Adiciona o zip do recurso ao zip geral
            //zipAddtoBigZip(__dirname + '/' + temp_zip, nome_zipFinal).then(() => {
            
            Zip.add_file_to_zip( temp_zip, zipobj)

            //Elimina o zip do recurso
            fs.unlinkSync(__dirname + '/' + temp_zip);

            resolve()


            }catch(err){ log(err);}
          })
          promisses.push(pins)
        }
          resolve()
      })


      criar_promessas.then(() => Promise.all(promisses).then(() => {

        Zip.add_file_to_zip('../tempzip/'+ nome_csv, zipobj)

        //elimina o csv
        fs.unlinkSync(__dirname + '/../tempzip/' + nome_csv);
        Zip.close_zip(nome_zipFinal, zipobj)


        res.download(__dirname + '/../tempzip/' + nome_zipFinal, function (err) {
          //elimina o zip geral
          fs.unlinkSync(__dirname + '/../tempzip/' + nome_zipFinal);

          if (err) log("Erro" + err)
        });

      })
        .catch(err => res.render('error', { error: err }))
      ).catch(err => res.render('error', { error: err }))


    }).catch(err => res.render('error', { error: err }))

});

router.get('/utilizadores', Auth.verifyAuthAdmin, function (req, res) {


  var nome = 'export:users:' + Math.random() + ':' + date.myDateTime()
  var nome_csv = nome + '.csv'
  writetoCsv(__dirname + '/../tempfile/' + nome_csv, exportcsv.csvUtilizador)

  User.list()
    .then(data => {

      data.forEach(user => {
        writetoCsv(__dirname + '/../tempfile/' + nome_csv, exportcsv.utilizadorToCSV(user))
      })
      res.download(__dirname + '/../tempfile/' + nome_csv, function (err) {
        fs.unlinkSync(__dirname + '/../tempfile/' + nome_csv);
        if (err) log(err)
      });


    })
    .catch(err => res.render('error', { error: err }))

});


router.get('/tipos', Auth.verifyAuthAdmin, function (req, res) {


  var nome = 'export:tipo:' + Math.random() + ':' + date.myDateTime()
  var nome_csv = nome + '.csv'
  writetoCsv(__dirname + '/../tempfile/' + nome_csv, exportcsv.csvTipo)

  Tipo.list()
    .then(data => {

      data.forEach(tipo => {
        writetoCsv(__dirname + '/../tempfile/' + nome_csv, exportcsv.tipoToCSV(tipo))
      })
      res.download(__dirname + '/../tempfile/' + nome_csv, function (err) {
        fs.unlinkSync(__dirname + '/../tempfile/' + nome_csv);
        if (err) log(err)
      });


    })
    .catch(err => res.render('error', { error: err }))

});




module.exports = router;
