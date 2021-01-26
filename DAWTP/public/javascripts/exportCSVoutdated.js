var fs = require('fs');
const recursos = require('../../models/recursos');
var { log } = require('./debug')
const Recursos = require('../../controllers/recursos');

const { inspect } = require('util');
module.exports.csvRecurso = "id,titulo,subtitulo,dataCriacao,dataRegisto,produtor,visibilidade,likes,[hastags],[post]\n"
module.exports.csvUtilizador = "nome,email,[estudante,docente,curso,departamento],dataRegisto,dataUltimoAcesso,username,password,nivel,[post]\n"
module.exports.csvTipo= "nome,[param]\n"

tipoToCSV = (tipo) => {
    var linha = tipo.nome + ",[" 

    for (var i = 0; i < tipo.parametros.length; i++) {

        linha += '[' +tipo.parametros[i].nome_param+ ','+tipo.parametros[i].tipo_param+']' 
        if (i + 1 != tipo.parametros.length) linha += ";"
    }
    linha += "]\n"

    return linha;
}
module.exports.tipoToCSV = tipoToCSV



utilizadorToCSV = (utilizador) => {
    var linha = utilizador.nome + "," + utilizador.email + ",["
        + utilizador.filiacao.estudante + ";" + utilizador.filiacao.docente + ";"
        + utilizador.filiacao.curso + ";" + utilizador.filiacao.departamento + "],"
        + JSON.stringify(utilizador.dataRegisto).slice(1).slice(0, -1) + "," + JSON.stringify(utilizador.dataUltimoAcesso).slice(1).slice(0, -1) + ","
        + utilizador.username + "," + utilizador.password + ","
        + utilizador.nivel
        + ",["
    for (var i = 0; i < utilizador.posts.length; i++) {

        linha += utilizador.posts[i]
        if (i + 1 != utilizador.posts.length) linha += ","
    }
    linha += "]\n"

    return linha;
}



module.exports.utilizadorToCSV = utilizadorToCSV

recursoToCSV = (recurso) => {

 
    var linha="";
    linha+=inspect(recurso._id) +","
    linha+=inspect(recurso.titulo) +","
    linha+=inspect(recurso.dataCriacao)  +","
    linha+=inspect(recurso.dataRegisto) +","
    linha+=inspect(recurso.produtor) +","
    linha+=inspect(recurso.visibilidade) +","
    linha+=inspect(recurso.likes) +","



   /* var linha = recurso._id + "," + recurso.titulo + ","
        + recurso.subtitulo + "," + JSON.stringify(recurso.dataCriacao).slice(1).slice(0, -1) + ","
        + JSON.stringify(recurso.dataRegisto).slice(1).slice(0, -1) + "," + recurso.produtor + ","
        + recurso.visibilidade + "," + recurso.likes + ","
        + ",["*/
/*
    for (var i = 0; i < recurso.hashtags.length; i++) {

        linha += '\"' + recurso.hashtags[i] + '\"'
        if (i + 1 != recurso.hashtags.length) linha += ","
    }

    linha = linha + "],["

    log("ccccccccccccccccccccc")
    //posts
    for (var i = 0; i < recurso.posts.length; i++) {
        log("aaaaaaaaaaaaa")
        linha += postToCSV(recurso.posts[i])
        if (i + 1 != recurso.posts.length) linha += ";"
    }
    linha = linha + "]\n"*/
    return linha;
}
module.exports.recursoToCSV = recursoToCSV

postToCSV = (post) => {


    log("ddddddddddddddd")
    var linha = "[" + post.meta.id + "," + post.meta.nome + ","
        + post.meta.conteudo + "," + JSON.stringify(post.meta.data).slice(1).slice(0, -1) + ",[";

    //comentarios
    for (var i = 0; i < post.coments.length; i++) {

        linha += comentToCSV(post.coments[i])
        if (i + 1 != post.coments.length) linha += ","
    }
    linha = linha + ']]';
    return linha;
}
comentToCSV = (coment) => {
   
    var linha = "[" + coment.id + "," + coment.nome + ","
        + coment.conteudo + "," + JSON.stringify(coment.data).slice(1).slice(0, -1) + "]";

    return linha;
}

/*
Recursos.list().then(dados=> recursoToCSV(dados))
.catch(err => log(err))

Recursos.list().then(dados=> 
    
    dados.forEach(element => {
        log(recursoToCSV(element))
    }))
.catch(err => log(err))*/

Recursos.lookUp("2021-01-25T14:00-0.7428438534803048")

.then ( element => log(recursoToCSV(element)))
.catch(err => log(err))