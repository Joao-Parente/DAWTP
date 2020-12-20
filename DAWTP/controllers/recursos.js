//Artigo controller

var Recurso = require('../models/recursos')
var data = require('../public/javascripts/mymood')


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

    ar.produtor="depende do login"
    ar.dataRegisto=data.myDateTime()
    ar.likes=0
    ar.id=ar.dataRegisto+ar.titulo

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

