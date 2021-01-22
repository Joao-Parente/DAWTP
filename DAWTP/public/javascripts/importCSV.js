


var fs = require('fs');
var { log } = require('./debug')

//id,teste param certo,,null,data,depende do login,null,0,path,mani,[],posts
var csv = "2021-01-08T20:57-0.45056682335108156,ex2,,Thu Oct 13 2016 01:00:00 GMT+0100 (Hora de verão da Europa Ocidental),Fri Jan 08 2021 20:57:00 GMT+0000 (Hora padrão da Europa Ocidental),depende do login,null,0,/home/jpedro/Documentos/MIEI/Miei MEU/4 Ano/1 Semestre/Desenvolvimento de aplicações Web/Trabalho_Pratico/DAWTP/DAWTP/controllers/../public/fileStore/2021-01-08T20:57-0.45056682335108156,{\"ficheiros\":[{\"nome\":\"manuel.pdf\",\"tipo\":\"pdf\",\"meta\":[{\"nome\":\"numero_pags\",\"valor\":\"3\"}]}],\"pasta_rec\":[{\"nome\":\"pasta1\",\"pasta\":{\"ficheiros\":[{\"nome\":\"teste.pdf\",\"tipo\":\"pdf\",\"meta\":[{\"nome\":\"numero_pags\",\"valor\":\"3\"}]}],\"pasta_rec\":[]}}]},[ok,lp],[[2021-01-08T21:06f0.9533242495320156,user_na_sessao, conteudo,Fri Jan 08 2021 21:06:00 GMT+0000 (Hora padrão da Europa Ocidental),[[idestu,nomesest,1 st coment,Fri Jan 08 2021 21:06:00 GMT+0000 (Hora padrão da Europa Ocidental)],[idestu,nomesest,1 st coment,Fri Jan 08 2021 21:06:00 GMT+0000 (Hora padrão da Europa Ocidental)]]]]"


//id,teste param certo,,null,data,depende do login,null,0,path,mani,[],[posts]
importCSV = (path) => {


    var obj_Recurso = {}

    var partes = csv.split('{')

    var parte1 = partes[0].split(',')
    obj_Recurso.id = parte1[0]
    obj_Recurso.titulo = parte1[1]
    obj_Recurso.subtitulo = parte1[2]
    obj_Recurso.dataCriacao = parte1[3]
    obj_Recurso.dataRegisto = parte1[4]
    obj_Recurso.produtor = parte1[5]
    obj_Recurso.visibilidade = parte1[6]
    obj_Recurso.likes = parte1[7]


    var partes2_3 = partes.slice(1).join('{').split('}')

    // log(partes2_3)
    //,[hashtags],[posts]
    var hash_posts = partes2_3.pop()

    //slice(1).split('],');
    hash_posts = hash_posts.slice(1).split('],')
    log(hash_posts)

    obj_Recurso.hashtags = hash_posts[0] + ']'
    
    log( obj_Recurso.hashtags)
    obj_Recurso.posts=hash_posts.slice(1).join('],')
    log( obj_Recurso.posts)
    //obj_Recurso.manifesto= '{'+partes2_3 +'}'

    log('{'+partes2_3.join('}')+'}')

    fs.writeFileSync('/home/jpedro/Desktop/playground/import.json', JSON.stringify(obj_Recurso), (err) => {
        if (err) {
            throw err;
        }
    })



}
module.exports.importCSV = importCSV


//importCSV(2)