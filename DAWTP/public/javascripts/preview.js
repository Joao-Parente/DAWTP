function preview(t,p,down){//tipo,path){
//console.log("path " + path +" tipo e "+tipo )
    console.log("PATHHHH"+p);    

    var tipo='js'
    var nome="ola"
    var path= "/images/789.js"

    var ficheiro;
    switch (tipo){
        case 'png' :  ficheiro= '<img src="'+ path + '" width="80%" />';break;
        
        case 'pdf' :  ficheiro= '<object data="'+path + '"></object>';break;
        
        case 'js' :  ficheiro= '<object data="'+path + '"></object>';break;



        default:
            var ficheiro = '<p>' + nome+ ', ' + type + '</p>'

    }

    var fileObject = $(`
    <div class="w3-row w3-margin-bottom">
            <div class="w3-col s6">
                ${ficheiro}
            </div>   


            <div class="w3-col s6 w3-border">
                <p>Filename: ${nome}</p>
                <p>Mimetype: ${tipo}</p>
            </div>
    </div>

    `)

    var download = $('<div><a href="' + down + '">Download</a></div>')
    $("#display").empty()
    $("#display").append(fileObject,download)
    $("#display").modal()   
}