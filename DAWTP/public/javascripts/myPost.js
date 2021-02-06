$(function(){

    $.get({url:'http://localhost:7770/publicacoes/'+idr+'/'+idp+'/coments',cache: false},function(data){
        
        JSON.parse(data).forEach(p => {

            $("#comentList").append("<li>" +"("+p.data+")   "+":"+ p.nome +": "+p.conteudo +" </li>"); 
        });
    })

    $("#addComent").click(function(){


        $.post({url:'http://localhost:7770/publicacoes/'+idr+'/'+idp+'/coments',cache: false},$("#myPost").serialize())

        $("#comentList").empty();
        $.get({url:'http://localhost:7770/publicacoes/'+idr+'/'+idp+'/coments',cache: false},function(data){
            
            JSON.parse(data).forEach(p => {

                $("#comentList").append("<li>" +"("+p.data+")   "+":"+ p.nome +": "+p.conteudo +" </li>"); 
            });
        })
    })
})