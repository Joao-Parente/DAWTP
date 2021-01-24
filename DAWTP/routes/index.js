var express = require('express');
var router = express.Router();

var Auth = require('../public/javascripts/verifyauth.js')

/* GET home page. */
router.get('/', Auth.verifyAuth,function (req, res, next) {
  console.log(req.user)
  res.render('index', { title: 'Recursos Académicos' ,user:req.user});
});

  


module.exports = router;
