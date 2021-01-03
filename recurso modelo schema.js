var mongoose = require('mongoose')

var postsmeta  = new mongoose.Schema({
    nome:String,
    conteudo:String,
    data:Date,

});


var comentarios  = new mongoose.Schema({
    comentarios:postsmeta
});




var meta_informacao = new mongoose.Schema({
    
   nome:String,
   valor:String

});
var ficheiro = new mongoose.Schema({
    
    nome:String,
    tipo:String,
    meta:[meta_informacao]

});


var pasta = new mongoose.Schema({
    
    nome:String,
});

var manifest = new mongoose.Schema({
    
    ficheiros:[ficheiro],
    pasta_rec:[pasta]
});

pasta.add({ pasta: manifest });


var recursosSchema = new mongoose.Schema({
    id:String,
    titulo:String,
    subtitulo:String,
    dataCriacao:Date,
    dataRegisto:Date,
    produtor:String,
    visibilidade:String,    
    likes:Number,
    path:String,

    manifesto:manifest,
    hashtags:[String],
    posts:[postsmeta,[comentarios]],


});

module.exports= mongoose.model('recurso', recursosSchema)
