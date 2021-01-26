const Recursos = require('../../controllers/recursos');
const User = require('../../controllers/utilizadores');
const Tipos = require('../../controllers/tipos');

var exports = require('./exportCSV')
var { log } = require('./debug')


// utilizador "_id,nome,email,[estudante,docente,curso,departamento],dataRegisto,dataUltimoAcesso,password,nivel\n"


csvToUtilizador = (csv) => {

    var user = {}
    var partes = csv.split(',')

    user._id = partes[0]
    user.nome = partes[1]
    user.email = partes[2]
    user.filiacao = csvtoFil(partes[3])
    user.dataRegisto = partes[4]
    user.dataUltimoAcesso = partes[5]
    user.password = partes[6]
    user.nivel = partes[7]

    return user
}
module.exports.csvToUtilizador = csvToUtilizador

csvtoFil = (csv) => {

    var fil = {}
    var partes = csv.replace(/[\]\[]/g, '').split(';')
    fil.estudante = partes[0]
    fil.docente = partes[1]
    fil.curso = partes[2]
    fil.departamento = partes[3]
    return fil

}
//tipo  "_id,[param]\n"
csvToTipo = (csv) => {

    var tipo = {}
    var partes = csv.split(',')
    tipo.nome = partes[0];

    tipo.parametros = []
    partes[1].replace(/[\]\[]/g, '').split(';').forEach(param => {
        tipo.parametros.push(csvToParam(param))
    })
    return tipo
}
csvToParam = (csv) => {
    var param = {}
    var partes = csv.split('#')
    param.nome_param = partes[0]
    param.tipo_param = partes[1]
    return param
}

module.exports.csvToTipo = csvToTipo



// reccurso "_id,titulo,subtitulo,dataCriacao,dataRegisto,produtor,visibilidade,[likes],[hastags],[post]\n"
csvToRecurso = (csv) => {


    var obj_Recurso = {}

    var partes = csv.split(',')


    obj_Recurso._id = partes[0]
    obj_Recurso.titulo = partes[1]
    obj_Recurso.subtitulo = partes[2]
    obj_Recurso.dataCriacao = partes[3]
    obj_Recurso.dataRegisto = partes[4]
    obj_Recurso.produtor = partes[5]
    obj_Recurso.visibilidade = partes[6]


    obj_Recurso.likes = []
    partes[7].replace(/[\]\[]/g, '').split(';').forEach(like => {
        if (like != '') obj_Recurso.likes.push(like)
    })
    obj_Recurso.hashtags = []
    partes[8].replace(/[\]\[]/g, '').split(';').forEach(tag => {
        if (tag != '') obj_Recurso.hashtags.push(tag)
    })

    obj_Recurso.posts = []
    partes.slice(9).join(',').replace(/[\]\[]/g, '').split(';').forEach(post => {
        if (post) obj_Recurso.posts.push(csvToPost(post))
    })


    return obj_Recurso
}
module.exports.csvToRecurso = csvToRecurso



csvToPost = (csv) => {

    var postaux = {}
    log(csv)
    var partes = csv.split('|')

    postaux.meta = csvToComent(partes[0])


    postaux.coments = [] 
    partes.slice(1).forEach(comentario => {
        if (comentario) postaux.coments.push(csvToComent(comentario))
    })


    return postaux;
}

//[idestu,nomesest,ola joaquo,Fri Jan 22 2021 11:49:00 GMT+0000 (Hora padrão da Europa Ocidental)]
csvToComent = (csv) => {

    var postmeta = {}

    var campos = csv.split('#')

    postmeta._id = campos[0]
    postmeta.nome = campos[1]
    postmeta.conteudo = campos[2]
    postmeta.data = campos[3]

    return postmeta;
}

//var csv1="2021-01-26T11:37-0.5873407756472404,teste1,,2021-01-26T11:37:00.000Z,2021-01-26T11:35:00.000Z,admin,publico,[],[tag1;tag2;tag3;tag1;tag2;tag3;tag1;tag2;tag3;tag1;tag2;tag3;tag1;tag2;tag3;tag1;tag2;tag3;tag1;tag2;tag3],[]2021-01-26T11:38-0.17358817452412234,teste1,,2021-01-26T11:38:00.000Z,2021-01-26T11:35:00.000Z,admin,publico,[],[],[[2021-01-26T11:38f0.39244083901247095#user_na_sessao# conteudo#2021-01-26T11:38:00.000Z|idestu#nomesest#ola ,,,,,,,,,,,,,,,,,,,,,, joaquim,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,###!!!|||||#2021-01-26T11:38:00.000Z]]"

//log(this.csvToRecurso(csv1).posts[0].coments)