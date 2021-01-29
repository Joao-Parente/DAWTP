//Artigo controller

var Recurso = require('../models/recursos')
var data = require('../public/javascripts/mymood')
var {myDateTime} = require('../public/javascripts/mymood')


//Return student arst
module.exports.list = () => {
    return Recurso
            .find()
            .sort({titulo:1,ano:-1})
            .exec()
}
module.exports.listHashtags = (htags) => {
    return Recurso
            .find({ hashtags : { $all : htags }})
            .sort({titulo:1,ano:-1})
            .exec()
}

module.exports.lookUp = i => {
    return Recurso
        .findOne({_id: i })
        .exec()
}

module.exports.insert = (ar, dest,user) =>{
    
    //Atributos que dependem de quem insere
    ar.produtor = user._id

    // o Input de uma data num form se não puser nada vem definido como ''
    console.log(ar)
    if(ar.dataCriacao=='') ar.dataCriacao= myDateTime()

    //Path
    if(ar._id ==undefined) ar._id = (myDateTime()+'-'+Math.random()).replace(/[:]/g, '')
    ar.path = dest + ar._id;


    var newRecurso = new Recurso(ar)
    return newRecurso.save();
}

module.exports.edit = t => {
    return Recurso.findByIdAndUpdate({_id: t._id}, t, {new: true})
}



module.exports.remove = i => {
    
    return Recurso.deleteOne({_id: i})
                  .exec()
}



module.exports.listHashtags = (htags) => {
    return Recurso
            .find({ hashtags : { $all : htags }})
            .sort({dataCriacao:-1,titulo:1})
            .exec()
}

module.exports.listAno = (ano) => {
    var startDate = ano + "-01-01T00:00:00.000Z";
    var endDate = ano + "-12-31T00:00:00.000Z";
    return Recurso
            .find({ dataCriacao :  { $gte: new Date(startDate), $lte: new Date(endDate) }})
            .sort({titulo:1})
            .exec()
}

module.exports.listTitulo = () => {
    return Recurso
            .find()
            .sort({titulo:1})
            .exec()
}

module.exports.listAntigos = () => {
    return Recurso
            .find()
            .sort({dataCriacao:1,titulo:-1})
            .exec()
}

module.exports.listLikes = () => {
    return Recurso
            .aggregate([
                { "$project": {
                    "_id": 1,
                    "titulo": 1,
                    "subtitulo": 1,
                    "dataCriacao": 1,
                    "dataRegisto": 1,
                    "produtor": 1,
                    "visibilidade": 1,
                    "path": 1,
                    "manifesto": 1,
                    "hashtags": 1,
                    "posts": 1,
                    "likes": 1,
                    "length": { "$size": "$likes" }
                }},
                { "$sort": { "length": -1 } }
            ])
            .exec()
}


module.exports.listNoticia = () => {
    return Recurso
            .find({visibilidade: "publico"})
            .sort({dataCriacao:1})
            .limit(5)
            .exec()
}