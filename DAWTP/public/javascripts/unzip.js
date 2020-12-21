var AdmZip = require('adm-zip');
const fs = require('fs'); 



module.exports.unzip = (file) => {

    var extract_fileto=file+'dir'

    console.log("File: " + extract_fileto)

    fs.mkdirSync(extract_fileto)
    
      
    var zip = new AdmZip(file);
    zip.extractAllTo(extract_fileto, false)
        
        
    fs.unlinkSync(file)
    

}
