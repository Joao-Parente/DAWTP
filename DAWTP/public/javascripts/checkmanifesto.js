
var fs = require('fs')
var Tipo = require('../../controllers/tipos')
var { log } = require('../../public/javascripts/debug')


var tipos = undefined;

processaManifesto = (path, t) => {

    var manifesto = path + '/manifesto.json'


    if (fs.existsSync(manifesto)) {


        //console.log("Manifesssto            " + manifesto)
        try { var file = require(manifesto) }
        catch {
            console.log("Manifesto não respeita o formato json")
            return false
        }
        tipos = t;
        log("dsnfsdfndjsn:                     " + path + '/data/')
        if (processaPasta(path + '/data/', file)) return true;

    }


    return false
}
module.exports.processaManifesto = processaManifesto;

processaPasta = (current_path, pasta) => {

    var flag = true;


    pasta.ficheiros.forEach((ficheiro) => {
        console.log("helo")

        if (processaFicheiro(current_path, ficheiro) == false) {
            //console.log("Não existe o ficheiro: " + current_path + ficheiro.nome)
            log("houve um ficheiro que deu false")
            flag = false
        }
        //console.log("Existe o ficheiro: " + current_path + ficheiro.nome)
    })

    if (flag) {
        pasta.pasta_rec.forEach((p) => {
            if (fs.existsSync(current_path + p.nome) == false) {

                //console.log("A pasta não existe: " + current_path + p.nome)

                flag = false
            }
            else if (processaPasta(current_path + p.nome + '/', p.pasta) == false) flag = false
        })
    }

    return flag;
}




processaFicheiro = (current_path, ficheiro) => {


    try {

        if (fs.existsSync(current_path + ficheiro.nome)) {




            var data = tipos.find(a => a.nome == ficheiro.tipo)

            if (data != undefined) {
                for (var i = 0; i < ficheiro.meta.length; i++) {


                    var meta1_tipo = data.parametros.find(a => a.nome_param == ficheiro.meta[i].nome)

                    if (meta1_tipo && meta1_tipo.tipo_param.toUpperCase() == (typeof ficheiro.meta[i].valor).toUpperCase()) { log("all GUDDDDDDDDDDD") }


                    else {
                        log("devia ser:" + meta1_tipo.tipo_param.toUpperCase())
                        log("era: " + ficheiro.meta[i].valor.toUpperCase())
                        log("tipo:" + (typeof ficheiro.meta[i].valor).toUpperCase())
                        log("errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrorrrrrrrrrrrrrrr"); return false;
                    }

                }
                return true

            }
        }
    } catch (err) { console.error(err); }

    return false
}



/*
Tipo.list().then( dados =>
console.log("K" + processaManifesto('/home/jpedro/Desktop/playground',dados)))
.catch(err=> log(err))*/