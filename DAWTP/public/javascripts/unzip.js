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

module.exports.zip = (path,nome) =>{


    var zip = new AdmZip();

    fs.readdirSync(path).forEach((file) => {
        if(fs.lstatSync(path+file).isDirectory()) {
         zip.addLocalFolder(path+file)
        } else {
         zip.addLocalFile(path+file)
        }
       })
        zip.writeZip(path+nome)
    


}
