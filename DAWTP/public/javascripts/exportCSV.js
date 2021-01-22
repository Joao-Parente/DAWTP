


var fs = require('fs');
var { log } = require('./debug')
var Recursos = require('./../../controllers/recursos')
/*
exportCSV= (listRecurso) => {

    var linha="id ,titulo,subtitulo,dataCriacao,dataRegisto,produtor,visibilidade,likes,[hastags],[post]\n"

    listRecurso.forEach(recurso => {
        linha+=recursoToCSV(recurso)
    });

   // log(JSON.stringify(linha))
   fs.writeFileSync('/home/jpedro/Desktop/playground/recursos.csv', linha, (err) => {
    if (err) {
        throw err;
    }})

}

module.exports.exportCSV= exportCSV*/
module.exports.csvRecurso = "id,titulo,subtitulo,dataCriacao,dataRegisto,produtor,visibilidade,likes,[hastags],[post]\n"
module.exports.csvUtilizador = "nome,email,[estudante,docente,curso,departamento],dataRegisto,dataUltimoAcesso,username,password,nivel,[post]"

utilizadorToCSV = (utilizador) => {
    var linha = utilizador.nome + "," + utilizador.email + ",["
        + utilizador.filiacao.estudante + "," + utilizador.filiacao.docente + ","
        + utilizador.filiacao.curso + "," + utilizador.filiacao.departamento + "],"
        + utilizador.dataRegisto + "," + utilizador.dataUltimoAcesso + ","
        + utilizador.username + "," + utilizador.password + ","
        + utilizador.nivel
        + ",["
    for (var i = 0; i < utilizador.posts.length; i++) {

        linha += utilizador.posts[i]
        if (i + 1 != recurso.hashtags.length) linha += ","
    }
    linha += "]\n"

    return linha;
}



module.exports.utilizadorToCSV = utilizadorToCSV

recursoToCSV = (recurso) => {
    var linha = recurso.id + "," + recurso.titulo + ","
        + recurso.subtitulo + "," + recurso.dataCriacao + ","
        + recurso.dataRegisto + "," + recurso.produtor + ","
        + recurso.visibilidade + "," + recurso.likes + ","
        + ",["

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
        if (i + 1 != recurso.posts.length) linha += ","
    }
    linha = linha + "]\n"
    return linha;
}
module.exports.recursoToCSV = recursoToCSV

postToCSV = (post) => {


    log("ddddddddddddddd")
    var linha = "[" + post.meta.id + "," + post.meta.nome + ","
        + post.meta.conteudo + "," + post.meta.data + ",[";

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
        + coment.conteudo + "," + coment.data + "]";

    return linha;
}

/*
Recursos.list().then(dados=> exportCSV(dados))
.catch(err => log(err))
*/