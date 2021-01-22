var AdmZip = require('adm-zip');
const fs = require('fs');

var archiver = require('archiver-promise');
const { create } = require('../../models/tipos');
 
    
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

    zip.addLocalFolder(__dirname+'/../'+path)

    zip.writeZip(tempzip);

}

module.exports.create_zip = () => {
    return new AdmZip()
}

module.exports.add_folder_to_zip = (path,zip)=>{
    zip.addLocalFolder(__dirname+'/../'+path)
}
module.exports.add_file_to_zip = (path,zip,callback)=>{
   
    zip.addLocalFile(__dirname+'/../'+path)
}
module.exports.close_zip = (nome,zip) =>{
    zip.writeZip(__dirname+'/../../tempzip/'+nome);
}
