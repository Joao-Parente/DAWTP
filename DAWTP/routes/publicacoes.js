const { json } = require('body-parser');
var express = require('express');
var router = express.Router();

var Recurso = require('../controllers/recursos')

var data_agr = require('../public/javascripts/mymood')
//decolve o html
router.get('/:idrecurso/:idpost', function (req, res) {

  Recurso.lookUp(req.params.idrecurso)
    .then(dados => {

      dados.posts.forEach(post => {

        if (post.meta.id == req.params.idpost) {

          res.render('post', { idrecurso: req.params.idrecurso, idpost: req.params.idpost })
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
          res.json(jsonStr)

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

      dados.posts.forEach( post =>{

        if (post.meta.id==req.params.idpost){
          console.log(post.coments);
          var newComent=JSON.parse('{ "id":"'+ 'idestu'+'","nome":"'+'nomesest' + '","conteudo":"'+ req.body.conteudo + '","data":"' + data_agr.myDateTime()+'"}' );
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

module.exports = router;
