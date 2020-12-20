
var fs = require('fs')



module.exports.processaManifesto = (path) => {

    var manifesto = path + '/manifesto.json'


    if (fs.existsSync(manifesto)) {

       
        //console.log("Manifesssto            " + manifesto)
        var file = require(manifesto)
        if (processaPasta(path + '/data/', file)) return true
    }
    

    return false
}


processaPasta = (current_path, pasta) => {

    var flag = true;


    pasta.ficheiros.forEach((ficheiro) => {
        if (processaFicheiro(current_path, ficheiro) == false) {
            //console.log("Não existe o ficheiro: " + current_path + ficheiro.nome)
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

           // console.log("ficheiro tipo:" + ficheiro.tipo)

            //checkar se o tipo ta bom
            //checkar a meta do tipo


            return true
        }
        else return false

    } catch (err) {
        console.error(err)
    }


    return false;
}
