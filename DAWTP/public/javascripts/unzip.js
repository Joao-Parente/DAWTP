var AdmZip = require('adm-zip');
const fs = require('fs'); 



module.exports.unzip = (file) => {

    var extract_fileto=file+'dir'

    console.log("File: " + extract_fileto)

    fs.mkdir(extract_fileto, function() {
        fs.statSync(extract_fileto).isDirectory();
    });
    
      
    var zip = new AdmZip(file);
    zip.extractAllTo(extract_fileto, false);

    fs.unlinkSync(file)
    

}
