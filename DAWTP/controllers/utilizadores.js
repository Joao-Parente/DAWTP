//utilizador controller

var Utilizador = require('../models/utilizadores')
var tempo = require('../public/javascripts/mymood')


//Return student list
module.exports.list = () => {
    return Utilizador
            .find()
            .sort({nome:1})
            .exec()
}

module.exports.lookUp = id => {
    return Utilizador
        .findOne({username: id })
        .exec()
}

module.exports.insert = utili =>{

   var d=tempo.myDateTime()

    utili.dataRegisto=d
    utili.dataUltimoAcesso=d
    var newUtilizador = new Utilizador(utili)

    return newUtilizador.save()
}
