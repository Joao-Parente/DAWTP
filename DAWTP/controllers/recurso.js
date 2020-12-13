//Artigo controller

var Recurso = require('../models/recurso')



//Return student arst
module.exports.list = () => {
    return Recurso
            .find()
            .sort({titulo:1,ano:-1})
            .exec()
}

module.exports.lookUp = i => {
    return Recurso
        .findOne({id: i })
        .exec()
}

module.exports.insert = ar =>{
    var newRecurso = new Recurso(ar)
    return newRecurso.save()
}


module.exports.edit = ar => {
    return Recurso 
    .updateOne({id: ar.id}, {$set: {titulo: ar.titulo,
        subtitulo: ar.subtitulo, dataCriacao: ar.dataCriacao,
        dataRegisto:ar.dataRegisto,produtor:ar.produtor,
        visibilidade:ar.visibilidade,likes:ar.likes,
        hashtags:ar.hashtags,posts:ar.posts,metadata:ar.metadata}})
    .exec()
} 


module.exports.remove = i => {
    
    return Recurso.deleteOne({id: i})
                  .exec()
}

