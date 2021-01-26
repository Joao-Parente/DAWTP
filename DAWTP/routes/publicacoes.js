const { json } = require('body-parser');
var express = require('express');
var router = express.Router();

var Recurso = require('../controllers/recursos')

var data_agr = require('../public/javascripts/mymood')

var { debug } = require('../public/javascripts/debug')





router.get('/:idrecurso/novo', function (req, res) {

  Recurso.lookUp(req.params.idrecurso)
    .then(dados => {

      var id = data_agr.myDateTime() + 'f' + Math.random();
      var user = "user_na_sessao"
      var conteudo = " conteudo"

      var jsonStr = '{"meta":{"_id":"' + id + '","nome":"' + user + '",\
      "conteudo":"' + conteudo + '","data":"' + data_agr.myDateTime() + '"},\
      "coments":[]}';

      dados.posts.push(JSON.parse(jsonStr));
      if (debug) console.log("DADOSSS")
      if (debug) console.log(dados)
      Recurso.edit(dados).then().catch();

      res.redirect('/publicacoes/' + req.params.idrecurso + '/' + id)

    })
    .catch(err => res.render('error', { error: err }))


});




router.get('/:idrecurso/:idpost', function (req, res) {

  Recurso.lookUp(req.params.idrecurso)
    .then(dados => {

      dados.posts.forEach(post => {

        if (post.meta.id == req.params.idpost) {

          
      
          res.render('post', { infopost:post.meta,idrecurso: req.params.idrecurso, idpost: req.params.idpost ,user:req.user})
        }
      });



    })

    .catch(err => res.render('error', { error: err }))





});




// para o jquery vir buscar os comentarios
router.get('/:idrecurso/:idpost/coments', function (req, res) {


  Recurso.lookUp(req.params.idrecurso)
    .then(dados => {


      dados.posts.forEach(post => {

        if (post.meta.id == req.params.idpost) {


          var jsonStr = '{"comentarios":[]}';
          var obj = JSON.parse(jsonStr);

          post.coments.forEach(function (coment) {
            obj["comentarios"].push(coment);
          });

          jsonStr = JSON.stringify(obj.comentarios);
          res.status(200).json(jsonStr)

        }

      })
    })
    .catch(err => res.render('error', { error: err }))

});


router.post('/:idrecurso/:idpost/coments', function (req, res) {

  if (req.body.conteudo != "") {

    console.log("hi");
    Recurso.lookUp(req.params.idrecurso)
      .then(dados => {

        dados.posts.forEach(post => {

          if (post.meta._id == req.params.idpost) {
            console.log(post.coments);
            var newComent = JSON.parse('{ "_id":"' + 'idestu' + '","nome":"' + 'nomesest' + '","conteudo":"' + req.body.conteudo + '","data":"' + data_agr.myDateTime() + '"}');
            post.coments.push(newComent);
            console.log("antes");
            console.log(post.coments);
            Recurso.edit(dados).then().catch();

          }
        })




      })
      .catch(err => res.render('error', { error: err }))
  }
});

//Obter posts de um recurso
router.get('/:idrecurso', function (req, res) {


  Recurso.lookUp(req.params.idrecurso)
    .then(dados => {

      var objlist = []

      dados.posts.forEach(post => {

        var obj_post = post;
        obj_post.idrecurso=dados.id;
        obj_post.idpost=post.meta.id;
        obj_post.titulo_recurso = dados.titulo;
        obj_post.publicador_recurso = dados.produtor;


        objlist.push(obj_post)

      })
      res.render('posts',{list: objlist,user:req.user})
    })
    .catch(err => res.render('error', { error: err }))

});


module.exports = router;
