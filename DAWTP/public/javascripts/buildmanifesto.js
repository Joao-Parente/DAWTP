
var fs = require('fs')
var patt = require('path');



buildManifesto = (path) => {

  var str=JSON.stringify(bmanaux(path))
   
  fs.writeFileSync(path+'/../manifesto.json', str, (err) => {
    if (err) {
        throw err;
    }})
    console.log(path)
}
module.exports.buildManifesto=buildManifesto


bmanaux = (path) => {


    var obj={ "ficheiros":[],"pasta_rec":[]}

    if (fs.existsSync(path)) {

        var fi = 0;
        var di = 0;

        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;

            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                obj.pasta_rec[di]={"nome":file,"pasta":bmanaux(curPath)}
        
                

                di++;
            } else { // delete file
                var ext = patt.extname(file).slice(1);
                obj.ficheiros[fi]={"nome":file,"tipo":ext, "meta":[]}
                fi++;
            }
        });
    }
    return obj
}


//var x= buildManifesto(__dirname)
