//relatorio controller

var Relatorio = require('../models/relatorio')



//Return student list
module.exports.list = () => {
    return Relatorio
            .find({tipo:"relatorio"})
            .sort({titulo:1,ano:-1})
            .exec()
}

module.exports.lookUp = i => {
    return Relatorio
        .findOne({id: i })
        .exec()
}

module.exports.insert = rel =>{
    var newRelatorio = new Relatorio(rel)
    return newRelatorio.save()
}


module.exports.edit = rel => {
    return Relatorio 
    .updateOne({id: rel.id}, {$set: {titulo: rel.titulo,
        subtitulo: rel.subtitulo, dataCriacao: rel.dataCriacao,
        dataRegisto:rel.dataRegisto,produtor:rel.produtor,
        visibilidade:rel.visibilidade,likes:rel.likes,
        hashtags:rel.hashtags,posts:rel.posts,metadata:rel.metadata}})
    .exec()
} 


module.exports.remove = i => {
    
    return Relatorio.deleteOne({id: i})
                  .exec()
}

