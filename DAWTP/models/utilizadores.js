var mongoose = require('mongoose')


var fil = new mongoose.Schema({
    estudante:Boolean,
    docente:Boolean,
    curso:String,
    departamento:String

});

var utilizadoresSchema = new mongoose.Schema({
    nome: String,
    email: String,
    filiacao: fil,
    dataRegisto:Date,
    dataUltimoAcesso:Date,
    username:String,
    password:String,
    nivel:Number,
    posts:[String]

});

module.exports= mongoose.model('utilizador', utilizadoresSchema,'utilizadores')