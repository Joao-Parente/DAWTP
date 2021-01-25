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
        .findOne({_id: id })
        .exec()
}



module.exports.insert = utili =>{


    utili._id=utili.username
    utili.dataRegisto=tempo.myDateTime()

    var newUtilizador = new Utilizador(utili)
    return newUtilizador.save()
}

module.exports.edit = t => {
    return Utilizador.findByIdAndUpdate({_id: t._id}, t, {new: true})
}


module.exports.delete = id => {
    return Utilizador.deleteOne({_id: id})
}