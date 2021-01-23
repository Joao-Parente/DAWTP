


var fs = require('fs');
const { parse } = require('path');
var { log } = require('./debug')

//id,teste param certo,,null,data,depende do login,null,0,path,mani,[],posts
//var csv ='2021-01-22T11:47-0.5628631199793168,titulo1,subtitutlo,2024-04-23T00:00:00.000Z,2021-01-22T11:47:00.000Z,depende do login,privado,0,,["ola","joaquim"],[[2021-01-22T11:49f0.24918326421872572,user_na_sessao, conteudo,2021-01-22T11:49:00.000Z,[[idestu,nomesest,ola joaquo,2021-01-22T11:49:00.000Z],[idestu,nomesest,ola joaquo,2021-01-22T11:49:00.000Z]]];[2021-01-22T12:36f0.6196723084334976,user_na_sessao, conteudo,2021-01-22T12:36:00.000Z,[[idestu,nomesest,mfsdimf,2021-01-22T12:36:00.000Z],[idestu,nomesest,mfsdimf,2021-01-22T12:36:00.000Z]]]]'


//id,teste param certo,,null,data,depende do login,null,0,path,mani,[],[posts]
//"nome,email,[estudante;docente;curso;departamento],dataRegisto,dataUltimoAcesso,username,password,nivel,[post]"
//module.exports.csvTipo= "nome,[param]"

csvToUtilizador = (csv) => {

    var user={}
    var partes = csv.split(',')
    user.nome=partes[0]
    user.email=partes[1]
    user.filiacao=csvtoFil(partes[2].slice(1).slice(0,-1))
    user.dataRegisto=partes[3]
    user.dataUltimoAcesso=partes[4]
    user.username=partes[5]
    user.password=partes[6]
    user.nivel=partes[7]
    user.posts=partes[8]

    return user
}
module.exports.csvToUtilizador = csvToUtilizador

csvtoFil=(csv)=>{

    var fil={}
    var partes = csv.split(';')
    fil.estudante=partes[0]
    fil.docente=partes[1]
    fil.curso=partes[2]
    fil.departamento=partes[3]
    return fil

}

csvToTipo = (csv) => {

    var tipo = {}
    var partes = csv.split(',')
    tipo.nome = partes[0];

    tipo.parametros = []
    partes.slice(1).join(',').replace(/[\]\[]/g, '').split(';').forEach(param => {
        tipo.parametros.push(csvToParam(param))
    })
    return tipo
}


csvToParam = (csv) => {
    var param={}
    var partes= csv.split(',')
    param.nome_param=partes[0]
    param.tipo_param=partes[1]
    return param
}

module.exports.csvToTipo = csvToTipo








csvToRecurso = (csv) => {


    var obj_Recurso = {}

    var partes = csv.split('[')

    var parte1 = partes[0].split(',')
    obj_Recurso.id = parte1[0]
    obj_Recurso.titulo = parte1[1]
    obj_Recurso.subtitulo = parte1[2]
    obj_Recurso.dataCriacao = parte1[3]
    obj_Recurso.dataRegisto = parte1[4]
    obj_Recurso.produtor = parte1[5]
    obj_Recurso.visibilidade = parte1[6]
    obj_Recurso.likes = parte1[7]



    obj_Recurso.hashtags = partes[1].substring(0, partes[1].length - 2).replace(/\"+/g, '')

    var l = ""
    partes.slice(2).forEach(cont => {
        l += "[" + cont;
    })

    var obj = []
    l.slice(1).substring(0, l.length - 2).split(';').forEach(
        post => obj.push(csvToPost(post))
    )
    obj_Recurso.posts = obj;

      
    return obj_Recurso
}
module.exports.csvToRecurso = csvToRecurso



csvToPost = (csv) => {

    var postaux = {}

    var partes = csv.split('[').slice(1)

    postaux.meta = csvToComent(partes[0])


    postaux.coments = []
    //falta comentarios   
    partes.slice(2).forEach(comentario => {
        postaux.coments.push(csvToComent(comentario))
    })


    return postaux;
}

//[idestu,nomesest,ola joaquo,Fri Jan 22 2021 11:49:00 GMT+0000 (Hora padrão da Europa Ocidental)]
csvToComent = (csv) => {

    var postmeta = {}
    var campos = csv.split(',')

    postmeta.id = campos[0]
    postmeta.nome = campos[1]
    postmeta.conteudo = campos[2]
    postmeta.data = campos[3].replace(/\]+/, '')

    return postmeta;
}

//csvToRecurso('2021-01-22T11:47-0.5628631199793168,titulo1,subtitutlo,2024-04-23T00:00:00.000Z,2021-01-22T11:47:00.000Z,depende do login,privado,0,,["ola","joaquim"],[[2021-01-22T11:49f0.24918326421872572,user_na_sessao, conteudo,2021-01-22T11:49:00.000Z,[[idestu,nomesest,ola joaquo,2021-01-22T11:49:00.000Z],[idestu,nomesest,ola joaquo,2021-01-22T11:49:00.000Z]]];[2021-01-22T12:36f0.6196723084334976,user_na_sessao, conteudo,2021-01-22T12:36:00.000Z,[[idestu,nomesest,mfsdimf,2021-01-22T12:36:00.000Z],[idestu,nomesest,mfsdimf,2021-01-22T12:36:00.000Z]]]]')