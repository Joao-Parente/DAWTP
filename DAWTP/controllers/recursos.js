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
    if(ar._id ==undefined) ar._id = myDateTime()+'-'+Math.random()
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

