var express = require('express');
var router = express.Router();


var Tipo = require('../controllers/tipos')



/* GET users listing. */
router.get('/', function(req, res) {
  Tipo.list()
    .then(data => {

      res.render('tipos', { list: data })
    })
    .catch(err => res.render('error', { error: err }))
});





module.exports = router;
