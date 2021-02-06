var AdmZip = require('adm-zip');
const fs = require('fs');
var { log } = require('./debug')


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
create_zip = () => {
    return new AdmZip()
}

module.exports.create_zip = create_zip

add_folder_to_zip = (path, zip) => {
    log("Adding folder "+__dirname + '/../' + path)

    zip.addLocalFolder(__dirname + '/../' + path)
}
module.exports.add_folder_to_zip = add_folder_to_zip

add_file_to_zip = (path, zip) => {
    log("Adding file "+__dirname + '/../' + path)

    zip.addLocalFile(__dirname + '/../' + path)
}
module.exports.add_file_to_zip = add_file_to_zip

close_zip = (nome, zip) => {
    log("Writing to "+__dirname + '/../../tempzip/' + nome)
    zip.writeZip(__dirname + '/../../tempzip/' + nome);
}
module.exports.close_zip = close_zip
