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
    
    //Atributos que dependem da altura da insercao
    ar.produtor = user._id
    if(ar.visibilidade == undefined) ar.visibilidade='publico'
    ar.dataRegisto = data.myDateTime()
    ar.likes = []

   
   if(ar._id ==undefined) ar._id = ar.dataRegisto+'-'+Math.random()

   if(ar.titulo ==undefined || ar.titulo=='') ar.titulo=ar._id

   if(ar.dataCriacao == undefined || ar.dataCriacao == null|| ar.dataCriacao == '')  ar.dataCriacao = data.myDateTime()
   

    ar.hashtags = ar.hashtags.split(",");


    //path
    ar.path = dest + ar._id;



    
    var newRecurso = new Recurso(ar)
    return newRecurso.save();
}

module.exports.edit = t => {
    return Recurso.findByIdAndUpdate({_id: t._id}, t, {new: true})
}



module.exports.remove = i => {
    
    return Recurso.deleteOne({id: i})
                  .exec()
}

