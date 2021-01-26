var mongoose = require('mongoose')
var {myDateTime} = require('../public/javascripts/mymood')


var postsmeta = new mongoose.Schema({
    _id: { type: String, required: true },
    nome: { type: String, required: true },
    conteudo: { type: String, required: true },
    data: { type: Date, default: myDateTime()}

});


var postaux = new mongoose.Schema({
    meta: { type: postsmeta, required: true },
    coments: { type: [postsmeta], default: [] }
});


var recursosSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    titulo: { type: String, required: true },
    subtitulo: { type: String,default:"" },
    dataCriacao: { type: Date, default: myDateTime()},
    dataRegisto: { type: Date, default: myDateTime()},
    produtor: { type: String, required: true },
    visibilidade: { type: String, default: "publico"},
    likes: { type: [String], default: [] },
    path: { type: String, required: true },

    manifesto: { type: String, required: true },
    hashtags: { type: [String], default: []},
    posts: { type: [postaux], default: [] }


});

module.exports = mongoose.model('recurso', recursosSchema)
