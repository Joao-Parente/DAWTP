//utilizador controller

var Utilizador = require('../models/utilizadores')


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
    var newUtilizador = new Utilizador(utili)
    return newUtilizador.save()
}
