var AdmZip = require('adm-zip');
const fs = require('fs');

var archiver = require('archiver-promise');
 
    
module.exports.unzip = (file) => {

    var extract_fileto = file + 'dir'

    console.log("File: " + extract_fileto)

    fs.mkdirSync(extract_fileto)


    var zip = new AdmZip(file);
    zip.extractAllTo(extract_fileto, false)


    fs.unlinkSync(file)

}

module.exports.zip = (path, nome) => {

    var zip = new AdmZip();


    var tempzip= __dirname+'/../../tempzip/'+nome;

    zip.addLocalFolder(path)

    zip.writeZip(tempzip);

}
