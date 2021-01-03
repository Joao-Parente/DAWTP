$(function(){

    $.get('http://localhost:7770/publicacoes/def/1/coments',function(data){
        
        JSON.parse(data).forEach(p => {
            console.log("p")
            console.log("OLAAAAAAAAAAAAAAAAAAAAAAAAA "+ idr +idp)
            $("#comentList").append("<li>" +"("+p.data+")   "+":"+ p.nome +": "+p.conteudo +" </li>"); 
        });
    })

    $("#addComent").click(function(){

        $("#comentList").append("<li>" +  $("#comentText").val()  +  "</li>");

        $.post('http://localhost:7770/publicacoes/2/3/coments',$("#myPost").serialize())
        alert('Record inserted: ' + JSON.stringify($("#myPost").serialize()))
        $("#comentText").val("");
    })
})