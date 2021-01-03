const { json } = require('body-parser');
var express = require('express');
var router = express.Router();

var Recurso = require('../controllers/recursos')

//decolve o html
router.get('/:idrecurso/:idpost', function (req, res) {

  Recurso.lookUp(req.params.idrecurso)
    .then(dados => {

      dados.posts.forEach(post => {

        if (post.meta.id == req.params.idpost) {


          res.render('post',{ idrecurso: req.params.recurso ,idpost: req.params.idpost})
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

    });


router.post('/:idrecurso/:idpost/coments', function (req, res) {

  console.log(req.body.conteudo);
});

module.exports = router;
