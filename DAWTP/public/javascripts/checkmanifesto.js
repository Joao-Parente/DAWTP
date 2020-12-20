
var fs = require('fs')


processaManifesto =  () => {

    
    var file = require('./manifesto.json')
    console.log(processaPasta('data/',file))
}


processaPasta = (current_path, pasta) => {


    for (ficheiro in pasta.ficheiros)
        if (processaFicheiro(current_path, ficheiro) == false) {
            console.log("Não existe o ficheiro:" +current_path+ficheiro.nome)
            return false
        }

    for (p in pasta.pasta_rec) {
        if (fs.existsSync(current_path + p.nome)==false){
            console.log(pasta.pasta_rec[0].nome)
            console.log(p)
            console.log("A pasta não existe: "+ current_path+ p.nome)
            return false
        } 
        if( processaPasta(current_path+p.nome+'/',p.pasta)==false) return false
    }

    return true;
}



processaFicheiro = (current_path, ficheiro) => {


    try {

        if (fs.existsSync(current_path + ficheiro.nome)) return true
        else return false

    } catch (err) {
        console.error(err)
    }


    return false;
}

var p=processaManifesto();