var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
mongoose.set('useFindAndModify', false);

var Tipo = require('../controllers/tipos')
var Auth = require('../public/javascripts/verifyauth.js')



router.get('/',Auth.verifyAuth, function(req, res) {
  Tipo.list()
    .then(data => {
      res.render('tipos', { list: data,user:req.user })
    })
    .catch(err => res.render('error', { error: err }))
});

//Novo Tipo - Carregar Página
router.get('/novo', Auth.verifyAuthUserorAdminCreate, function (req, res) {
  res.render('novo-tipo-form', { user: req.user })
});

//Add Novo tipo
router.post('/novo', Auth.verifyAuthUserorAdminCreate, function (req, res) {
  console.log("req_body: " + JSON.stringify(req.body))
  
  var tipos = {
    _id: req.body._id,
    parametros: []
  };

  if(req.body.count != ''){
    var nome_params = req.body.nome_param
    x = 0;
    nome_params.forEach(nome => {
      if (nome != ''){
        tipos.parametros.push({ 
          "nome_param" : req.body.nome_param[x],
          "tipo_param" : req.body.tipo_param[x]
        })
        //console.log("forEach: " + JSON.stringify(data.parametros[x].nome_param))
        x++;
      }
    })
  }else{
    tipos.parametros.push({ 
      "nome_param" : req.body.nome_param,
      "tipo_param" : req.body.tipo_param
    });
  }

  console.log("dados: " + JSON.stringify(tipos))
  Tipo.insert(tipos)
    .then(data => res.redirect('/tipos'))
    .catch(err => res.render('TipoNaoExiste', { user: req.user }))
});


//Delete tipo
router.get('/delete/:_id', Auth.verifyAuthUserorAdminCreate, function (req, res) {

  Tipo.lookUp(req.params._id)

    Tipo.remove(req.params._id)
      .then(el => res.redirect('/tipos'))
      .catch(err => res.render('TipoNaoExiste', { user: req.user }))
 
});

//Consultar 1 tipo
router.get('/:_id',Auth.verifyAuth, function (req, res) {
  Tipo.lookUp(req.params._id)
    .then(data => {

      if (data != null) {
        res.render('tipo', { tipo: data,user:req.user })
      }
      else {
        res.render('TipoNaoExiste',{user:req.user})
      }
    })
    .catch(err => res.render('error', { error: err }))
});


//Aceder a pagina de edição do tipo
router.get('/editar/:_id', Auth.verifyAuthUserorAdminCreate, function (req, res) {
  Tipo.lookUp(req.params._id)
    .then(data => {

      if (data != null)
        res.render('edit-tipo-form', { user: req.user, tipo: data })
      else
        res.render('TipoNaoExiste', { user: req.user })
    })
    .catch(err => res.render('error', { error: err }))
});


// Enviar o tipo atualizado
router.post('/editar/:_id', Auth.verifyAuthUserorAdminCreate, function (req, res) {
  Tipo.lookUp(req.params._id)
    .then(data => {
      if (data != null) {
        //console.log("edition: " + JSON.stringify(data))
        console.log("req_body: " + JSON.stringify(req.body))
        console.log("data_parametros: " + JSON.stringify(data))
        console.log("quantidade " + data.parametros.length)
        

        if(data.parametros.length > 1 || req.body.count != ''){
          //update nome_param
          var nome_params = req.body.nome_param
          x = 0;
          nome_params.forEach(nome => {
            if(nome != '' && (x+1)<=data.parametros.length){  
              data.parametros[x].nome_param=req.body.nome_param[x],
              data.parametros[x].tipo_param = req.body.tipo_param[x]
             
            }else if(nome != '' && (x+1)>=data.parametros.length){
              data.parametros.push({ 
                "nome_param" : req.body.nome_param[x],
                "tipo_param" : req.body.tipo_param[x]
              })
            }
            x++;
          })
        }
        else{
          data.parametros[0].nome_param = req.body.nome_param
          data.parametros[0].tipo_param = req.body.tipo_param
        }
  
        Tipo.edit(data)
          .then(dados => res.redirect('/tipos/' + data._id))
          .catch(err => res.render('TipoNaoEditavel', { user: req.user }))
      }
  
      })
      .catch(err => res.render('error', { error: err }))
  });
  


module.exports = router;