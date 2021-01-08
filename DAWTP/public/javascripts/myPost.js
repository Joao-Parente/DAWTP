$(function(){

    $.get({url:'http://localhost:7770/publicacoes/'+idr+'/'+idp+'/coments',cache: false},function(data){
        
        JSON.parse(data).forEach(p => {
            console.log("p")
            console.log("OLAAAAAAAAAAAAAAAAAAAAAAAAA "+ idr +idp    )
            $("#comentList").append("<li>" +"("+p.data+")   "+":"+ p.nome +": "+p.conteudo +" </li>"); 
        });
    })

    $("#addComent").click(function(){

       // $("#comentList").append("<li>" +  $("#comentText").val()  +  "</li>");

        $.post({url:'http://localhost:7770/publicacoes/'+idr+'/'+idp+'/coments',cache: false},$("#myPost").serialize())
        //alert('Record inserted: ' + JSON.stringify($("#myPost").serialize()))
        //$("#comentText").val("");

        $("#comentList").empty();
        $.get({url:'http://localhost:7770/publicacoes/'+idr+'/'+idp+'/coments',cache: false},function(data){
            
            JSON.parse(data).forEach(p => {
                console.log("p")
                console.log("OLAAAAAAAAAAAAAAAAAAAAAAAAA "+ idr +idp    )
                $("#comentList").append("<li>" +"("+p.data+")   "+":"+ p.nome +": "+p.conteudo +" </li>"); 
            });
        })
    })
})