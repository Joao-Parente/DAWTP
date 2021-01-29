var express = require('express');
var router = express.Router();
var Recurso = require('../controllers/recursos')

var Auth = require('../public/javascripts/verifyauth.js')

/* GET home page. */
router.get('/', Auth.verifyAuth,function (req, res, next) {
  console.log(req.user)
  Recurso.listNoticia()
    .then(data => {
      res.render('index', { title: 'Recursos Académicos', user:req.user, data:data});
    })
    .catch(err => res.render('error', { error: err }))
  
});

  


module.exports = router;
