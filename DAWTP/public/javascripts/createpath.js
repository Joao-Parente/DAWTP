createPath = (dados) => {

    
    hashtag = dados.hashtags.split(",");
    hashtag[0]=hashtag[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "")

    //verifica se o nome para a pasta é válido
    if (hashtag[0].match(/^(\w+\.?)*\w+$/)) {
        var dest = 'fileStore/' + hashtag[0] + '/';
    }
    else {
        var dest = 'fileStore/others/';
    }
    return dest;
}
module.exports.createPath = createPath;