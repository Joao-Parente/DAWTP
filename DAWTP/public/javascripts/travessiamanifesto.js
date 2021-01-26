var fs = require('fs')



module.exports.travessiaManifesto = (path, manifesto) => {


    var strarray = path.split("/")
    console.log("recurs")
    console.log(strarray)

    for (var i = 0; i < manifesto.pasta_rec.length; i++) {

        if (manifesto.pasta_rec[i].nome == strarray[0]) {




            if (strarray.length == 1) return manifesto.pasta_rec[i].pasta
            else {
                var tail_path = ""
                strarray.slice(1).forEach(function (value) {
                    if (value != "") tail_path += value + '/'
                });
                tail_path = tail_path.slice(0, -1);
                return this.travessiaManifesto(tail_path, manifesto.pasta_rec[i].pasta)

            }
        }

    }
    if (strarray.length==1){
        for (var i = 0; i < manifesto.ficheiros.length; i++) {    
           if  (manifesto.ficheiros[i].nome==strarray[0])return true;
        };

    }

    return null// igual ao de baixo
}
