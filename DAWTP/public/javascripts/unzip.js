var AdmZip = require('adm-zip');
const fs = require('fs');
var { log } = require('./debug')

/*
var u = require('unzip-stream')
const { spawn } = require('child_process');
var pat = require('path')

unzipBigFiles = (file) => {

    return new Promise((resolve) => {


        var stream = fs.createReadStream(file).pipe(u.Extract({ path: file + 'dir' }));

        stream.on("end", () => resolve());
        stream.on("close", () => resolve());
        stream.on("error", error => { log("Erro: " + error); resolve() });

    })

}
module.exports.unzipBigFiles = unzipBigFiles

zipBigFiles = (path, nome) => {

    return new Promise((resolve) => {

        var tempzip = __dirname + '/../../tempzip/' + nome;
        var file_or_folder = __dirname + '/../' + path
    

        const ls = spawn('zip', ['-r', tempzip,pat.basename(file_or_folder),"manifesto.json" ],{cwd:pat.resolve(file_or_folder, '..')});

        ls.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve()
        });
    })
}
module.exports.zipBigFiles = zipBigFiles

zipAddtoBigZip = (file,nome_zip)=> {

    return new Promise((resolve) => {


        const ls = spawn('zip', ['-r',__dirname + '/../../tempzip/' + nome_zip, pat.basename(file)],{cwd:pat.resolve(file, '..')});


        ls.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve()
        });
    })
}
module.exports.zipAddtoBigZip = zipAddtoBigZip





*/


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
