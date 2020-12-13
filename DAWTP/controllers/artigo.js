//Artigo controller

var Artigo = require('../models/artigo')



//Return student arst
module.exports.list = () => {
    return Artigo
            .find({tipo:"artigo"})
            .sort({titulo:1,ano:-1})
            .exec()
}

module.exports.lookUp = i => {
    return Artigo
        .findOne({id: i })
        .exec()
}

module.exports.insert = ar =>{
    var newArtigo = new Artigo(ar)
    return newArtigo.save()
}


module.exports.edit = ar => {
    return Artigo 
    .updateOne({id: ar.id}, {$set: {titulo: ar.titulo,
        subtitulo: ar.subtitulo, dataCriacao: ar.dataCriacao,
        dataRegisto:ar.dataRegisto,produtor:ar.produtor,
        visibilidade:ar.visibilidade,likes:ar.likes,
        hashtags:ar.hashtags,posts:ar.posts,metadata:ar.metadata}})
    .exec()
} 


module.exports.remove = i => {
    
    return Artigo.deleteOne({id: i})
                  .exec()
}

