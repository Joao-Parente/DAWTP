var mongoose = require('mongoose')

var postsmeta  = new mongoose.Schema({
    nome:String,
    conteudo:String,
    data:Date,

});


var comentarios  = new mongoose.Schema({
    comentarios:postsmeta
});




var recursosSchema = new mongoose.Schema({
    id:String,
    tipo: String,
    titulo:String,
    subtitulo:String,
    dataCriacao:Date,
    dataRegisto:Date,
    produtor:String,
    visibilidade:String,
    likes:Number,
    hashtags:[String],
    posts:[postsmeta,[comentarios]],


});

module.exports= mongoose.model('recurso', recursosSchema)
