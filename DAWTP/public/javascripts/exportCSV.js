


var fs = require('fs');
var {log}= require('./debug')

module.exports.exportCSV = (listRecurso) => {

    var linha="";
    listRecurso.forEach(recurso => {
        linha+=recursoToCSV(recurso)
    });

    log(JSON.stringify(linha))

}


recursoToCSV = (recurso) => {
    var linha = recurso.id + "," + recurso.titulo + ","
        + recurso.subtitulo + "," + recurso.dataCriacao + ","
        + recurso.dataRegisto + "," + recurso.produtor + ","
        + recurso.visibilidade + "," + recurso.likes + ","
        + recurso.path + "," + recurso.manifesto + ",["

    for (var i=0; i < recurso.hashtags.length; i++) {

        linha += recurso.hashtags[i]
        if (i + 1 != recurso.hashtags.length) linha += ","
    }

    linha = linha + "],["

    log("ccccccccccccccccccccc")
    //posts
    for (var i=0; i < recurso.posts.length; i++) {
        log("aaaaaaaaaaaaa")
        linha += postToCSV(recurso.posts[i])
        if (i + 1 != recurso.posts.length) linha += ","
    }
    linha = linha + "]"
    return linha;
}

postToCSV = (post) => {
 

    log("ddddddddddddddd")
    var linha = "["+post.meta.id+","+post.meta.nome+","
    +post.meta.conteudo+","+post.meta.data+",[";

    //comentarios
    for (var i=0; i < post.coments.length; i++) {

        linha += comentToCSV(post.coments[i])
        if (i + 1 != post.coments.length) linha += ","
    }
    linha = linha +']]';
    return linha;
}
comentToCSV = (coment) => {

    var linha= "[" + coment.id +","+ coment.nome+","
    +coment.conteudo+","+ coment.data+"]";

    return linha;
}

