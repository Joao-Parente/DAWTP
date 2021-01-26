var fs = require('fs');
//const recursos = require('../../models/recursos');
var { log } = require('./debug')
const Recursos = require('../../controllers/recursos');
const User = require('../../controllers/utilizadores');
const Tipos = require('../../controllers/tipos');

var { inspect } = require('util')


module.exports.csvRecurso = "_id,titulo,subtitulo,dataCriacao,dataRegisto,produtor,visibilidade,[likes],[hastags],[post]"
module.exports.csvUtilizador = "_id,nome,email,[estudante,docente,curso,departamento],dataRegisto,dataUltimoAcesso,password,nivel"
module.exports.csvTipo = "_id,[param]"

tipoToCSV = (tipo) => {
    var linha = tipo._id + ",["

    for (var i = 0; i < tipo.parametros.length; i++) {

        linha += tipo.parametros[i].nome_param + '#' + tipo.parametros[i].tipo_param
        if (i + 1 != tipo.parametros.length) linha += ";"
    }
    linha += "]"

    return linha;
}
module.exports.tipoToCSV = tipoToCSV


utilizadorToCSV = (utilizador) => {
    var linha = utilizador._id + ',' + utilizador.nome + "," + utilizador.email + ",["
        + utilizador.filiacao.estudante + ";" + utilizador.filiacao.docente + ";"
        + utilizador.filiacao.curso + ";" + utilizador.filiacao.departamento + "],"
        + inspect(utilizador.dataRegisto) + "," + inspect(utilizador.dataUltimoAcesso) + ","
        + utilizador.password + "," + utilizador.nivel


    return linha;
}
module.exports.utilizadorToCSV = utilizadorToCSV

//"_id,titulo,subtitulo,dataCriacao,dataRegisto,produtor,visibilidade,[likes],[hastags],[post]\n"

recursoToCSV = (recurso) => {
    var linha = recurso._id + "," + recurso.titulo + ","
        + recurso.subtitulo + "," + inspect(recurso.dataCriacao) + ","
        + inspect(recurso.dataRegisto) + "," + recurso.produtor + ","
        + recurso.visibilidade + ",["


    for (var i = 0; i < recurso.likes.length; i++) {

        linha += recurso.likes[i]
        if (i + 1 != recurso.likes.length) linha += ";"
    }
    linha = linha + "],["
    for (var i = 0; i < recurso.hashtags.length; i++) {

        linha += recurso.hashtags[i]
        if (i + 1 != recurso.hashtags.length) linha += ";"
    }

    linha = linha + "],["

    //Posts
    for (var i = 0; i < recurso.posts.length; i++) {
        
        linha += postToCSV(recurso.posts[i])
        if (i + 1 != recurso.posts.length) linha += ";"
    }
    linha = linha + "]"

    return linha;
}
module.exports.recursoToCSV = recursoToCSV

postToCSV = (post) => {


    var linha = "[" + post.meta.id + "#" + post.meta.nome + "#"
        + post.meta.conteudo + "#" + inspect(post.meta.data) + "|";

    //Comentarios
    for (var i = 0; i < post.coments.length; i++) {

        linha += comentToCSV(post.coments[i])
        if (i + 1 != post.coments.length) linha += "|"
    }
    linha = linha + ']';
    return linha;
}
comentToCSV = (coment) => {

    var linha = coment.id + "#" + coment.nome + "#"
        + coment.conteudo + "#" + inspect(coment.data) ;

    return linha;
}

/*
Recursos.list().then(dados=> recursoToCSV(dados))
.catch(err => log(err))

Recursos.list().then(dados=> 
    
    dados.forEach(element => {
        log(recursoToCSV(element))
    }))
.catch(err => log(err))*//*
Recursos.lookUp("2021-01-26T10:24-0.5658912486487504")
    .then(dados => log(recursoToCSV(dados)))
    .catch(err => log(err))
*/