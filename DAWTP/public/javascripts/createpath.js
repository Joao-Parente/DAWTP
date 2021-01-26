createPath = (dados) => {

    //verifica se o nome para a pasta é válido
    if (dados.hashtags.length > 0 && dados.hashtags[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").match(/^(\w+\.?)*\w+$/)) {
        var dest = 'fileStore/' + dados.hashtags[0] + '/';
    }
    else {
        var dest = 'fileStore/others/';
    }


    return dest;
}
module.exports.createPath = createPath;