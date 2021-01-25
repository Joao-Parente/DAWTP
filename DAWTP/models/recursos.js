var mongoose = require('mongoose')

var postsmeta  = new mongoose.Schema({
    id:String,
    nome:String,
    conteudo:String,
    data:Date,

});


var postaux= new mongoose.Schema({
    meta:postsmeta,
    coments:[postsmeta]
});


var recursosSchema = new mongoose.Schema({
    _id:String,
    titulo:String,
    subtitulo:String,
    dataCriacao:Date,
    dataRegisto:Date,
    produtor:String,
    visibilidade:String,    
    likes:[String],
    path:String,

    manifesto:String,
    hashtags:[String],
    posts:[postaux],


});

module.exports= mongoose.model('recurso', recursosSchema)
