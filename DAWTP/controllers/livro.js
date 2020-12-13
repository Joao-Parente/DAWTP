//livro controller

var Livro = require('../models/livro')



//Return student list
module.exports.list = () => {
    return Livro
            .find({tipo:"livro"})
            .sort({titulo:1,ano:-1})
            .exec()
}

module.exports.lookUp = i => {
    return Livro
        .findOne({id: i })
        .exec()
}

module.exports.insert = li =>{
    var newLivro = new Livro(li)
    return newLivro.save()
}


module.exports.edit = li => {
    return Livro 
    .updateOne({id: li.id}, {$set: {titulo: li.titulo,
        subtitulo: li.subtitulo, dataCriacao: li.dataCriacao,
        dataRegisto:li.dataRegisto,produtor:li.produtor,
        visibilidade:li.visibilidade,likes:li.likes,
        hashtags:li.hashtags,posts:li.posts,metadata:li.metadata}})
    .exec()
} 


module.exports.remove = i => {
    
    return Livro.deleteOne({id: i})
                  .exec()
}

