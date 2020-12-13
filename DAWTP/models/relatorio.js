var mongoose = require('mongoose')


var postsmeta  = new mongoose.Schema({
    nome:String,
    conteudo:String,
    data:Date,

});

var comentarios  = new mongoose.Schema({
    comentarios:postsmeta
});
var meta  = new mongoose.Schema({
    instituicao:String,
    curso:String,
    autor:[String],
    numeroPag:Number
});



var relatorioSchema = new mongoose.Schema({
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
    metadata:meta



});

module.exports= mongoose.model('recurso', relatorioSchema)
