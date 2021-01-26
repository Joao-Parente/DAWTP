var mongoose = require('mongoose')
var {myDateTime} = require('../public/javascripts/mymood')

var fil = new mongoose.Schema({
    estudante: { type: Boolean, default: false},
    docente: { type: Boolean, default: false },
    curso: { type: String, default: "SemCurso" },
    departamento: { type: String, default: "SemDepartamento"}

});

var utilizadoresSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    password: { type: String, required: true },
    nome: { type: String, required: true },
    email: { type: String, required: true },
    filiacao: fil,
    dataRegisto: { type: Date, default: myDateTime()},
    dataUltimoAcesso: { type: Date, default: myDateTime() },
    nivel: { type: Number, default: 0}

});

module.exports = mongoose.model('utilizador', utilizadoresSchema, 'utilizadores')