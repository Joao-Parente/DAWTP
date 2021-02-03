//Artigo controller


var Tipo = require('../models/tipos')



//Return student arst
module.exports.list = () => {
    return Tipo
            .find()
            .exec()
}

module.exports.lookUp = i => {
    return Tipo
        .findOne({_id: i })
        .exec()
}

module.exports.insert = (ar =>{

    var newTipo = new Tipo(ar)
    return newTipo.save()
})

module.exports.edit = t => {
    return Tipo.findByIdAndUpdate({_id: t._id}, t, {new: true})
}

module.exports.remove = i => {
    
    return Tipo.deleteOne({_id: i})
                  .exec()
}

