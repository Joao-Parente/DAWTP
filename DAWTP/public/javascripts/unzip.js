var AdmZip = require('adm-zip');
const fs = require('fs');

const { unzip } = require('zlib');
var u = require('unzip-stream')
var {log}= require('./debug')

unzipBigFiles = (file) => {

    return new Promise((resolve) => {

        
    var stream=fs.createReadStream(file).pipe(u.Extract({ path: file + 'dir' }));

    stream.on("end", () => resolve());
    stream.on("close", () => resolve());
    stream.on("error", error => {log("Erro: "+error);resolve()});

    //stream.on('end', () =>{fs.unlinkSync(file);log('terminei');resolve()});
    })
    
}
module.exports.unzipBigFiles = unzipBigFiles

module.exports.unzip = (file) => {

    var extract_fileto = file + 'dir'


    fs.mkdirSync(extract_fileto)

    var zip = new AdmZip(file);
    zip.extractAllTo(extract_fileto, false)


    fs.unlinkSync(file)

}

module.exports.zip = (path, nome) => {

    var zip = new AdmZip();


    var tempzip = __dirname + '/../../tempzip/' + nome;
    var local_folder = __dirname + '/../' + path

    zip.addLocalFolder(local_folder)

    zip.writeZip(tempzip);

}

module.exports.create_zip = () => {
    return new AdmZip()
}

module.exports.add_folder_to_zip = (path, zip) => {
    zip.addLocalFolder(__dirname + '/../' + path)
}
module.exports.add_file_to_zip = (path, zip, callback) => {

    zip.addLocalFile(__dirname + '/../' + path)
}
module.exports.close_zip = (nome, zip) => {
    zip.writeZip(__dirname + '/../../tempzip/' + nome);
}

//unzipBigFiles('/media/jpedro/D/EXPORT\ SIPS/maxzip.zip').then(() => log("works!!"))

