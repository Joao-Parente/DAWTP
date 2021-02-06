var n=0
function addparam(){ 
    console.log('Está a funcionar')
    
    n++;

    var element = document.getElementById('grupo')
    var nome = element.getElementsByTagName('label')[0].cloneNode(true)
    var nome_param = element.getElementsByTagName('input')[0].cloneNode(true)
    var tipo = element.getElementsByTagName('label')[1].cloneNode(true)
    var tipo_param = element.getElementsByTagName('select')[0].cloneNode(true)

    nome_param.value = "";
    tipo_param.value = "";

    element.append(nome)
    element.append(nome_param)
    element.append(tipo)
    element.append(tipo_param)

    console.log(n)
    document.getElementById('count').value = n; 
}