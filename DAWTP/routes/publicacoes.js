const { json } = require('body-parser');
var express = require('express');
var router = express.Router();

var Recurso = require('../controllers/recursos')

var data_agr = require('../public/javascripts/mymood')

var { debug } = require('../public/javascripts/debug')
var { myDateTime } = require('../public/javascripts/mymood')


var Auth = require('../public/javascripts/verifyauth.js')





router.get('/:idrecurso/novo', Auth.verifyAuth, function (req, res) {

  Recurso.lookUp(req.params.idrecurso)
    .then(dados => {

      var id = data_agr.myDateTime() + 'f' + Math.random();
      var user = req.user._id
      var conteudo = "Conteudo"

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




router.get('/:idrecurso/:idpost', Auth.verifyAuth, function (req, res) {

  Recurso.lookUp(req.params.idrecurso)
    .then(dados => {

      dados.posts.forEach(post => {

        if (post.meta.id == req.params.idpost) {



          res.render('post', { recurso: dados, infopost: post.meta, idrecurso: req.params.idrecurso, idpost: req.params.idpost, user: req.user })
        }
      });



    })

    .catch(err => res.render('error', { error: err }))





});
router.get('/:idrecurso/:idpost/editar', Auth.verifyAuthUserorAdminEditRecurso, function (req, res) {
  console.log(req.params.idrecurso)
  Recurso.lookUp(req.params.idrecurso)
    .then(data => {
      if (data != null) {
        data.posts.forEach(post => {

          if (post.meta._id == req.params.idpost) {


            res.render('edit-post-form', { user: req.user, recurso: data, post: post })
          }
        })

      } else
        res.render('RecursoInexistente', { user: req.user })
    })
    .catch(err => { console.log(err); res.render('RecursoInexistente', { user: req.user }) })
});
router.post('/:idrecurso/:idpost/editar', Auth.verifyAuthUserorAdminEditRecurso, function (req, res) {
  Recurso.lookUp(req.params.idrecurso)
    .then(data => {

      if (data != null) {
        data.posts.forEach(post => {

          if (post.meta._id == req.params.idpost) {

            post.meta.conteudo = req.body.conteudo;
            Recurso.edit(data)
              .then(dados => res.redirect('/publicacoes/'+req.params.idrecurso+'/' + req.params.idpost))
              .catch(err => res.render('RecursoInexistente', { user: req.user }))

          }
         else res.render('PostInexistente', { user: req.user })

        })
      } else res.render('RecursoInexistente', { user: req.user })
    })
    .catch(err => res.render('RecursoInexistente', { user: req.user }))
});


router.get('/:idrecurso/:idpost/delete', Auth.verifyAuthUserorAdminEditRecurso, function (req, res) {

  Recurso.lookUp(req.params.idrecurso)
    .then(data => {
      if (data != null) {
        data.posts.forEach(post => {

          if (post.meta._id == req.params.idpost) {

            data.posts.splice(data.posts.indexOf(post), 1);

            Recurso.edit(data)
              .then(dados => {      
              res.redirect('/recursos/'+req.params.idrecurso )})
              .catch(err => res.render('RecursoInexistente', { user: req.user }))

          }
         else res.render('PostInexistente', { user: req.user })

        })
      } else res.render('RecursoInexistente', { user: req.user })
    })
    .catch(err =>{console.log(err); res.render('RecursoInexistente', { user: req.user })})
});

// para o jquery vir buscar os comentarios
router.get('/:idrecurso/:idpost/coments', Auth.verifyAuth, function (req, res) {


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


router.post('/:idrecurso/:idpost/coments', Auth.verifyAuth, function (req, res) {
  console.log("tou")
  console.log(req.body)
  if (req.body.conteudo != "") {


    Recurso.lookUp(req.params.idrecurso)
      .then(dados => {

        dados.posts.forEach(post => {

          if (post.meta._id == req.params.idpost) {
            try {
              console.log("Aqui")
              console.log(post.coments);
              var newComent = JSON.parse('{ "_id":"' + myDateTime() + '-' + Math.random() + '","nome":"' + req.user._id + '","conteudo":"' + req.body.conteudo + '","data":"' + data_agr.myDateTime() + '"}');
              post.coments.push(newComent);
              console.log("antes");
              console.log(post.coments);
              Recurso.edit(dados).then(console.log("sucess added")).catch(
                err => console.log("Erro" + err)
              );
            }
            catch (err) { console.log(err) }
          }
        })




      })
      .catch(err => res.render('error', { error: err }))
  }
});

//Obter posts de um recurso
router.get('/:idrecurso', Auth.verifyAuth, function (req, res) {


  Recurso.lookUp(req.params.idrecurso)
    .then(dados => {

      var objlist = []

      dados.posts.forEach(post => {

        var obj_post = post;
        obj_post.idrecurso = dados.id;
        obj_post.idpost = post.meta.id;
        obj_post.titulo_recurso = dados.titulo;
        obj_post.publicador_recurso = dados.produtor;


        objlist.push(obj_post)

      })
      res.render('posts', { list: objlist, user: req.user })
    })
    .catch(err => res.render('error', { error: err }))

});


module.exports = router;
