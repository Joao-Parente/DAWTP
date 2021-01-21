var fs = require('fs');


cpRecursivo= function(src,dest){
    cpAux(src,dest)
}

module.exports.cpRecursivo=cpRecursivo

cpAux = function (src,dest) {

    

    if (fs.existsSync(src)) {

        if(fs.existsSync(dest)==false) fs.mkdirSync(dest)
        fs.readdirSync(src).forEach(function (file, index) {

            var curPath = src + "/" + file;
            var outPath = dest + "/" +file;
            console.log("cur:"+curPath +" out:"+outPath)

            if (fs.lstatSync(curPath).isDirectory()) { // recurse               
                cpAux(curPath,outPath);
            } else { // copy file
                fs.copyFileSync(curPath,outPath)
            }
        });
    }
};

cpRecursivo(process.argv[2],process.argv[3])
