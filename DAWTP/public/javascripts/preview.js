function preview(tipo,nome,pfileStore,down){
    var ficheiro;
    switch (tipo){
        case 'png' :  ficheiro= '<img src="'+ pfileStore + '" width="100%",height="700" />';break;
        
        case 'pdf' :  ficheiro= '<object data="'+pfileStore + '" width="100%", height="700"></object>';break;
        
        case 'js' :  ficheiro= '<object data="'+pfileStore + '" width="100%", height="700"></object>';break;

        


        default:
            ficheiro= '<object data="'+pfileStore + '" width="100%", height="700"></object>';
    
    }
    
    var fileObject = $(`
         <div class="w3-row w3-margin-bottom">
            <div class=" s6">
                ${ficheiro}
            </div>   
        </div>
            
    `)

    var download = $('<div><a href="' + down + '">Download</a><div class="w3-rest s6 w3-border"><p>Filename: '+nome+'</p><p>Mimetype: '+tipo+'</p></div></div>')
    $("#display").empty()
    $("#display").append(fileObject,download)
    $("#display").modal()   
}