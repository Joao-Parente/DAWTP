//Artigo controller

var Tipo = require('../models/tipos')



//Return student arst
module.exports.list = () => {
    return Tipo
            .find()
            .sort({titulo:1,ano:-1})
            .exec()
}

module.exports.lookUp = i => {
    return Tipo
        .findOne({nome: i })
        .exec()
}

module.exports.insert = ar =>{
    var newTipo = new Tipo(ar)
    return newTipo.save()
}



